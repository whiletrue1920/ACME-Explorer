'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema = new Schema({
  date_finder_minutes: {
    type: Number,
    required: 'Kindly enter the status of the application'
  },
  flat_rate: {
    type: Number,
    min: 10,
    default: 30,
    required: 'Kindly enter the flat rate'
  },
  finder_limit: {
    type: Number,
    required: 'Kindly enter the limit of the finder'    
  }
}, { strict: false });

ConfigSchema.index({ actorId: 1 });

module.exports = mongoose.model('Configs', ConfigSchema);
