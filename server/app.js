(function() {
  var User, config, hapi, mongoose, myOptions, server, utils;

  require('source-map-support').install();

  hapi = require('hapi');

  config = require('./config');

  mongoose = require('mongoose');

  User = require('./models/user');

  utils = require('./components/utils');

  server = new hapi.Server();

  server.connection(config.server);


  /*
   * Make sure data in Boom messages is displayed
   */

  server.ext('onPreResponse', function(request, reply) {
    if (request.response.isBoom && request.response.data) {
      request.response.output.payload.data = request.response.data;
    }
    return reply["continue"]();
  });

  myOptions = [
    {
      model: User,
      options: {
        test: 'test'
      }
    }
  ];

  mongoose.connection.on('connected', function() {
    return server.register([
      {
        register: require('hapi-auth-jwt2')
      }, {
        register: require('./plugin'),
        options: myOptions
      }
    ], function(err) {
      if (err) {
        console.log(err);
      }
      server.table().forEach(function(route) {
        return route.table.forEach(function(route) {
          return console.log((route.method.toUpperCase()) + " " + route.path);
        });
      });
      return server.start(function() {
        return console.log("web interface started at http://" + config.server.host + ":" + config.server.port + " in " + config.env + " mode");
      });
    });
  });

  mongoose.connect(utils.constructMongoURI(config.mongo.connection.username, config.mongo.connection.password, config.mongo.connection.hostname, config.mongo.connection.port, config.mongo.connection.database), config.mongo.settings);

  module.exports = server;

}).call(this);

//# sourceMappingURL=data:application/json;base64,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dCI6WyJyZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKS5pbnN0YWxsKClcblxuaGFwaSA9IHJlcXVpcmUoJ2hhcGknKVxuY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKVxubW9uZ29vc2UgPSByZXF1aXJlKCdtb25nb29zZScpXG5Vc2VyID0gcmVxdWlyZSgnLi9tb2RlbHMvdXNlcicpXG51dGlscyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy91dGlscycpXG5cbnNlcnZlciA9IG5ldyBoYXBpLlNlcnZlcigpXG5zZXJ2ZXIuY29ubmVjdGlvbihjb25maWcuc2VydmVyKVxuXG4jIyNcbiMgTWFrZSBzdXJlIGRhdGEgaW4gQm9vbSBtZXNzYWdlcyBpcyBkaXNwbGF5ZWRcbiMjI1xuc2VydmVyLmV4dCAnb25QcmVSZXNwb25zZScsIChyZXF1ZXN0LCByZXBseSkgLT5cbiAgaWYgcmVxdWVzdC5yZXNwb25zZS5pc0Jvb20gYW5kIHJlcXVlc3QucmVzcG9uc2UuZGF0YSB0aGVuIHJlcXVlc3QucmVzcG9uc2Uub3V0cHV0LnBheWxvYWQuZGF0YSA9IHJlcXVlc3QucmVzcG9uc2UuZGF0YVxuICByZXR1cm4gcmVwbHkuY29udGludWUoKVxuXG5cbm15T3B0aW9ucyA9IFtcbiAgbW9kZWw6IFVzZXJcbiAgb3B0aW9uczpcbiAgICB0ZXN0OiAndGVzdCdcbl1cblxuXG5cbm1vbmdvb3NlLmNvbm5lY3Rpb24ub24gJ2Nvbm5lY3RlZCcsIC0+XG4gIHNlcnZlci5yZWdpc3RlciBbXG4gICAgeyByZWdpc3RlcjogcmVxdWlyZSgnaGFwaS1hdXRoLWp3dDInKSB9XG4gICAgeyByZWdpc3RlcjogcmVxdWlyZSgnLi9wbHVnaW4nKSwgb3B0aW9uczogbXlPcHRpb25zIH1cbiAgXSwgKGVycikgLT5cbiAgICBpZiBlcnIgdGhlbiBjb25zb2xlLmxvZyhlcnIpXG5cbiAgICBzZXJ2ZXIudGFibGUoKS5mb3JFYWNoIChyb3V0ZSkgLT5cbiAgICAgIHJvdXRlLnRhYmxlLmZvckVhY2ggKHJvdXRlKSAtPlxuICAgICAgICBjb25zb2xlLmxvZyBcIiN7cm91dGUubWV0aG9kLnRvVXBwZXJDYXNlKCl9ICN7cm91dGUucGF0aH1cIlxuXG4gICAgc2VydmVyLnN0YXJ0IC0+XG4gICAgICBjb25zb2xlLmxvZyBcIndlYiBpbnRlcmZhY2Ugc3RhcnRlZCBhdCBodHRwOi8vI3tjb25maWcuc2VydmVyLmhvc3R9OiN7Y29uZmlnLnNlcnZlci5wb3J0fSBpbiAje2NvbmZpZy5lbnZ9IG1vZGVcIlxuXG5tb25nb29zZS5jb25uZWN0KFxuICB1dGlscy5jb25zdHJ1Y3RNb25nb1VSSShcbiAgICBjb25maWcubW9uZ28uY29ubmVjdGlvbi51c2VybmFtZVxuICAgIGNvbmZpZy5tb25nby5jb25uZWN0aW9uLnBhc3N3b3JkXG4gICAgY29uZmlnLm1vbmdvLmNvbm5lY3Rpb24uaG9zdG5hbWVcbiAgICBjb25maWcubW9uZ28uY29ubmVjdGlvbi5wb3J0XG4gICAgY29uZmlnLm1vbmdvLmNvbm5lY3Rpb24uZGF0YWJhc2VcbiAgKSxcbiAgY29uZmlnLm1vbmdvLnNldHRpbmdzXG4pXG5cbm1vZHVsZS5leHBvcnRzID0gc2VydmVyIl19
