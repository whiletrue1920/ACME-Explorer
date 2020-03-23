'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CubeSchema = new mongoose.Schema({
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'Actors'
    },
    period: {
        type: String,
        required: 'Kindly enter the period of time'
    },
    money:{
        type: Number,
        required: true,
        min: 0
    },
    created: {
        type: Date,
        default: Date.now
    },
  })
  

  module.exports = mongoose.model('Cubes', CubeSchema);