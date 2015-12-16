boom = require('boom')
internals = {}
util = require('util')
mongoose = require('mongoose')
_ = require('lodash')
mongoose.Promise = require('bluebird')

internals.constructGetRoutes = (model, options) ->
  routeName = options.routeName or model.collection.collectionName
  preprocess = options.preprocess or ((docs) -> docs)
  process = ((model) -> model.toJSON())
  postprocess = options.postprocess or ((jsonDocs) -> jsonDocs)

  getManyRoute =
    method: 'GET'
    path: "/#{routeName}"
    handler: (request, reply) ->
      model
        .find()
        .then (docs) ->
          jsonDocs = docs
            .map preprocess
            .map process
            .map postprocess

          reply({ results: jsonDocs })
        .catch (err) ->
          reply(boom.wrap(err))

  getSingleRoute =
    method: 'GET'
    path: "/#{routeName}/{id}"
    handler: (request, reply) ->
      model
        .findOne({ _id: request.params.id })
        .then (doc) ->
          if doc is null then return reply(boom.badRequest("Specified #{routeName} does not exist"))
          
          jsonDoc = postprocess(process(preprocess(doc)))

          reply({ results: jsonDoc })
        .catch (err) ->
          reply(boom.wrap(err))

  return [getSingleRoute, getManyRoute]

exports.register = (server, options, next) ->
  options.forEach (e) ->
    server.route(e) for e in internals.constructGetRoutes(e.model, e.options)

  next()

exports.register.attributes = pkg: require('../package.json')