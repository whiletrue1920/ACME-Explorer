'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema = new Schema({
  date_finder_minutes: {
    type: Number,
    required: 'Kindly enter the status of the application'
  },
  flate_rate: {
    type: Number,
    required: 'Kindly enter the flate_rate of the application'
  },
  finder_limit: {
    type: Number,
    required: 'Kindly enter the limit of the finder'    
  }
}, { strict: false });

ConfigSchema.index({ actorId: 1 });

module.exports = mongoose.model('Configs', ConfigSchema);
