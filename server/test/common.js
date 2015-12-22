const hapi = require('hapi'),
      config = require('../config'),
      mongoose = require('mongoose'),
      utils = require('../components/utils'),
      server = new hapi.Server(),
      expect = require('chai').expect,
      internals = {};

// create models to use with server
internals.DataSchema = new mongoose.Schema({
  key: { type: String },
  value: { type: String }
});

internals.TestSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  nested: {
    nested1: { type: String },
    nested2: { nested3: { type: String } }
  },
  data: { type: [internals.DataSchema] }
});
internals.TestModel = mongoose.model('Test', internals.TestSchema);

server.connection(config.server);

// Make sure data in Boom messages is displayed
server.ext('onPreResponse', (request, reply) => {
  if (request.response.isBoom && request.response.data) {
    request.response.output.payload.data = request.response.data;
  }
  reply.continue();
});

mongoose.connection.on('connected', () => {
  server.register([
    {
      register: require('../plugin'),
      options: [{ model: internals.TestModel }]
    }
  ], (err) => {
    if (err) return console.log(err);

    server.table().forEach(route => {
      route.table.forEach(route => {
        console.log(`${route.method.toUpperCase()} ${route.path}`);
      });
    });

    server.start(() => console.log("web interface started at http://" + config.server.host + ":" + config.server.port + " in " + config.env + " mode") );
  });
});

mongoose.connect(utils.constructMongoURI(config.mongo.connection.username, config.mongo.connection.password, config.mongo.connection.hostname, config.mongo.connection.port, config.mongo.connection.database), config.mongo.settings);

module.exports = {
  serverPromise: new Promise((resolve, reject) => {
    // server.start invokes an onPostStart extension. Only one onPostStart
    // extension seems to be called, so we'll just use the start event here
    server.on('start', () => resolve(server));
  }),
  expectError: (payload, error, message, data) => {
    expect(payload).to.exist;
    expect(payload.statusCode).to.be.a('number');
    expect(payload.error).to.be.a('string');
    expect(payload.message).to.be.a('string');
    expect(payload.error).to.equal(error);
    expect(payload.message).to.equal(message);
    if (data) {
      expect(payload.data).to.be.a('string');
      expect(payload.data).to.equal(data);
    }
  },
  serverModel: internals.TestModel
};