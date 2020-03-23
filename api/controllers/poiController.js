'use strict';

/*---------------POI----------------------*/
var mongoose = require('mongoose'),
  Trip = mongoose.model('Trips'),
  Poi = mongoose.model('Pois');
var admin = require('firebase-admin');
var authController = require('./authController');

exports.get_pois = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  Poi.find(function(err, pois) {
    if (err){
      console.error(Date(), ` ERROR: - GET /pois , Some error ocurred while retrieving applications: ${err.message}`);
      res.status(500).send(err);
    }
    else{
      console.log(Date(), ` SUCCESS: -GET /pois`);
      res.json(pois);
    }
  });
};

exports.get_poi = function(req, res) {
    Poi.findById(req.params.poiId, function(err, poi) {
      if (err){
        console.error(Date(), ` ERROR: - GET /poi/${req.params.poiId} , Some error ocurred while retrieving applications: ${err.message}`);
        res.status(500).send(err);
      }
      else{
        res.status(200).json(poi);
      }
    });
  };

exports.create_poi = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_poi = new Poi(req.body);
  new_poi.save(function(err, poi) {
    if (err){
      if(err.name=='ValidationError') {
        console.error(Date(), ` ERROR: - POST /pois , Some error ocurred validating the apllication: ${err.message}`);
        res.status(422).send(err);
      }
      else{
        console.error(Date(), ` ERROR: - POST /pois , Some error ocurred while saving the application: ${err.message}`);
        res.status(500).send(err);
      }
    }
    else{
      console.log(Date(), ` -POST /pois`);
      res.json(poi);
    }
  });
};

exports.edit_poi = function(req, res) {
  console.log(Date(), ` -PUT /pois/${req.params.poiId}`)
  Poi.findOneAndUpdate({_id: req.params.poiId}, req.body, function(err, poi) {
      if (err){
        if(err.name=='ValidationError') {
          console.error(Date(), ` ERROR: - PUT /pois/${req.params.poiId} , The config is publish can not update`);  
          res.status(422).send(err);
        }
        else{
          res.status(500).send(err);
        }
      }
      else{
        res.json(poi);
      }
    });
};

exports.delete_poi = function(req, res) {
  Poi.deleteOne({_id: req.params.poiId}, function(err, poi) {
        if (err){
          res.status(500).send(err);
        }
        else{
          console.log(Date(), ` SUCCESS: -DELETE /pois`);
          res.json({ message: 'Poi successfully deleted' });
        }
    });
};

exports.assig_poi_to_stage = function(req, res) {
  console.log(Date(), ` -PUT /v2/pois/assign/${req.params.poiId}/trip/${req.params.stageId}`)
  Trip.findOneAndUpdate({_id: req.params.tripId}, req.body, function(err, poi) {
      if (err){
        if(err.name=='ValidationError') {
          console.error(Date(), ` ERROR: - PUT v2/pois/assign/${req.params.poiId}/trip/${req.params.stageId} , The config is publish can not update`);  
          res.status(422).send(err);
        }
        else{
          res.status(500).send(err);
        }
      }
      else{
        res.json(poi);
      }
    });
};