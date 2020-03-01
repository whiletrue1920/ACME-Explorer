'use strict';
var mongoose = require('mongoose'),
 Trip = mongoose.model('Trips'),
 Search = mongoose.model('Searches');
/*---------------SEARCH----------------------*/

exports.get_search_by_user = function(req, res) {
  var query = {};

  if (req.query.ticker) {
    query.ticker += req.query.ticker;
    console.log("Query: "+req.query.ticker);
  }
  if (req.query.actorId) {
    query += req.query.actorId;
    console.log("Query: "+req.query.actorId);
  }
  if (req.query.title) {
    query += req.query.title;
    console.log("Query: "+req.query.title);
  }
  if (req.query.description) {
    query += req.query.description;
    console.log("Query: "+req.query.description);
  }
  //Rango de fechas
  if (req.query.date_max) {
    var date_list = req.query.date_max;
    var date_end_concat = date_list+"T00:00:00.000Z";
    query.date_end = {"$lte": new Date(date_end_concat)};
    var utc = new Date().toJSON().slice(0,10);
    var utc = utc+"T00:00:00.000Z";
    query.date_start = {"$gte": new Date(utc)};
  }
  //Rango de precios
  if (req.query.price_range) {
    var price_range = req.query.price_range;
    var range_list = price_range.split("-");
    query.full_price = {"$gte": range_list[0],"$lte":range_list[1]};
  }

  var sort="";
  if(req.query.sortedBy){
    sort+=req.query.sortedBy;
  }
  console.log(JSON.stringify(query));
  //console.log("Query: "+query+" Sort:" + sort);

  Trip.find(query)
       .sort(sort)
       .lean()
       .exec(function(err, order){
    console.log('Start searching trips');
    if (err){
      res.send(err);
    }
    else{
      res.json(order);
    }
    console.log('End searching trips');
  });

};

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