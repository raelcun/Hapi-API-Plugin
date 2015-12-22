module.exports = {
  env: process.env.NODE_ENV || 'development',
  API: {
    JWTSecret: '3E5_^7Z%rH5$%c3jwpQ#uA#O0*k5ltB*zK#yrYFeIScChyHbtW6h&woQM8j49cVU'
  },
  server: {
    host: 'localhost',
    port: 9000,
    routes: {
      cors: true
    }
  },
  mongo: {
    connection: {
      username: 'node',
      password: 'node',
      hostname: '192.168.33.10',
      port: 27017,
      database: 'plugin'
    },
    settings: {
      server: {
        socketOptions: {
          keepAlive: 1,
          connectTimeoutMS: 30000
        }
      }
    }
  }
};