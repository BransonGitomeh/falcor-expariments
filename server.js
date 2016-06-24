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

app.use('/model.json', falcorExpress.dataSourceRoute(function(req, res) {
  return new Router([

    {
      route: "genrelist[{integers:indices}].name",
      get: function(pathSet) {
        var genreList = [{
          path: ['genrelist', 0, 'name'],
          value: "Horror"
        }, {
          path: ['genrelist', 0, 'name'],
          value: "Commedy"
        }]

        return genreList;
      }
    },

    {
      route: "genrelist[{integers:indices}].titles[{integers:titleIndices}]",
      get: function(pathSet) {
        var genreList = [{
          path: ['genrelist', 0, 'titles', 0],
          value: {
            '$type': 'ref',
            value: ['titlesById', 1]
          }
        }, {
          path: ['genrelist', 0, 'titles', 1],
          value: {
            '$type': 'ref',
            value: ['titlesById', 2]
          }
        }]

        return genreList;
      }
    },

    {
      route: "titlesById[{integers:titleIds}]['name','year','description','boxshot']",
      get: function(pathSet) {
        console.log("asking for title by id")

        var titlesById = [{
          path: ['titlesById', 1, 'name'],
          value: 'Curious George'
        }, {
          path: ['titlesById', 2, 'name'],
          value: 'House, M.D.'
        }]

        return titlesById;
      }
    }

  ]);
}));


var server = app.listen(3000, err => {
  console.log(err || "listening @ 3000")
});