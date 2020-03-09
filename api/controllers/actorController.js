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
  admin = require('firebase-admin'),
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

//Should be an admin
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

//Should be an admin
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

exports.update_a_verified_actor = function(req, res) {
  //Customer and Clerks can update theirselves, administrators can update any actor
  console.log('Starting to update the actor...');
  Actor.findById(req.params.actorId, async function(err, actor) {
    if (err){
      res.send(err);
    }
    else{
      console.log('actor: '+actor);
      var idToken = req.headers['idtoken'];//WE NEED the FireBase custom token in the req.header['idToken']... it is created by FireBase!!
      if (actor.role.includes('MANAGERS') || actor.role.includes('EXPLORERS') || actor.role.includes('SPONSOR')){
        var authenticatedUserId = await authController.getUserId(idToken);
        if (authenticatedUserId == req.params.actorId){
          Actor.findOneAndUpdate({_id: req.params.actorId}, req.body, {new: true}, function(err, actor) {
            if (err){
              res.send(err);
            }
            else{
              res.json(actor);
            }
          });
        } else{
          res.status(403); //Auth error
          res.send('The Actor is trying to update an Actor that is not himself!');
        }    
      } else if (actor.role.includes('ADMINISTRATORS')){
          Actor.findOneAndUpdate({_id: req.params.actorId}, req.body, {new: true}, function(err, actor) {
            if (err){
              res.send(err);
            }
            else{
              res.json(actor);
            }
          });
      } else {
        res.status(405); //Not allowed
        res.send('The Actor has unidentified roles');
      }
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


// Ban/unban. Only admin
exports.ban_an_actor = function(req,res){
  //If not and admin, res.status(403); "More privileges required due to this action"
  Actor.findOneAndUpdate({ _id: req.params.actorId},
      { $set: {"state": "DEACTIVATED"}},
          {new: true},
          function (err,actor){
              if (err){
                  res.status(500).send(err);
              }else{
                  res.json(actor);
              }
          })
}

exports.unban_an_actor = function(req,res){
  //If not and admin, res.status(403); "More privileges required due to this action"
  Actor.findOneAndUpdate({ _id: req.params.actorId},
      { $set: {"state": "ACTIVATED"}},
          {new: true},
          function (err,actor){
              if (err){
                  res.status(500).send(err);
              }else{
                  res.json(actor);
              }
          })
}

/*---------------LOGIN----------------------*/

exports.login_an_actor = async function(req, res) {
  
  console.log(Date(), ` -GET /login/?=${req.query.email} , starting login an actor`)
  
  var emailParam = req.query.email;
  var password = req.query.password;
  Actor.findOne({ email: emailParam }, function (err, actor) {
      if (err) { 
        console.error(Date(), ` ERROR: - GET /login/?=${req.query.email} , Some error occurred: ${err.message}`);
        res.status(500);
        res.send({message: 'forbidden',error: err}); 
      }

      // No actor found with that email as username
      else if (!actor) {
        console.error(Date(), ` ERROR: - GET /login/?=${req.query.email} , Not found user with email: ${req.query.email}`);
        res.status(401); //an access token isn’t provided, or is invalid
        res.json({message: 'forbidden',error: err});
      }

      else if ((actor.state === 'DEACTIVATED') && (actor.validated == false)) {
        console.error(Date(), ` ERROR: - GET /login/?=${req.query.email} , Invalid actor role for login`);
        res.status(403); //an access token is valid, but the actor is deactivated
        res.json({message: 'forbidden',error: err});
      }
      else{
        // Make sure the password is correct
        actor.verifyPassword(password, async function(err, isMatch) {
          if (err) {
            console.error(Date(), ` ERROR: - GET /login/?=${req.query.email} , Some error occurred: ${err.message}`);
            res.status(401);
            res.send({message: 'forbidden',error: err});
          }

          // Password did not match
          else if (!isMatch) {
            console.error(Date(), ` ERROR: - GET /login/?=${req.query.email} , Password did not match`);
            res.status(401); //an access token isn’t provided, or is invalid
            res.json({message: 'forbidden',error: err});
          }

          else {
              try{
                var customToken = await admin.auth().createCustomToken(actor.email);
              } catch (error){
                console.log("Error creating custom token:", error);
              }
              actor.customToken = customToken;
              console.log('Login Success... sending JSON with custom token');
              res.json(actor);
          }
      });
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