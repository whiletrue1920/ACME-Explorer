'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema = new Schema({
  date_finder_minutes: {
    type: String,
    required: 'Kindly enter the status of the application'
  },
  flate_rate: {
    type: number,
    required: 'Kindly enter the flate_rate of the application'
  }
}, { strict: false });

ApplicationSchema.index({ actorId: 1 });

module.exports = mongoose.model('Configs', ConfigSchema);
