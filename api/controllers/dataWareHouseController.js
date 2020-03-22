
var async = require("async");
var top10 = require('./../controllers/searchController.js');
var mongoose = require('mongoose'),
  DataWareHouse = mongoose.model('DataWareHouse'),
  Trips = mongoose.model('Trips'),
  Actor = mongoose.model('Actors'),
  Application = mongoose.model('Applications'),
  Cube = mongoose.model('Cubes');

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
        computeRatioApplicationsPerStatus
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



/* ----------------- Cubo ----------- */

/*Launch a process to compute a cube of the form M[e, p] that returns the amount of
money that explorer e has spent on trips during period p, which can be M01-M36 to
denote any of the last 1-36 months or Y01-Y03 to denote any of the last three years*/ 

/* ---- a --- */

exports.cubeAmountMoney = async function (req, res) {

  let explorer_Id = mongoose.Types.ObjectId(req.params.explorer);

  //1. Calculamos la fecha máxima a procesar
  let maxDate = await getMaxDate(req.params.period);

  //2. Obtenemos el explorador
  var explorer = await Actor.aggregate([
    {$match: {
        _id: explorer_Id,
        role: {$eq:"EXPLORERS"}
    }}
  ]).exec();

  //TODO: ¿DEVOLVER ERROR SI NO ENCUENTRA EL EXPLORER?

  //3. Obtenemos el array de Applications que posee el explorador en estado "ACCEPTED". Mayores a la fecha actual y menores a la fecha futura
  var applications = await Application.aggregate([
    { $match: {
          status: "ACCEPTED",
          actorId: req.params.explorer,
          created: {
              $gte: new Date(),
              $lte: maxDate
      },
      }},
      {$group:{_id:"$tripId"}}
  ]).exec();

  let amount=0;

  //4. Obtenemos el precio de los trips y lo añadimos a la variable acumuladora amount
  for(var i = 0; i < applications.length; i++){
    tripId = mongoose.Types.ObjectId(applications[i]._id);
    var trip = await Trips.aggregate([
      {$match: {
        _id: tripId
      }
      }]).exec();
    amount = amount + trip[0].full_price;
  };
  
      var new_cube = new Cube();
      new_cube.actorId = explorer_Id;
      new_cube.money = amount;
      new_cube.period = req.params.period;
  
      new_cube.save(async function (err, cubeSaved) {
          if (err) {
              console.log("Error al guardar el cubo:  " + err);
          } else {
              console.log("Añadido correctamente un nuevo registro al cubo. Fecha: " + new Date());
          }
      });

  res.json(amount);

}

function getMaxDate(period){

  //Los posibles formatos en los que puede venir el periodo
  //period1= "M01-M36"
  //period2= "Y01-Y03"

  let interval=period.split("-")[1]
  let format = interval.charAt(0)
  let date = new Date();
  
  if(format=="M"){
    let month = interval.substr(interval.length - 2);
    return addMonths(date,month);
  }else{
    let years = interval.substr(interval.length - 2);
    return addYears(date,years)
  }
  //TODO: ¿DEVOLVER ERROR SI EL PERIODO NO SE ADAPTA AL FORMATO M01-M36 Y Y01-Y03?
}

function addMonths(date, months) {
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}

function addYears(date, years) {
  var d = date.getDate();
  date.setFullYear(date.getFullYear() + +years);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}

/* ---- b --- */

/* Given p, return the explorers e such that M[e, p] q v, where v denotes an arbitrary amount of money and q is a comparison 
operator (that is, “equal”, “not equal”, “greater than”, “greater than or equal”, “smaller than”, or “smaller than or equal”) */

exports.cubeExplorersComparator = async function (req, res) {

  var period = req.params.period;
  var querycomparators = req.params.operator;
  var money = Number(req.params.amountMoney);

  var operators = {
    "eq": (amountToCompare) => amountToCompare == money,
    "ne": (amountToCompare) => amountToCompare != money,
    "gt": (amountToCompare) => amountToCompare > money,
    "gte": (amountToCompare) => amountToCompare >= money,
    "lt": (amountToCompare) => amountToCompare < money,
    "lte": (amountToCompare) => amountToCompare <= money
  }

  if (querycomparators in operators) {
    
      var amount = {};
      var operator = getOperator(querycomparators);
      amount[operator] = money; 

      Cube.aggregate([
          {
              $match: {
                  period: period,
                  money: amount
              },
          }, { $group: { 
                  _id: "$actorId"
       
              } 
          }
      ],function(err, explorersResult){
          if (err) {
              res.status(404);
          } else {
              res.send(explorersResult);
          }
      });
  } else {
      res.status(400).send("Comparison operator not supported.Check the comparator");
  }
};

function getOperator(string) {
  var operator;
  switch (string) {
      case 'eq':
          operator = "$eq";
          break;
      case 'ne':
          operator = "$ne";
          break;
      case 'gt':
          operator = "$gt";
          break;
      case 'gte':
          operator = "$gte";
          break;
      case 'lt':
          operator = "$lt";
          break;
      case 'lte':
          operator = "$lte";
          break;
      default:
          operator = null;
          break;
  }
  return operator;
}
