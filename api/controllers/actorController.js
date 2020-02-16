'use strict';

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
      res.json(actor);
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
    Actor.remove({_id: req.params.actorId}, function(err, actor) {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.json({ message: 'Actor successfully deleted' });
        }
    });
};