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

SponsorshipSchema.pre('save', async function (callback) {
  
  const sponsor = await Actor.findById({_id: this.sponsor}); 
  if (sponsor.flat_rate) {
      console.log("Flat rate is true. Then sponsorship is payed");
      this.payed = true;
  }else{
      console.log("Flat rate is false. Then sponsorship is not payed");
  }
  console.log(this.payed);
  callback();
});

module.exports = mongoose.model('Sponsorships', SponsorshipSchema);