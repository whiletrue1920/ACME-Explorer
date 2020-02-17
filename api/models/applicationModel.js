'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const generate = require('nanoid/generate');

var ApplicationSchema = new Schema({
  actorId: {
    type: Schema.Types.ObjectId
  },
  tripId: {
    type: Schema.Types.ObjectId
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

module.exports = mongoose.model('Applications', ApplicationSchema);
