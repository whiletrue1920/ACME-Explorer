'use strict';

/*---------------APPLICATION----------------------*/
var mongoose = require('mongoose'),
  Application = mongoose.model('Applications');

exports.list_all_applications = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  Application.find(function(err, applications) {
    if (err){
      console.error(Date(), ` ERROR: - GET /applications , Some error ocurred while retrieving applications: ${err.message}`);
      res.status(500).send(err);
    }
    else{
      console.log(Date(), ` SUCCESS: -GET /applications`);
      res.json(applications);
    }
  });
};


exports.create_an_application = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_application = new Application(req.body);
  new_application.save(function(err, application) {
    if (err){
      if(err.name=='ValidationError') {
        console.error(Date(), ` ERROR: - POST /applications , Some error ocurred validating the apllication: ${err.message}`);
        res.status(422).send(err);
      }
      else{
        console.error(Date(), ` ERROR: - POST /applications , Some error ocurred while saving the application: ${err.message}`);
        res.status(500).send(err);
      }
    }
    else{
      console.log(Date(), ` -POST /applications`);
      res.json(application);
    }
  });
};


exports.get_application = function(req, res) {
  console.log(Date(), ` -GET /applications/${req.params.applicationId}`)
  Application.findById(req.params.applicationId, function(err, application) {
      if (err){
        console.error(Date(), ` ERROR: - GET /applications/${req.params.applicationId} , Some error ocurred while retrieving a trip : ${err.message}`);
        res.status(500).send(err);
      }
      else{
        console.log(Date(), ` SUCCESS: -GET /applications`);
        res.json(application);
      }
    });
};


exports.update_application = function(req, res) {
  console.log(Date(), ` -PUT /applications/${req.params.applicationId}`)
  Application.findOneAndUpdate({_id: req.params.applicationId}, req.body, {new: true}, function(err, application) {
      if (err){
        if(err.name=='ValidationError') {
          console.error(Date(), ` ERROR: - PUT /applications/${req.params.applicationId} , The trip is publish can not update`);  
          res.status(422).send(err);
        }
        else{
          res.status(500).send(err);
        }
      }
      else{
        res.json(application);
      }
    });
};

exports.delete_application = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  Application.deleteOne({_id: req.params.applicationId}, function(err, application) {
        if (err){
          res.status(500).send(err);
        }
        else{
          console.log(Date(), ` SUCCESS: -DELETE /applications/${req.params.applicationId}`);
          res.json({ message: 'Application successfully deleted' });
        }
    });
};

exports.delete_all_applications = function(req, res) {
  Application.deleteMany({}, function(err, application) {
    if (err) {
      console.log(err)
    } else {
      console.log(Date(), ` SUCCESS: -DELETE /applications`);
      res.json({ message:'success'});
    }
  });
};

//Búsqueda de las aplicaciones por “actor_id” y agrupado por “status”. 
async function search_applications_by_actor_id_group_by_status(){
  console.log(Date(), ` search_applications_by_actor_id_group_by_status`);
  
  var applications_by_actor = await Application.aggregate(
      [
          {$match:{actorId: {$eq:'$actorId'}}},
          {$group:{_id:"$status"}}
      ]).toArray().exec();

  return applications_by_actor;
}