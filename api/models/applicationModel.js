'use strict';
module.exports = {
  'Actor': require('../models/actorModel'),
  'Trip': require('../models/tripModel'),
};

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
  actorId: {
    type: Schema.Types.ObjectId,
    ref: 'Actors'
  },
  tripId: {
    type: Schema.Types.ObjectId,
    ref: 'Trips'
  },
  comment: {
    type: String,
    required: 'Kindly enter your comments'
  },
  status: [{
    type: String,
    required: 'Kindly enter the status of the application',
    enum: ['ACCEPTED', 'DUE', 'REJECTED','CANCELLED']
  }],
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

// Execute before each item.save() call
ApplicationSchema.pre('save', function(callback) {
  //Comprobar el objectid del actor y el objectid del trip
  var res = 0;
  var new_application = this;
  var Actor = mongoose.model('Actors');
  var Trip = mongoose.model('Trips');
  Actor.findOne(new_application.actorId, (err, actor) => {
    if (!!actor){
      Trip.findOne(new_application.tripId,(err,trip)=>{
        if (!!trip){
          return callback();
        }else{
          const err = new Error('The trip id does not exist');
          return callback(err);
        }
      })
    }else {
      const err = new Error('The actor id does not exist');
      return callback(err);
      }
    });
});

module.exports = mongoose.model('Applications', ApplicationSchema);
