/*eslint no-unused-vars: "warn"*/

const { VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { ObjectID } = require('mongodb');
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();
const globals = require('../../globals');
const { COLLECTION, CLIENT_DB } = require('../../constants');
const moment = require('moment-timezone');

const {
  stringQueryBuilder,
  tokenQueryBuilder,
  referenceQueryBuilder,
  addressQueryBuilder,
  nameQueryBuilder,
  dateQueryBuilder,
} = require('../../utils/querybuilder.util');

const FHIRCRUD = require('../../fhir.crud');

let getAppointment = (base_version) => {
  return resolveSchema(base_version, 'Appointment');
};

let getMeta = (base_version) => {
  return resolveSchema(base_version, 'Meta');
};

let buildStu3SearchQuery = (args) => {

  // Common search params
  let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
  args;

  // Search Result params
  let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
    args;

  // Resource Specific params
  //let actor = args['actor'];
  //let appointment_type = args['appointment-type'];
  //let date = args['date'];
  //let identifier = args['identifier'];
  //let incomingreferral = args['incomingreferral'];
  //let location = args['location'];
  //let part_status = args['part-status'];
  let patient = args['patient'];
  //let practitioner = args['practitioner'];
  //let service_type = args['service-type'];
  let status = args['status'];

  let query = {};
  let ors = [];

  if (_id) {
    query.id = _id;
  }

  if (status) {
    query['status'] = stringQueryBuilder(status);
  }

  if (patient) {
    let queryBuilder = referenceQueryBuilder(patient, 'participant.actor.reference');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  return query;
};

const fhircrud = new FHIRCRUD(COLLECTION.APPOINTMENT, buildStu3SearchQuery);

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

module.exports.remove = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Appointment >>> remove');

    let { id } = args;

    // TODO: delete record in database (soft/hard)

    // Return number of records deleted
    resolve({ deleted: 0 });
  });

module.exports.searchByVersionId = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Appointment >>> searchByVersionId');

    let { base_version, id, version_id } = args;

    let Appointment = getAppointment(base_version);

    // TODO: Build query from Parameters

    // TODO: Query database

    // Cast result to Appointment Class
    let appointment_resource = new Appointment();

    // Return resource class
    resolve(appointment_resource);
  });

module.exports.history = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Appointment >>> history');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let actor = args['actor'];
    let appointment_type = args['appointment-type'];
    let date = args['date'];
    let identifier = args['identifier'];
    let incomingreferral = args['incomingreferral'];
    let location = args['location'];
    let part_status = args['part-status'];
    let patient = args['patient'];
    let practitioner = args['practitioner'];
    let service_type = args['service-type'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Appointment = getAppointment(base_version);

    // Cast all results to Appointment Class
    let appointment_resource = new Appointment();

    // Return Array
    resolve([appointment_resource]);
  });

module.exports.historyById = (args, context) =>
  new Promise((resolve, reject) => {
    logger.info('Appointment >>> historyById');

    // Common search params
    let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } =
      args;

    // Search Result params
    let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } =
      args;

    // Resource Specific params
    let actor = args['actor'];
    let appointment_type = args['appointment-type'];
    let date = args['date'];
    let identifier = args['identifier'];
    let incomingreferral = args['incomingreferral'];
    let location = args['location'];
    let part_status = args['part-status'];
    let patient = args['patient'];
    let practitioner = args['practitioner'];
    let service_type = args['service-type'];
    let status = args['status'];

    // TODO: Build query from Parameters

    // TODO: Query database

    let Appointment = getAppointment(base_version);

    // Cast all results to Appointment Class
    let appointment_resource = new Appointment();

    // Return Array
    resolve([appointment_resource]);
  });
