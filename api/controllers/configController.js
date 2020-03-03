'use strict';

/*---------------APPLICATION----------------------*/
var mongoose = require('mongoose'),
  Config = mongoose.model('Configs');

exports.get_configs = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  Config.find(function(err, configs) {
    if (err){
      console.error(Date(), ` ERROR: - GET /configs , Some error ocurred while retrieving applications: ${err.message}`);
      res.status(500).send(err);
    }
    else{
      console.log(Date(), ` SUCCESS: -GET /configs`);
      res.json(configs);
    }
  });
};


exports.create_configs = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_config = new Config(req.body);
  new_config.save(function(err, config) {
    if (err){
      if(err.name=='ValidationError') {
        console.error(Date(), ` ERROR: - POST /configs , Some error ocurred validating the apllication: ${err.message}`);
        res.status(422).send(err);
      }
      else{
        console.error(Date(), ` ERROR: - POST /configs , Some error ocurred while saving the application: ${err.message}`);
        res.status(500).send(err);
      }
    }
    else{
      console.log(Date(), ` -POST /configs`);
      res.json(config);
    }
  });
};

exports.edit_config = function(req, res) {
  console.log(Date(), ` -PUT /configs/${req.params.configId}`)
  Config.findOneAndUpdate({_id: req.params.configId}, req.body, function(err, config) {
      if (err){
        if(err.name=='ValidationError') {
          console.error(Date(), ` ERROR: - PUT /configs/${req.params.configId} , The config is publish can not update`);  
          res.status(422).send(err);
        }
        else{
          res.status(500).send(err);
        }
      }
      else{
        res.json(config);
      }
    });
};

exports.delete_config = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  Application.deleteMany({}, function(err, application) {
        if (err){
          res.status(500).send(err);
        }
        else{
          console.log(Date(), ` SUCCESS: -DELETE /configs`);
          res.json({ message: 'Application successfully deleted' });
        }
    });
};