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
  Sponsorship = mongoose.model('Sponsorships');

exports.list_all_sponsorships = function(req, res) {
    Sponsorship.find({}, function(err, sponsorships) {
        if (err){
          res.status(500).send(err);
        }
        else{
            res.json(sponsorships);
        }
    });
};

exports.create_an_sponsorship = function(req, res) {
  var new_sponsorship = new Sponsorship(req.body);
  new_sponsorship.save(function(err, sponsorship) {
    if (err){
      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
    }
    else{
      res.status(CREATED).json(sponsorship);
    }
  });
};

exports.read_an_sponsorship = function(req, res) {
    Sponsorship.findById(req.params.sponsorshipId, function(err, sponsorship) {
    if (err){
      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
    }
    else{
      if(res === null){
        res.status(STATUS_CODE_NOT_FOUND).send({message: 'Sponsorship not found'});
      }else{
        res.status(200).json(sponsorship);
      }
    }
  });
};

exports.update_an_sponsorship = function(req, res) {
    Sponsorship.findOneAndUpdate({_id: req.params.sponsorshipId}, req.body, {new: true}, function(err, sponsorship) {
        if (err){
            res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
        }
        else{
            res.status(200).json(sponsorship);
        }
    });
};

exports.validate_an_sponsorship = function(req, res) {
  console.log("Validating an sponsorship with id: "+req.params.sponsorshipId)
  Sponsorship.findOneAndUpdate({_id: req.params.sponsorshipsId},  { $set: {"validated": "true" }}, {new: true}, function(err, sponsorship) {
    if (err){
      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
    }
    else{
      res.json(sponsorship);
    }
  });
};

exports.delete_an_sponsorship = function(req, res) {
    Sponsorship.deleteOne({_id: req.params.sponsorshipId}, function(err, sponsorship) {
        if (err){
            res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
        }
        else{
            res.status(NO_CONTENT).json({ message: 'Sponsorship successfully deleted' });
        }
    });
};

exports.pay_an_sponsorship = function(req, res) {
    Sponsorship.findOneAndUpdate({_id: req.params.sponsorshipId}, { $set: {"payed": "true" }}, {new: true}, function(err, sponsorship) {
      if (err){
        res.status(500).send(err);
      }
      else{
        res.json(sponsorship);
      }
    });
};