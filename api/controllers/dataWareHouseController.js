
var async = require("async");
var mongoose = require('mongoose'),
  DataWareHouse = mongoose.model('DataWareHouse'),
  Trips = mongoose.model('Trips'),
  Actor = mongoose.model('Actors'),
  Application = mongoose.model('Applications'),
  Cubes;

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
        datosCubo  

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


// Returns the amount of money that explorer e has spent on trips during period p, which can be M01-M36 to 
// denote any of the last 1-36 months or Y01-Y03 to denote any of the last three years
exports.cube = function (req, res) {

  var explorerId = req.params.explorer;
  var mes = req.params.period;

  getMaxDate(req.params.period);

  
  for (var i = 1; i < 37; i++) {
    var mes = "M";
    if (i < 10) {
        mes = mes + "0" + i;
    } else {
        mes = mes + i;
    }
    var minDateRange = new Date();
    
    minDateRange.setMonth(minDateRange.getMonth() - i);
    //console.log(minDateRange);

    var actors_explorer = Actor.aggregate([
      {$match:{role: {$eq:"EXPLORERS"}}}
    ])
  
  //  var resultado;
    
    for(var i=0; i<actors_explorer.length;i++){
    
        var actorId = actors_explorer[i];
    
        var applications = Application.aggregate([
            {$match:{
                status: "ACCEPTED",
                explorer: explorerId,
                created:{
                $gte: minDateRange
            }}},
            {$group:{_id:actorId,tripId:{$push: "$tripId"}}}
        ])
    
        var trips = Trips.aggregate([
            {$match:{_id:{$in:applications}}},
            {$project:{total:{$sum:"$full_price"}}}
        ])
    
        //resultado.put(actorId, trips.total)

      };

    }

    res.json(trips);

};

/*Launch a process to compute a cube of the form M[e, p] that returns the amount of
money that explorer e has spent on trips during period p, which can be M01-M36 to
denote any of the last 1-36 months or Y01-Y03 to denote any of the last three years*/ 

exports.cubeEnrique = async function (req, res) {

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
  }

  res.json(amount);

};

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
  //TODO: ¿DEVOLVER ERROR SI NO ENCUENTRA EL EXPLORER?
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

// function getMongoOperator(coString) {
//   var co;
//   switch (coString) {
//       case "==":
//           co = "$eq";
//           break;
//       case '!=':
//           co = "$ne";
//           break;
//       case '>':
//           co = "$gt";
//           break;
//       case '>=':
//           co = "$gte";
//           break;
//       case '<':
//           co = "$lt";
//           break;
//       case '<=':
//           co = "$lte";
//           break;
//       default:
//           co = null
//           break;
//   }
//   return co;
// }

// // Given the period 'p', an amount of money 'm and a comparison operator 'co', 
// // returns the explorers that have spent 'co' than 'm' during 'p'.
// exports.cube_explorers = function (req, res) {
//   var supportedCO = ['==', '!=', '>', '>=', '<', '<='];
//   var queryCO = req.query.co;
//   var period = req.query.period;
//   var money = req.query.money;
//   if (co.in(supportedCO)) {
//       var jsonCO = {};
//       var co = getMongoOperator(queryCO);
//       jsonCO[co] = money; // if 'co' is >=, and money = 20, this will give {$gte: 20}
//       Cubes.aggregate([
//           {
//               $match: {
//                   period: period,
//                   money: jsonCO
//               }
//           }, { $group: { _id: "$explorer", explorers: { $push: "$explorer" } } },
//           {
//               $project: {
//                   _id: 0,
//                   explorers: "$explorers"
//               }
//           }
//       ], function(err, explorersReturned){
//           if (err) {
//               res.status(404);
//           } else {
//               res.send(explorersReturned);
//           }
//       });
//   } else {
//       res.status(400).send("Comparison operator not supported");
//   }
// };