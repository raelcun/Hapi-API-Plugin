const boom = require('boom'),
      mongoose = require('mongoose'),
      internals = {},
      _ = require('lodash');

mongoose.Promise = require('bluebird'); // using bluebird only because it is faster

internals.identity = e => e;
internals.handleError = (err, reply) => {
  console.log(err);
  reply(boom.wrap(err));
};

internals.getModels = (request, reply, model, customOptions) => {
  const options = _.merge({
    getPreprocess: internals.identity,
    getProcess: model => model.toJSON(),
    getPostprocess: internals.identity
  }, customOptions);

  model.find().then(docs => {
    reply({ results: docs.map(options.getPreprocess).map(options.getProcess).map(options.getPostprocess) });
  }).catch(err => {
    internals.handleError(err, reply);
  });
};

internals.getOneModel = (request, reply, model, customOptions) => {
  const options = _.merge({
    getOnePreprocess: internals.identity,
    getOneProcess: model => model.toJSON(),
    getOnePostprocess: internals.identity
  }, customOptions);

  model
    .findById(request.params.id)
    .then(doc => {
      if (doc === null) return reply(boom.badRequest(`Specified ${options.routeName} does not exist`));
      reply({ results: options.getOnePostprocess(options.getOneProcess(options.getOnePreprocess(doc))) });
    }).catch(err => {
      internals.handleError(err, reply);
    });
};

internals.addModel = (request, reply, model, customOptions) => {
  const options = _.merge({
    addPreprocess: internals.identity,
    addProcess: model => model.toJSON(),
    addPostprocess: internals.identity
  }, customOptions);

  new model(request.payload)
    .save()
    .then(doc => {
      if (doc === null) return reply(boom.badRequest(`Could not save ${options.routeName}`));
      reply({ results: options.addPostprocess(options.addProcess(options.addPreprocess(doc))) });
    }).catch(err => {
      internals.handleError(err, reply);
    });
};

internals.deleteModel = (request, reply, model, customOptions) => {
  const options = _.merge({
    deletePreprocess: internals.identity,
    deleteProcess: model => model.toJSON(),
    deletePostprocess: internals.identity
  }, customOptions);

  model
    .findByIdAndRemove(request.params.id)
    .then(doc => {
      if (doc === null) return reply(boom.badRequest(`Specified ${options.routeName} does not exist`));
      reply({ results: options.deletePostprocess(options.deleteProcess(options.deletePreprocess(doc))) });
    }).catch(err => {
      internals.handleError(err, reply);
    });
};

internals.updateModel = (request, reply, model, customOptions) => {
  const options = _.merge({
    updatePreprocess: internals.identity,
    updateProcess: model => model.toJSON(),
    updatePostprocess: internals.identity
  }, customOptions);

  model
    .findById(request.params.id)
    .then(doc => {
      if (doc === null) return reply(boom.badRequest(`Specified ${options.routeName} does not exist`));
      doc.set(request.payload);
      return doc.save();
    }).then(doc => {
      reply({ results: options.updatePostprocess(options.updateProcess(options.updatePreprocess(doc))) });
    }).catch(err => {
      internals.handleError(err, reply);
    });
};

internals.constructRoutes = function(model, customOptions) {
  const options = _.merge({
    routeName: model.collection.collectionName
  }, customOptions);

  return [
    {
      method: 'GET',
      path: `/${options.routeName}`,
      handler: (request, reply) => internals.getModels(request, reply, model, options)
    }, {
      method: 'GET',
      path: `/${options.routeName}/{id}`,
      handler: (request, reply) => internals.getOneModel(request, reply, model, options)
    }, {
      method: 'POST',
      path: `/${options.routeName}`,
      handler: (request, reply) => internals.addModel(request, reply, model, options)
    }, {
      method: 'DELETE',
      path: `/${options.routeName}/{id}`,
      handler: (request, reply) => internals.deleteModel(request, reply, model, options)
    }, {
      method: 'PATCH',
      path: `/${options.routeName}/{id}`,
      handler: (request, reply) => internals.updateModel(request, reply, model, options)
    }
  ];
};

exports.register = (server, options, next) => {
  options.forEach(e => {
    const routes = internals.constructRoutes(e.model, e.options);
    routes.forEach(e => server.route(e));
  });
  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};