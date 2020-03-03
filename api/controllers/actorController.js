'use strict';

//RESPONSE_STATUS_CODE
const CREATED=201;
const NO_CONTENT=204;
const STATUS_CODE_NOT_FOUND=404;  
const STATUS_CODE_CAST_ERROR=400;  
const STATUS_CODE_VALIDATION_ERROR=422;  
const STATUS_CODE_INTERNAL_SERVER_ERROR=500;


/*---------------ACTOR----------------------*/
var mongoose = require('mongoose'),
  Actor = mongoose.model('Actors');

exports.list_all_actors = function(req, res) {
   //Check if the role param exist
   var roleName;
   if(req.query.role){
      roleName=req.query.role;
    }
    Actor.find({}, function(err, actors) {
        if (err){
          res.status(500).send(err);
        }
        else{
            res.json(actors);
        }
    });
};

exports.create_an_actor = function(req, res) {
  var new_actor = new Actor(req.body);
  new_actor.save(function(err, actor) {
    if (err){
      res.send(err);
    }
    else{
      res.status(CREATED).json(actor);
    }
  });
};

exports.read_an_actor = function(req, res) {
  Actor.findById(req.params.actorId, function(err, actor) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(actor);
    }
  });
};

exports.update_an_actor = function(req, res) {
    Actor.findOneAndUpdate({_id: req.params.actorId}, req.body, {new: true}, function(err, actor) {
        if (err){
            res.send(err);
        }
        else{
            res.json(actor);
        }
    });
};

exports.validate_an_actor = function(req, res) {
  //Check that the user is an Administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  console.log("Validating an actor with id: "+req.params.actorId)
  Actor.findOneAndUpdate({_id: req.params.actorId},  { $set: {"validated": "true" }}, {new: true}, function(err, actor) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(actor);
    }
  });
};

exports.delete_an_actor = function(req, res) {
    Actor.deleteOne({_id: req.params.actorId}, function(err, actor) {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.status(NO_CONTENT).json({ message: 'Actor successfully deleted' });
        }
    });
};


//Suma de dinero gastado de cada usuario(rol=explorer) durante un intervalo de tiempo (min 1 mes, máximo 36 meses).
async function amount_of_money_that_explorer_has_spent_on_trips_during_period(){
  console.log(Date(), ` amount_of_money_that_explorer_has_spent_on_trips_during_period`);
  

  //REVISARLO
  // var actors_explorer = await Actor.aggregate([
  //   {$match:{role: {$eq:"EXPLORERS"}}}
  // ]).toArray().exec();

  // var money = await Application.aggregate(
  //     [
  //       {$group:{_id:{$in:actors_explorer},
  //       viajes:{$push: "$tripId"}}}
  //     ]).exec();
  // console.log(money);

  // var trips = await Trip.aggregate([
  //     {$group:{_id:"$full_price"}}
  //     ]).exec();
  //return money;
}