'use strict';
var mongoose = require('mongoose'),
 Trip = mongoose.model('Trips'),
 Search = mongoose.model('Searches');
/*---------------SEARCH----------------------*/

exports.get_search_by_user = function(req, res) {
  var query = {};
  var query_search = {};
  var array = [];
  console.log(req.query.title);

  if (req.query.ticker) {
    query.ticker = req.query.ticker;
    query_search.ticker = req.query.ticker;
    var expor = {'ticker':req.query.ticker}
    array.push(expor);
  }
  if (req.query.actorId) {
    query.actorId = req.query.actorId;
    query_search.actorId = req.query.actorId;
    var expor = {'actorId':req.query.actorId}
    array.push(expor);
  }
  if (req.query.title) {
    query.title = req.query.title;
    query_search.title = req.query.title;
    var expor = {'title':req.query.title}
    array.push(expor);
  }
  if (req.query.description) {
    query.description = req.query.description;
    query_search.description = req.query.description;
    array.description = req.query.description;
    var expor = {'description':req.query.description}
    array.push(expor);
  }
  //Rango de fechas
  if (req.query.date_max) {
    var date_list = req.query.date_max;
    var date_end_concat = date_list+"T00:00:00.000Z";
    query.date_end = {"$lte": new Date(date_end_concat)};
    query_search.date_max = {"$lte": new Date(date_end_concat)};
    var expor = {'date_max':new Date(date_end_concat)}
    array.push(expor);
    var utc = new Date().toJSON().slice(0,10);
    var utc = utc+"T00:00:00.000Z";
    query.date_start = {"$gte": new Date(utc)};
    query_search.date_min = {"$gte": new Date(utc)};
    var expor = {'date_min':new Date(utc)}
    array.push(expor);
  }
  //Rango de precios
  if (req.query.price_range) {
    var price_range = req.query.price_range;
    var range_list = price_range.split("-");
    query.full_price = {"$gte": range_list[0],"$lte":range_list[1]};
    query_search.price_range = price_range;
    var expor = {'price_range':price_range}
    array.push(expor);
  }

  var sort="";
  if(req.query.sortedBy){
    sort+=req.query.sortedBy;
  }
  console.log(JSON.stringify(query));
  console.log(JSON.stringify(query_search));
  console.log(array);
  //console.log("Query: "+query+" Sort:" + sort);

  Search.find(query_search,function(err, categs) {
    if (err||categs.length==0){
      console.log('The search does not exists');
      Trip.find(query)
          .sort(sort)
          .lean()
          .exec(function(err, searc){
        console.log('Start searching trips in trips');
        if(err){
          res.send(err);
        }
        else{
          console.log(searc);
          expor = {"trips":[JSON.stringify(searc)]};
          array.push(expor);
          console.log(JSON.stringify(searc));
          console.log(array);
          saveData(array);
          res.json(searc);
        }
      });
    }
    else{
      res.json(categs);
    }
  });

};

function saveData(data) {
  var search = new Search();
  console.log(data[0]);
  search.title = data[0].title;
  search.trips = JSON.stringify(data[1]);
  console.log(data);
  console.log(search);
  search.save(function (err) {
      if (err) return console.log(err);
      // saved!
  })
}

exports.post_search_by_user = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_search = new Search(req.body);
  new_search.save(function(err, search) {
    if (err){
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      res.json(search);
    }
  });
};


exports.delete_search_by_user = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  Search.deleteMany({_id: req.params.searchId}, function(err, search) {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.json({ message: 'Application successfully deleted' });
        }
    });
};