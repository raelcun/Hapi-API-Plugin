(function() {
  var _, boom, internals, mongoose, util;

  boom = require('boom');

  internals = {};

  util = require('util');

  mongoose = require('mongoose');

  _ = require('lodash');

  mongoose.Promise = require('bluebird');

  internals.constructGetRoutes = function(model, options) {
    var getManyRoute, getSingleRoute, postprocess, preprocess, process, routeName;
    routeName = options.routeName || model.collection.collectionName;
    preprocess = options.preprocess || (function(docs) {
      return docs;
    });
    process = (function(model) {
      return model.toJSON();
    });
    postprocess = options.postprocess || (function(jsonDocs) {
      return jsonDocs;
    });
    getManyRoute = {
      method: 'GET',
      path: "/" + routeName,
      handler: function(request, reply) {
        return model.find().then(function(docs) {
          var jsonDocs;
          jsonDocs = docs.map(preprocess).map(process).map(postprocess);
          return reply({
            results: jsonDocs
          });
        })["catch"](function(err) {
          return reply(boom.wrap(err));
        });
      }
    };
    getSingleRoute = {
      method: 'GET',
      path: "/" + routeName + "/{id}",
      handler: function(request, reply) {
        return model.findOne({
          _id: request.params.id
        }).then(function(doc) {
          var jsonDoc;
          if (doc === null) {
            return reply(boom.badRequest("Specified " + routeName + " does not exist"));
          }
          jsonDoc = postprocess(process(preprocess(doc)));
          return reply({
            results: jsonDoc
          });
        })["catch"](function(err) {
          return reply(boom.wrap(err));
        });
      }
    };
    return [getSingleRoute, getManyRoute];
  };

  exports.register = function(server, options, next) {
    options.forEach(function(e) {
      var i, len, ref, results;
      ref = internals.constructGetRoutes(e.model, e.options);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        e = ref[i];
        results.push(server.route(e));
      }
      return results;
    });
    return next();
  };

  exports.register.attributes = {
    pkg: require('../package.json')
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBsdWdpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxTQUFBLEdBQVk7O0VBQ1osSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLFFBQUEsR0FBVyxPQUFBLENBQVEsVUFBUjs7RUFDWCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBQ0osUUFBUSxDQUFDLE9BQVQsR0FBbUIsT0FBQSxDQUFRLFVBQVI7O0VBRW5CLFNBQVMsQ0FBQyxrQkFBVixHQUErQixTQUFDLEtBQUQsRUFBUSxPQUFSO0FBQzdCLFFBQUE7SUFBQSxTQUFBLEdBQVksT0FBTyxDQUFDLFNBQVIsSUFBcUIsS0FBSyxDQUFDLFVBQVUsQ0FBQztJQUNsRCxVQUFBLEdBQWEsT0FBTyxDQUFDLFVBQVIsSUFBc0IsQ0FBQyxTQUFDLElBQUQ7YUFBVTtJQUFWLENBQUQ7SUFDbkMsT0FBQSxHQUFVLENBQUMsU0FBQyxLQUFEO2FBQVcsS0FBSyxDQUFDLE1BQU4sQ0FBQTtJQUFYLENBQUQ7SUFDVixXQUFBLEdBQWMsT0FBTyxDQUFDLFdBQVIsSUFBdUIsQ0FBQyxTQUFDLFFBQUQ7YUFBYztJQUFkLENBQUQ7SUFFckMsWUFBQSxHQUNFO01BQUEsTUFBQSxFQUFRLEtBQVI7TUFDQSxJQUFBLEVBQU0sR0FBQSxHQUFJLFNBRFY7TUFFQSxPQUFBLEVBQVMsU0FBQyxPQUFELEVBQVUsS0FBVjtlQUNQLEtBQ0UsQ0FBQyxJQURILENBQUEsQ0FFRSxDQUFDLElBRkgsQ0FFUSxTQUFDLElBQUQ7QUFDSixjQUFBO1VBQUEsUUFBQSxHQUFXLElBQ1QsQ0FBQyxHQURRLENBQ0osVUFESSxDQUVULENBQUMsR0FGUSxDQUVKLE9BRkksQ0FHVCxDQUFDLEdBSFEsQ0FHSixXQUhJO2lCQUtYLEtBQUEsQ0FBTTtZQUFFLE9BQUEsRUFBUyxRQUFYO1dBQU47UUFOSSxDQUZSLENBU0UsQ0FBQyxPQUFELENBVEYsQ0FTUyxTQUFDLEdBQUQ7aUJBQ0wsS0FBQSxDQUFNLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixDQUFOO1FBREssQ0FUVDtNQURPLENBRlQ7O0lBZUYsY0FBQSxHQUNFO01BQUEsTUFBQSxFQUFRLEtBQVI7TUFDQSxJQUFBLEVBQU0sR0FBQSxHQUFJLFNBQUosR0FBYyxPQURwQjtNQUVBLE9BQUEsRUFBUyxTQUFDLE9BQUQsRUFBVSxLQUFWO2VBQ1AsS0FDRSxDQUFDLE9BREgsQ0FDVztVQUFFLEdBQUEsRUFBSyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQXRCO1NBRFgsQ0FFRSxDQUFDLElBRkgsQ0FFUSxTQUFDLEdBQUQ7QUFDSixjQUFBO1VBQUEsSUFBRyxHQUFBLEtBQU8sSUFBVjtBQUFvQixtQkFBTyxLQUFBLENBQU0sSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsWUFBQSxHQUFhLFNBQWIsR0FBdUIsaUJBQXZDLENBQU4sRUFBM0I7O1VBRUEsT0FBQSxHQUFVLFdBQUEsQ0FBWSxPQUFBLENBQVEsVUFBQSxDQUFXLEdBQVgsQ0FBUixDQUFaO2lCQUVWLEtBQUEsQ0FBTTtZQUFFLE9BQUEsRUFBUyxPQUFYO1dBQU47UUFMSSxDQUZSLENBUUUsQ0FBQyxPQUFELENBUkYsQ0FRUyxTQUFDLEdBQUQ7aUJBQ0wsS0FBQSxDQUFNLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixDQUFOO1FBREssQ0FSVDtNQURPLENBRlQ7O0FBY0YsV0FBTyxDQUFDLGNBQUQsRUFBaUIsWUFBakI7RUFyQ3NCOztFQXVDL0IsT0FBTyxDQUFDLFFBQVIsR0FBbUIsU0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQixJQUFsQjtJQUNqQixPQUFPLENBQUMsT0FBUixDQUFnQixTQUFDLENBQUQ7QUFDZCxVQUFBO0FBQUE7QUFBQTtXQUFBLHFDQUFBOztxQkFBQSxNQUFNLENBQUMsS0FBUCxDQUFhLENBQWI7QUFBQTs7SUFEYyxDQUFoQjtXQUdBLElBQUEsQ0FBQTtFQUppQjs7RUFNbkIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFqQixHQUE4QjtJQUFBLEdBQUEsRUFBSyxPQUFBLENBQVEsaUJBQVIsQ0FBTDs7QUFwRDlCIiwiZmlsZSI6InBsdWdpbi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImJvb20gPSByZXF1aXJlKCdib29tJylcbmludGVybmFscyA9IHt9XG51dGlsID0gcmVxdWlyZSgndXRpbCcpXG5tb25nb29zZSA9IHJlcXVpcmUoJ21vbmdvb3NlJylcbl8gPSByZXF1aXJlKCdsb2Rhc2gnKVxubW9uZ29vc2UuUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcblxuaW50ZXJuYWxzLmNvbnN0cnVjdEdldFJvdXRlcyA9IChtb2RlbCwgb3B0aW9ucykgLT5cbiAgcm91dGVOYW1lID0gb3B0aW9ucy5yb3V0ZU5hbWUgb3IgbW9kZWwuY29sbGVjdGlvbi5jb2xsZWN0aW9uTmFtZVxuICBwcmVwcm9jZXNzID0gb3B0aW9ucy5wcmVwcm9jZXNzIG9yICgoZG9jcykgLT4gZG9jcylcbiAgcHJvY2VzcyA9ICgobW9kZWwpIC0+IG1vZGVsLnRvSlNPTigpKVxuICBwb3N0cHJvY2VzcyA9IG9wdGlvbnMucG9zdHByb2Nlc3Mgb3IgKChqc29uRG9jcykgLT4ganNvbkRvY3MpXG5cbiAgZ2V0TWFueVJvdXRlID1cbiAgICBtZXRob2Q6ICdHRVQnXG4gICAgcGF0aDogXCIvI3tyb3V0ZU5hbWV9XCJcbiAgICBoYW5kbGVyOiAocmVxdWVzdCwgcmVwbHkpIC0+XG4gICAgICBtb2RlbFxuICAgICAgICAuZmluZCgpXG4gICAgICAgIC50aGVuIChkb2NzKSAtPlxuICAgICAgICAgIGpzb25Eb2NzID0gZG9jc1xuICAgICAgICAgICAgLm1hcCBwcmVwcm9jZXNzXG4gICAgICAgICAgICAubWFwIHByb2Nlc3NcbiAgICAgICAgICAgIC5tYXAgcG9zdHByb2Nlc3NcblxuICAgICAgICAgIHJlcGx5KHsgcmVzdWx0czoganNvbkRvY3MgfSlcbiAgICAgICAgLmNhdGNoIChlcnIpIC0+XG4gICAgICAgICAgcmVwbHkoYm9vbS53cmFwKGVycikpXG5cbiAgZ2V0U2luZ2xlUm91dGUgPVxuICAgIG1ldGhvZDogJ0dFVCdcbiAgICBwYXRoOiBcIi8je3JvdXRlTmFtZX0ve2lkfVwiXG4gICAgaGFuZGxlcjogKHJlcXVlc3QsIHJlcGx5KSAtPlxuICAgICAgbW9kZWxcbiAgICAgICAgLmZpbmRPbmUoeyBfaWQ6IHJlcXVlc3QucGFyYW1zLmlkIH0pXG4gICAgICAgIC50aGVuIChkb2MpIC0+XG4gICAgICAgICAgaWYgZG9jIGlzIG51bGwgdGhlbiByZXR1cm4gcmVwbHkoYm9vbS5iYWRSZXF1ZXN0KFwiU3BlY2lmaWVkICN7cm91dGVOYW1lfSBkb2VzIG5vdCBleGlzdFwiKSlcbiAgICAgICAgICBcbiAgICAgICAgICBqc29uRG9jID0gcG9zdHByb2Nlc3MocHJvY2VzcyhwcmVwcm9jZXNzKGRvYykpKVxuXG4gICAgICAgICAgcmVwbHkoeyByZXN1bHRzOiBqc29uRG9jIH0pXG4gICAgICAgIC5jYXRjaCAoZXJyKSAtPlxuICAgICAgICAgIHJlcGx5KGJvb20ud3JhcChlcnIpKVxuXG4gIHJldHVybiBbZ2V0U2luZ2xlUm91dGUsIGdldE1hbnlSb3V0ZV1cblxuZXhwb3J0cy5yZWdpc3RlciA9IChzZXJ2ZXIsIG9wdGlvbnMsIG5leHQpIC0+XG4gIG9wdGlvbnMuZm9yRWFjaCAoZSkgLT5cbiAgICBzZXJ2ZXIucm91dGUoZSkgZm9yIGUgaW4gaW50ZXJuYWxzLmNvbnN0cnVjdEdldFJvdXRlcyhlLm1vZGVsLCBlLm9wdGlvbnMpXG5cbiAgbmV4dCgpXG5cbmV4cG9ydHMucmVnaXN0ZXIuYXR0cmlidXRlcyA9IHBrZzogcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykiXX0=
