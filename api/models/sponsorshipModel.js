'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SponsorshipSchema = new Schema({
  actorId: {
    type: Schema.Types.ObjectId,
    ref: 'Actors'
  },
  tripId: {
    type: Schema.Types.ObjectId,
    ref: 'Trips'
  },
  banner: {
    data: Buffer, 
    contentType: String
  },
  link: {
    type: String,
    required: 'Kindly enter the link'
  },
  payed: {
    type: Boolean,
    default: false
  }
}, { strict: false });

module.exports = mongoose.model('Sponsorships', SponsorshipSchema);