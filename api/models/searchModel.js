'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SearchesSchema = new Schema({
    actorId: {
        type: Schema.Types.ObjectId
    },
    keyword: {
        type: String,
        required: 'Kindly enter your keyword'  
    },
    date_min: {
        type: Date,
        default: Date.now
    },
    date_max: {
        type: Date,
        required: 'Kindly enter the trip date_end'
    },
    trips: [StageSchema]
}, { strict: 'throw', timestamps: true });


module.exports = mongoose.model('Searches', SearchesSchema);