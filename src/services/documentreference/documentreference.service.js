/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();
const { COLLECTION, CLIENT_DB } = require('../../constants');
const FHIRCRUD = require('../../fhir.crud');

const {
  stringQueryBuilder,
  tokenQueryBuilder,
  referenceQueryBuilder,
  addressQueryBuilder,
  nameQueryBuilder,
  dateQueryBuilder,
} = require('../../utils/querybuilder.util');

let getDocumentReference = (base_version) => {
  return resolveSchema(base_version, 'DocumentReference');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

let buildStu3SearchQuery = (args) => {

  let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
  args;

  // Search Result params
  let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
    args;

  // Resource Specific params
  let authenticator = args['authenticator'];
  let author = args['author'];
  let _class = args['_class'];
  let created = args['created'];
  let custodian = args['custodian'];
  let description = args['description'];
  let encounter = args['encounter'];
  let event = args['event'];
  let facility = args['facility'];
  let format = args['format'];
  let identifier = args['identifier'];
  let indexed = args['indexed'];
  let language = args['language'];
  let location = args['location'];
  let patient = args['patient'];
  let period = args['period'];
  let related_id = args['related-id'];
  let related_ref = args['related-ref'];
  let relatesto = args['relatesto'];
  let relation = args['relation'];
  let relationship = args['relationship'];
  let securitylabel = args['securitylabel'];
  let setting = args['setting'];
  let status = args['status'];
  let subject = args['subject'];
  let type = args['type'];

  let query = {};
  let ors = [];

  if (_id) {
    query.id = _id;
  }

  if (status) {
    query['status'] = stringQueryBuilder(status);
  }

  if (patient) {
    let queryBuilder = referenceQueryBuilder(patient, 'subject.reference');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  return query;
};

const fhircrud = new FHIRCRUD(COLLECTION.DOCUMENTREFERENCE, buildStu3SearchQuery);

module.exports.search = (args) => {
  return fhircrud.search(args);
};

module.exports.searchById = (args) => {
  return fhircrud.searchById(args);
};

module.exports.create = (args, { req }) => {
  return fhircrud.create(args, { req });
};

module.exports.update = (args, { req }) => {
  return fhircrud.update(args, { req });
};

module.exports.remove = (args, context) => {
  return fhircrud.remove(args, context);
};

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DocumentReference >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let DocumentReference = getDocumentReference(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to DocumentReference Class
    let documentreference_resource = new DocumentReference();

    // Return resource class
    resolve(documentreference_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DocumentReference >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authenticator = args['authenticator'];
    let author = args['author'];
    let _class = args['_class'];
    let created = args['created'];
    let custodian = args['custodian'];
    let description = args['description'];
    let encounter = args['encounter'];
    let event = args['event'];
    let facility = args['facility'];
    let format = args['format'];
    let identifier = args['identifier'];
    let indexed = args['indexed'];
    let language = args['language'];
    let location = args['location'];
    let patient = args['patient'];
    let period = args['period'];
    let related_id = args['related-id'];
    let related_ref = args['related-ref'];
    let relatesto = args['relatesto'];
    let relation = args['relation'];
    let relationship = args['relationship'];
    let securitylabel = args['securitylabel'];
    let setting = args['setting'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DocumentReference = getDocumentReference(base_version);

    // Cast all results to DocumentReference Class
    let documentreference_resource = new DocumentReference();

    // Return Array
    resolve([documentreference_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('DocumentReference >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let authenticator = args['authenticator'];
    let author = args['author'];
    let _class = args['_class'];
    let created = args['created'];
    let custodian = args['custodian'];
    let description = args['description'];
    let encounter = args['encounter'];
    let event = args['event'];
    let facility = args['facility'];
    let format = args['format'];
    let identifier = args['identifier'];
    let indexed = args['indexed'];
    let language = args['language'];
    let location = args['location'];
    let patient = args['patient'];
    let period = args['period'];
    let related_id = args['related-id'];
    let related_ref = args['related-ref'];
    let relatesto = args['relatesto'];
    let relation = args['relation'];
    let relationship = args['relationship'];
    let securitylabel = args['securitylabel'];
    let setting = args['setting'];
    let status = args['status'];
    let subject = args['subject'];
    let type = args['type'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let DocumentReference = getDocumentReference(base_version);

    // Cast all results to DocumentReference Class
    let documentreference_resource = new DocumentReference();

    // Return Array
    resolve([documentreference_resource]);
  });
