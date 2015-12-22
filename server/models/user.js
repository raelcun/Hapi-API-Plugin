const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  key: {
    type: String
  },
  value: {
    type: String
  }
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  nested: {
    nested1: {
      type: String
    },
    nested2: {
      nested3: {
        type: String
      }
    }
  },
  data: {
    type: [DataSchema]
  }
});

module.exports = mongoose.model('User', UserSchema);