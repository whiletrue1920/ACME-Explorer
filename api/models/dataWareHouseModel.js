'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DataWareHouseSchema = new mongoose.Schema({
  tripsPerManager: [{
    type: Schema.Types.ObjectId
  }],
  applicationsPerTrips: [{
    type: Schema.Types.ObjectId
  }],
  fullPriceTrips: [{
    type: Schema.Types.ObjectId
  }],
  ratioApplicationsPerStatus:{
    type: Number,
    max: 1,
    min: 0
  },
  computationMoment: {
    type: Date,
    default: Date.now
  },
  rebuildPeriod: {
    type: String
  }
}, { strict: false });

DataWareHouseSchema.index({ computationMoment: -1 });

module.exports = mongoose.model('DataWareHouse', DataWareHouseSchema);
