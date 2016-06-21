var falcor = require('falcor');
var falcorExpress = require('falcor-express');
var Router = require('falcor-router');

var express = require('express');
var _ = require('lodash');
var app = express();

app.use(express.static('.'));

app.use((req, res, next) => {
  var startTime = new Date()
  console.log(req.method + " " + req.url)

  res.on("finish", (x) => {
    var endTime = new Date()
    var timeTaken = endTime - startTime
    console.log("done " + timeTaken)
  })
  next()
})

// Have Express request index.html
var $ref = falcor.Model.ref;

// Same data that was used in the view for our
// events, but this time on a simple object
// and not a Falcor model.
var eventsData = {
  locationsById: {
    1: {
      city: "Salt Lake City",
      state: "Utah"
    },
    2: {
      city: "Las Vegas",
      state: "Nevada"
    },
    3: {
      city: "Minneapolis",
      state: "Minnesota"
    },
    4: {
      city: "Walker Creek Ranch",
      state: "California"
    }
  },
  events: [{
    name: "ng-conf",
    description: "The worlds best Angular Conference",
    location: $ref('locationsById[1]')
  }, {
    name: "React Rally",
    description: "Conference focusing on Facebook's React",
    location: $ref('locationsById[1]')
  }, {
    name: "ng-Vegas",
    description: "Two days jam-packed with Angular goodness with a focus on Angular 2",
    location: $ref('locationsById[2]')
  }, {
    name: "Midwest JS",
    description: "Midwest JS is a premier technology conference focused on the JavaScript ecosystem.",
    location: $ref('locationsById[3]')
  }, {
    name: "NodeConf",
    description: "NodeConf is the longest running community driven conference for the Node community.",
    location: $ref('locationsById[4]')
  }]
}

app.use('/model.json', falcorExpress.dataSourceRoute(function(req, res) {
  return new Router([{
    // Our route needs to match a pattern of integers that
    // are used as eventIds
    route: "events[{integers:eventIds}]['name', 'description']",
    get: function(pathSet) {

      console.log(pathSet)

      var results = [{
        path: ['events', 0, 'description'],
        value: 'The worlds best Angular Conference'
      }, {
        path: ['events', 0, 'name'],
        value: 'ng-conf'
      }, {
        path: ['events', 1, 'description'],
        value: 'Conference focusing on Facebook\'s React'
      }, {
        path: ['events', 1, 'name'],
        value: 'React Rally'
      }]

      return results;
    }
  }, {
    // Our route needs to match a pattern of integers that
    // are used as locationId
    route: "locationsById[{integers:locationId}]['city', 'state']",
    get: function(pathSet) {
      console.log(pathSet)

      var results = [{
        path: ['locationsById', 0, 'city'],
        value: 'Nairobi'
      }, {
        path: ['locationsById', 0, 'state'],
        value: 'Kenya'
      }, {
        path: ['locationsById', 1, 'city'],
        value: 'Kigali'
      }, {
        path: ['locationsById', 1, 'state'],
        value: 'Rwanda'
      }]

      return results;
    }
  }, {
    // The search route will match keys that match the names
    // of our conferences
    route: "events.byName[{keys}]['description']",
    get: function(pathSet) {

      var results = [];

      // We want to loop over each of the conference names provided
      pathSet[2].forEach(function(name) {

        // We also want to loop over all the events on the data object
        // and check if conference name is there
        eventsData.events.forEach(function(event) {
          if (_.contains(event, name)) {
            results.push({
              path: ['events', 'byName', name, 'description'],
              value: event.description
            });
          }
        });
      });

      return results;
    }
  }]);
}));


var server = app.listen(3000, err => {
  console.log(err || "listening @ 3000")
});