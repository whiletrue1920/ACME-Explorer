
var async = require("async");
var top10 = require('./../controllers/searchController.js');
var mongoose = require('mongoose'),
  DataWareHouse = mongoose.model('DataWareHouse'),
  Trips = mongoose.model('Trips'),
  Application = mongoose.model('Applications');

exports.list_all_indicators = function(req, res) {
  console.log('Requesting indicators');
  
  DataWareHouse.find().sort("-computationMoment").exec(function(err, indicators) {
    if (err){
      res.send(err);
    }
    else{
      res.json(indicators);
    }
  });
};

exports.last_indicator = function(req, res) {
  
  DataWareHouse.find().sort("-computationMoment").limit(1).exec(function(err, indicators) {
    if (err){
      res.send(err);
    }
    else{
      res.json(indicators);
    }
  });
};

var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

//'0 0 * * * *' una hora
//'*/30 * * * * *' cada 30 segundos
//'*/10 * * * * *' cada 10 segundos
//'* * * * * *' cada segundo
var rebuildPeriod = '*/10 * * * * *';  //El que se usará por defecto
var computeDataWareHouseJob;

exports.rebuildPeriod = function(req, res) {
  console.log('Updating rebuild period. Request: period:'+req.query.rebuildPeriod);
  rebuildPeriod = req.query.rebuildPeriod;
  computeDataWareHouseJob.setTime(new CronTime(rebuildPeriod));
  computeDataWareHouseJob.start();

  res.json(req.query.rebuildPeriod);
};

function createDataWareHouseJob(){
      computeDataWareHouseJob = new CronJob(rebuildPeriod,  function() {
      
      var new_dataWareHouse = new DataWareHouse();
      console.log('Cron job submitted. Rebuild period: '+rebuildPeriod);
      async.parallel([
        computeTripsPerManager,
        computeApplicationsPerTrips,
        computeFullPriceTrips,
        computeRatioApplicationsPerStatus,
        keywords
      ], function (err, results) {
        if (err){
          console.log("Error computing datawarehouse: "+err);
        }
        else{
          console.log("Resultados obtenidos por las agregaciones: "+JSON.stringify(results));
          new_dataWareHouse.tripsPerManager = results[0];
          new_dataWareHouse.applicationsPerTrips = results[1];
          new_dataWareHouse.fullPriceTrips = results[2];
          new_dataWareHouse.ratioApplicationsPerStatus = results[3];
          new_dataWareHouse.keywords = results[4];
          new_dataWareHouse.rebuildPeriod = rebuildPeriod;
    
          new_dataWareHouse.save(function(err, datawarehouse) {
            if (err){
              console.log("Error saving datawarehouse: "+err);
            }
            else{
              console.log("new DataWareHouse succesfully saved. Date: "+new Date());
            }
          });
        }
      });
    }, null, true, 'Europe/Madrid');
}

module.exports.createDataWareHouseJob = createDataWareHouseJob;

function computeTripsPerManager(callback) {
  Trips.aggregate([
    {$group: {
      "_id": "$organizedBy",
      "num": {$sum:1}}}
    ,{$project: {
      "organizedBy": "$_id",
      "_id": 0, 
      "avg": {$avg: "$num"},
      "min":{$min:"$num"},
      "max":{$max:"$num"},
      "standard_desviation":{$stdDevPop:"$num"}}},
  {$project:{"_id":0}}
    ], function(err, res){
      console.log('Trip per Manager ', res)
        callback(err, res)
    }); 
};

function computeApplicationsPerTrips(callback) {
  Application.aggregate([
    {$group: {
      "_id": "$tripId",
      "num": {$sum:1}}}
    ,{$project: {
      "tripId": "$_id",
      "_id": 0, 
      "avg": {$avg: "$num"},
      "min":{$min:"$num"},
      "max":{$max:"$num"},
      "standard_desviation":{$stdDevPop:"$num"}}}
    ], function(err, res){
      console.log('Application per Trips ', res)
        callback(err, res)
    }); 
};

function computeFullPriceTrips (callback) {
  Trips.aggregate([
    {$group: {
      "_id": null,
      "avg": {$avg: "$full_price"}, 
      "min":{$min:"$full_price"},
      "max":{$max:"$full_price"},
      "standard_desviation":{$stdDevPop:"$full_price"}}},
  {$project:{"_id":0}}
    ], function(err, res){
      console.log('FULL PRICE ', res)
        callback(err, res)
    }); 
};

function computeRatioApplicationsPerStatus (callback) {
  Application.aggregate([
    {$group: {
      "_id": "$status",
      "num": {$sum:1}}}
    ,{$project: {
      "status": 1,
      "_id": 0, 
      "avg": {$avg: "$num"},
      "min":{$min:"$num"},
      "max":{$max:"$num"},
      "standard_desviation":{$stdDevPop:"$num"}}}
    ], function(err, res){
      console.log('Application per Status ', res)
        callback(err, res)
    });
};

function keywords(callback) {
  top10.top10keyword(function(err, res){
    console.log('Keywords: ', res);
    callback(err, res)
  });
};