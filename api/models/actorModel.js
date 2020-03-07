'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// var SponsorshipSchema = new Schema({
//   actorId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Actors'
//   },
//   tripId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Trips'
//   },
//   banner: {
//     data: Buffer, 
//     contentType: String
//   },
//   link: {
//     type: String,
//     // required: 'Kindly enter the link'
//   },
//   payed: {
//     type: Boolean,
//     default: false
//   }
// }, { strict: false });

var ActorSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the actor name'
  },
  surname: {
    type: String,
    required: 'Kindly enter the actor surname'
  },
  email: {
    type: String,
    required: 'Kindly enter the actor email',
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']    
  },
  password: {
    type: String,
    minlength:5,
    required: 'Kindly enter the actor password'
  },
  phone: {
    type: String,
    required: 'Kindly enter the phone number'
  },
  address:{
    type: String
  },
  role: [{
    type: String,
    required: 'Kindly enter the user role(s)',
    enum: ['ADMINISTRATORS', 'MANAGERS', 'EXPLORERS', 'SPONSORS']
  }],
  state: [{
    type: String,
    required: 'Kindly enter the state',
    enum: ['ACTIVATED', 'DEACTIVATED', 'REACTIVATED']
  }],
  validated:{
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
  // sponsorship: {
  //   type: SponsorshipSchema,
  //   required: function() { return this.role === 'SPONSORS'}
  // }
}, { strict: false });


ActorSchema.pre('save', function(callback) {
  var actor = this;
  // Break out if the password hasn't changed
  if (!actor.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(actor.password, salt, function(err, hash) {
      if (err) return callback(err);
      actor.password = hash;
      callback();
    });
  });
});

ActorSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
    console.log('verifying password in actorModel: '+password);
    if (err) return cb(err);
    console.log('iMatch: '+isMatch);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('Actors', ActorSchema);
// module.exports = mongoose.model('Sponsorships', SponsorshipSchema);