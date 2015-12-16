(function() {
  var DataSchema, UserSchema, mongoose;

  mongoose = require('mongoose');

  DataSchema = new mongoose.Schema({
    key: {
      type: String
    },
    value: {
      type: String
    }
  });

  UserSchema = new mongoose.Schema({
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

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVscy91c2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSOztFQUVYLFVBQUEsR0FBaUIsSUFBQSxRQUFRLENBQUMsTUFBVCxDQUNmO0lBQUEsR0FBQSxFQUNFO01BQUEsSUFBQSxFQUFNLE1BQU47S0FERjtJQUVBLEtBQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxNQUFOO0tBSEY7R0FEZTs7RUFNakIsVUFBQSxHQUFpQixJQUFBLFFBQVEsQ0FBQyxNQUFULENBQ2Y7SUFBQSxRQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sTUFBTjtLQURGO0lBRUEsUUFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLE1BQU47S0FIRjtJQUlBLE1BQUEsRUFDRTtNQUFBLE9BQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxNQUFOO09BREY7TUFFQSxPQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sTUFBTjtTQURGO09BSEY7S0FMRjtJQVVBLElBQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxDQUFDLFVBQUQsQ0FBTjtLQVhGO0dBRGU7O0VBZWpCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQVEsQ0FBQyxLQUFULENBQWUsTUFBZixFQUF1QixVQUF2QjtBQXZCakIiLCJmaWxlIjoibW9kZWxzL3VzZXIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJtb25nb29zZSA9IHJlcXVpcmUoJ21vbmdvb3NlJylcblxuRGF0YVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWFcbiAga2V5OlxuICAgIHR5cGU6IFN0cmluZ1xuICB2YWx1ZTpcbiAgICB0eXBlOiBTdHJpbmdcblxuVXNlclNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWFcbiAgdXNlcm5hbWU6XG4gICAgdHlwZTogU3RyaW5nXG4gIHBhc3N3b3JkOlxuICAgIHR5cGU6IFN0cmluZ1xuICBuZXN0ZWQ6XG4gICAgbmVzdGVkMTpcbiAgICAgIHR5cGU6IFN0cmluZ1xuICAgIG5lc3RlZDI6XG4gICAgICBuZXN0ZWQzOlxuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgZGF0YTpcbiAgICB0eXBlOiBbRGF0YVNjaGVtYV1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IG1vbmdvb3NlLm1vZGVsICdVc2VyJywgVXNlclNjaGVtYSJdfQ==
