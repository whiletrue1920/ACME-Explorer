'use strict';
var mongoose = require('mongoose'),
 Trip = mongoose.model('Trips'),
 Search = mongoose.model('Searches'),
 Config = mongoose.model('Configs');
var dateFormat = require('dateformat');
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
          //poner try catch
          console.log(categs[0]);
          var minitrips =   [{'ticker': searc[0].ticker,'title': searc[0].title,'description':  searc[0].description,'date_end': searc[0].date_end}];
          console.log(minitrips);
          saveData(tick,tit,descrip,actor,range_pri,date_maxi,date_mini,minitrips);
          res.json(searc);
        }
      });
    }
    else{
      console.log(categs[0].createdAt);
      var fechaBusqueda = new Date(categs[0].createdAt);
      var now = Date(Date.now());
      now = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
      fechaBusqueda = dateFormat(fechaBusqueda, "yyyy-mm-dd HH:MM:ss");
      console.log(fechaBusqueda);
      console.log(now);
      var diff = diffDates(fechaBusqueda,now);
      console.log(diff);
      if (diff > 60){
        console.log('The search has expired');
        Trip.find(query)
            .sort(sort)
            .lean()
            .exec(function(err, searc){
          console.log('Start searching trips in trips');
          if(err){
            res.send(err);
          }
          else{
            var minitrips = [{'ticker': searc[0].ticker,'title': searc[0].title,'description':  searc[0].description,'date_end': searc[0].date_end}];
            console.log(minitrips);
            saveData(tick,tit,descrip,actor,range_pri,date_maxi,date_mini,minitrips);
            res.json(searc);
          }
        });
      }
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

function diffDates(date1, date2) {
  var dt1 = new Date(date1);
  var dt2 = new Date(date2);
  var diff = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
  if (diff == 0){
    dt1 = dateFormat(dt1, "HH:MM:ss");
    dt2 = dateFormat(dt2, "HH:MM:ss");
    var cut1 = dt1.split(':');
    var cut2 = dt2.split(':');
    var diff_h = cut2[0]-cut1[0];
    if (cut2[0]-cut1[0]==0){
      var diff_m = cut2[1]-cut1[1];
      return diff_m;
    }else{
      var diff_m = cut2[1]-cut1[1];
      return diff_m + diff_h * 60;
    }
  }else{
    return diff;
  }
  
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