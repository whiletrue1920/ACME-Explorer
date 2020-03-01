'use strict';
var mongoose = require('mongoose');
var TripSchema = require('mongoose').model('Trips').schema;
var Schema = mongoose.Schema;


var SearchesSchema = new Schema({
    actorId: {
        type: Schema.Types.ObjectId
    },
    title: {
        type: String,
    },
    ticker: {
        type: String,
    },
    description: {
        type: String,
    },
    date_min: {
        type: Date,
        default: Date.now
    },
    date_max: {
        type: Date,
        //required: 'Kindly enter the trip date_end'
    },
    price_range: {
        type: String,
        //required: 'Kindly enter the trip price max'
    },
    trips:{
        type: String
    } //[TripSchema]
}, {strict:false, timestamps: true });


module.exports = mongoose.model('Searches', SearchesSchema);