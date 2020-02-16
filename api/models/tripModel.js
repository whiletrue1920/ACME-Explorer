'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const generate = require('nanoid/generate');
const dateFormat = require('dateformat');

var TripSchema = new Schema({
    ticker: {
      type: String,
      unique: true,
      //This validation does not run after middleware pre-save
      validate: {
        validator: function(v) {
            return /\d{6}-\w{4}/.test(v);
        },
        message: 'Trip ticker is not valid!, Pattern("\d(6)-\w(4)")'
      }
    },
    title: {
        type: String,
        required: 'Kindly enter the trip title'
    },
    description: {
        type: String,
        required: 'Kindly enter the trip description'
    },
    //TODO: Cálculo automático de full_price cuando se introduzcan los stages
    full_price: {
        type: Number,
        required: 'Kindly enter the trip full_price'
    },
    requirements: {
        type: [String], 
        required: 'Kindly enter the trip requirements'
    },
    date_start: {
        type: Date,
        required: 'Kindly enter the trip date_start'
    },
    date_end: {
        type: Date,
        required: 'Kindly enter the trip date_end'
    },
    pictures: {
        data: Buffer, 
        contentType: String
    },
    canceled: {
        type: Boolean,
        default: false
    },
     //TODO: Validar pues no funciona correctamente
    reason: {
        type: String,
        required: [
            function() { return this.canceled && this.reason===''; },
            'The reason is required if trip is canceled'
        ]
    }
    //TODO: Falta esquema del documento Stage
}, { strict: false, timestamps: true });

// Execute before each item.save() call
TripSchema.pre('save', function(callback) {
    var new_trip = this;
    var day=dateFormat(new Date(), "yymmdd");
    var generated_ticker = [day, generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)].join('-')
    new_trip.ticker = generated_ticker;
    callback();
  });

module.exports = mongoose.model('Trips', TripSchema);