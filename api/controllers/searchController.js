'use strict';
var mongoose = require('mongoose'),
 Trip = mongoose.model('Trips'),
 Search = mongoose.model('Searches'),
 Config = mongoose.model('Configs');
/*---------------SEARCH----------------------*/

exports.get_search_by_user = function(req, res) {
  var finder_minutes = getConfigs();
  var query = {};
  var query_search = {};
  var tick = "";
  var descrip = "";
  var actor = "";
  var tit = "";
  var date_mini = new Date();
  var date_maxi = new Date();
  var range_pri = "";

  if (req.query.ticker) {
    query.ticker = req.query.ticker;
    query_search.ticker = req.query.ticker;
    tick = req.query.ticker;
  }
  if (req.query.actorId) {
    query.actorId = req.query.actorId;
    query_search.actorId = req.query.actorId;
    actor = req.query.actorId;
  }
  if (req.query.title) {
    query.title = req.query.title;
    query_search.title = req.query.title;
    tit = req.query.title;
  }
  if (req.query.description) {
    query.description = req.query.description;
    query_search.description = req.query.description;
    descrip = req.query.description;
  }
  //Rango de fechas
  if (req.query.date_max) {
    var date_list = req.query.date_max;
    var date_end_concat = date_list+"T00:00:00.000Z";
    query.date_end = {"$lte": new Date(date_end_concat)};
    query_search.date_max = {"$lte": new Date(date_end_concat)};
    date_maxi = new Date(date_end_concat);
    var utc = new Date().toJSON().slice(0,10);
    var utc = utc+"T00:00:00.000Z";
    query.date_start = {"$gte": new Date(utc)};
    query_search.date_min = {"$gte": new Date(utc)};
    date_mini = new Date(utc);
  }
  //Rango de precios
  if (req.query.price_range) {
    var price_range = req.query.price_range;
    var range_list = price_range.split("-");
    query.full_price = {"$gte": range_list[0],"$lte":range_list[1]};
    query_search.price_range = price_range;
    range_pri = req.query.price_range;
  }

  var sort="";
  if(req.query.sortedBy){
    sort+=req.query.sortedBy;
  }
  //console.log(JSON.stringify(query));
  console.log(JSON.stringify(query_search));
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
          var trips = JSON.stringify(searc);
          console.log(trips);
          saveData(tick,tit,descrip,actor,range_pri,date_maxi,date_mini,trips);
          res.json(searc);
        }
      });
    }
    else{
      console.log(categs[0].createdAt);
      
      res.json(categs);
    }
  });

};

function saveData(tick,tit,descrip,actor,range_pri,date_maxi,date_mini,trips) {
  var search = new Search();
  if(tick != ""){
    search.ticker = tick;
  }
  if(tit != ""){
    console.log(tit);
    search.title = tit;
  }
  if(descrip != ""){
    search.description = descrip;
  }
  if(actor != ""){
    search.actorId = actor;
  }
  if(range_pri != ""){
    search.price_range = range_pri;
  }
  search.date_min = date_mini;
  search.date_max = date_maxi;
  search.trips = trips;
  console.log(search);
  search.save(function (err) {
      if (err) return console.log(err);
      // saved!
  })
}

function getConfigs(req, res){
  Config.find(function(err, configs) {
    if (err){
      console.error(Date(), ` ERROR: - GET /configs , Some error ocurred while retrieving applications: ${err.message}`);
      res.status(500).send(err);
    }
    else{
      console.log(Date(), ` SUCCESS: -GET /configs`);
      console.log(configs[0].date_finder_minutes);
      return configs[0].date_finder_minutes;
    }
  });
}

async function checkCache() {
  /*Config.aggregate([
    {
      '$project':{
        "_id":0,
        "date_finder_minutes":1
      }
   }
  ]).exec((err, results) => {
    if (err){
      console.log(err);
      return;
    }else{
      const data = results[0];
      console.log(data.date_finder_minutes);

    }
  })*/
  var ress = Config.aggregate([
    {
      '$project':{
        "_id":0,
        "date_finder_minutes":1
      }
   }
  ]).exec();

  let res = await ress;
  //console.log(res[0].date_finder_minutes);
  return res[0].date_finder_minutes;
}

//Búsqueda de la media de dinero gastado dentro de un rango de precio
async function search_searches_avg_by_money_inside_range(){
  console.log(Date(), ` search_searches_avg_by_money_inside_range`);

  var trips_inside = await Search.aggregate(
    [
        {$match:{"price_range":"$price_range"}},
        {$group:{_id:"$price_range"}}
    ]).toArray().exec();
  
  var searches_by_range = await Search.aggregate(
      [
          {$match:{"price_range":"$price_range"}},
          {$group:{_id:"$price_range"}}
      ]).toArray().exec();

  return searches_by_range;
}