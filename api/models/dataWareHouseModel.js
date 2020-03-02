'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AvgMinMaxStdDevSchema = new Schema({
  avg: {
      type: Number
  },
  min: {
      type: Number
  },
  max: {
      type: Number
  },
  standard_desviation: {
    type: Number
}
});

var DataWareHouseSchema = new mongoose.Schema({
  tripsPerManager: [],
  applicationsPerTrips: [AvgMinMaxStdDevSchema],
  fullPriceTrips: [AvgMinMaxStdDevSchema],
  ratioApplicationsPerStatus: [AvgMinMaxStdDevSchema],
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
