'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  });

var PoiSchema = new Schema({
  title: {
    type: String,
    required: 'Kindly enter the title of the point of interest'
  },
  description: {
    type: String,
    required: 'Kindly enter the description of the point of interest',
  },
  coordinates: {
    type: pointSchema,
    required: 'Kindly enter the limit of the finder'    
  },
  type: {
    type: String,
    required: 'Kindly enter the type of the point of interest',
  }
}, { strict: false });

module.exports = mongoose.model('Pois', PoiSchema);
