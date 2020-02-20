'use strict';

/*---------------APPLICATION----------------------*/
var mongoose = require('mongoose'),
  Application = mongoose.model('Applications');

exports.list_all_applications = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  Application.find(function(err, applications) {
    if (err){
      res.status(500).send(err);
    }
    else{
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


exports.get_application = function(req, res) {
  Application.findById(req.params.applicationId, function(err, application) {
      if (err){
        res.status(500).send(err);
      }
      else{
        res.json(application);
      }
    });
};


exports.update_application = function(req, res) {
  //Check that the user is administrator if it is updating more things than comments and if not: res.status(403); "an access token is valid, but requires more privileges"
  Application.findOneAndUpdate({_id: req.params.applicationId}, req.body, {new: true}, function(err, application) {
      if (err){
        if(err.name=='ValidationError') {
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
            res.json({ message: 'Application successfully deleted' });
        }
    });
};

exports.delete_all_applications = function(req, res) {
  Application.deleteMany({}, function(err, application) {
    if (err) {
      console.log(err)
    } else {
      res.json({ message:'success'});
    }
  });
};