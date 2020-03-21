'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MiniTripsSchema = new Schema({
    ticker: {
        type: String,
        required: 'Kindly enter the ticker of the trip'
    },
    title: {
        type: String,
        required: 'Kindly enter the tittle of the trip'
    },
    full_price: {
        type: Number,
        required: 'Kindly enter the full price of the trip'
    },
    description: {
        type: String,
        required: 'Kindly enter the description of the trip'
    },
    date_end: {
        type: Date,
        required: 'Kindly enter the trip date_end'
    }
}, { strict: 'throw' });

var SearchesSchema = new Schema({
    actorId: {
        type: Schema.Types.ObjectId,
        ref: 'Actors'
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
    trips: [MiniTripsSchema]
}, {strict:false, timestamps: true });

SearchesSchema.index({ actorId: 1 });

module.exports = mongoose.model('Searches', SearchesSchema);