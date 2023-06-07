/* eslint-disable no-new */
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const globals = require('./globals');
const { CLIENT_DB } = require('./constants');
const { ObjectID } = require('mongodb');
const moment = require('moment-timezone');

class FHIRCRUD {
    constructor(COLLECTION, buildStu3SearchQueryFn) {
        this.COLLECTION = COLLECTION;
        this.buildStu3SearchQueryFn = buildStu3SearchQueryFn;
    }

    _getResource(base_version) {
        return resolveSchema(base_version, this.COLLECTION);
    }

    _getMeta(base_version) {
        return resolveSchema(base_version, 'Meta');
    }

    search(args) {
        return new Promise((resolve, reject) => {
            logger.info(`${this.COLLECTION} >>> search`);

            let { base_version } = args;
            let query = this.buildStu3SearchQueryFn(args);

            // Grab an instance of our DB and collection
            let db = globals.get(CLIENT_DB);
            let collection = db.collection(`${this.COLLECTION}_${base_version}`);
            let Resource = this._getResource(base_version);

            // Query our collection for this observation
            collection.find(query, (err, data) => {
                if (err) {
                    logger.error(`Error with ${this.COLLECTION}.search: `, err);
                    return reject(err);
                }

                // Respurce is a cursor, pull documents out before resolving
                data.toArray().then((resources) => {
                    resources.forEach(function (element, i, returnArray) {
                        returnArray[i] = new Resource(element);
                    });
                    resolve(resources);
                });
            });
        });
    }

    searchById(args) {
        return new Promise((resolve, reject) => {
            logger.info(`${this.COLLECTION} >>> searchById`);

            let { base_version, id } = args;
            let Resource = this._getResource(base_version);

            // Grab an instance of our DB and collection
            let db = globals.get(CLIENT_DB);
            let collection = db.collection(`${this.COLLECTION}_${base_version}`);

            // Query our collection for this observation
            collection.findOne({ id: id.toString() }, (err, resource) => {
                if (err) {
                    logger.error(`Error with ${this.COLLECTION}.searchById: `, err);
                    return reject(err);
                }
                if (resource) {
                    resolve(new Resource(resource));
                }
                resolve();
            });
        });
    }

    create(args, { req }) {
        return new Promise((resolve, reject) => {
            logger.info(`${this.COLLECTION} >>> create`);

            let data = req.body;

            let { base_version } = args;

            // Grab an instance of our DB and collection (by version)
            let db = globals.get(CLIENT_DB);
            let collection = db.collection(`${this.COLLECTION}_${base_version}`);

            let Resource = this._getResource(base_version);
            let resource = new Resource(data);

            let id = new ObjectID().toString();

            // Create the resource's metadata
            let Meta = this._getMeta(base_version);
            resource.meta = new Meta({
                versionId: '1',
                lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
            });

            // Create the document to be inserted into Mongo
            let doc = JSON.parse(JSON.stringify(resource.toJSON()));
            Object.assign(doc, { id: id });

            // Create a clone of the object without the _id parameter before assigning a value to
            // the _id parameter in the original document
            let history_doc = Object.assign({}, doc);
            Object.assign(doc, { _id: id });

            // Insert our record
            collection.insertOne(doc, (err) => {
                if (err) {
                    logger.error(`Error with ${this.COLLECTION}.create: `, err);
                    return reject(err);
                }

                // Save the resource to history
                let history_collection = db.collection(`${this.COLLECTION}_${base_version}_History`);

                // Insert our patient record to history but don't assign _id
                return history_collection.insertOne(history_doc, (err2) => {
                    if (err2) {
                        logger.error(`Error with ${this.COLLECTION}History.create: `, err2);
                        return reject(err2);
                    }
                    return resolve({ id: doc.id, resource_version: doc.meta.versionId });
                });
            });
        });
    }

    update(args, { req }) {
        return new Promise((resolve, reject) => {
            logger.info(`${this.COLLECTION} >>> update`);

            let resourceData = req.body;

            let { base_version, id } = args;

            // Grab an instance of our DB and collection
            let db = globals.get(CLIENT_DB);
            let collection = db.collection(`${this.COLLECTION}_${base_version}`);

            // Get current record
            collection.findOne({ id: id.toString() }, (err, data) => {
                if (err) {
                    logger.error(`Error with ${this.COLLECTION}.searchById: `, err);
                    return reject(err);
                }

                let Resource = this._getResource(base_version);
                let resource = new Resource(resourceData);

                if (data && data.meta) {
                    let found = new Resource(data);
                    let meta = found.meta;
                    meta.versionId = `${parseInt(found.meta.versionId) + 1}`;
                    resource.meta = meta;
                } else {
                    let Meta = getMeta(base_version);
                    resource.meta = new Meta({
                        versionId: '1',
                        lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
                    });
                }

                let cleaned = JSON.parse(JSON.stringify(resource));
                let doc = Object.assign({}, cleaned, { _id: id });

                // Insert/update our record
                collection.findOneAndUpdate({ id: id }, { $set: doc }, { upsert: true }, (err2, res) => {
                    if (err2) {
                        logger.error(`Error with ${this.COLLECTION}.update: `, err2);
                        return reject(err2);
                    }

                    // save to history
                    let history_collection = db.collection(`${this.COLLECTION}_${base_version}_History`);

                    let history_patient = Object.assign(cleaned, { id: id });

                    // Insert our record to history but don't assign _id
                    return history_collection.insertOne(history_patient, (err3) => {
                        if (err3) {
                            logger.error(`Error with ${this.COLLECTION}History.create: `, err3);
                            return reject(err3);
                        }

                        return resolve({
                            id: id,
                            created: res.lastErrorObject && !res.lastErrorObject.updatedExisting,
                            resource_version: doc.meta.versionId,
                        });
                    });
                });
            });
        });
    }
}

module.exports = FHIRCRUD;
