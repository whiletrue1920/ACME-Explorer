'use strict';

module.exports = function(app) {
  var sponsorships = require('../controllers/sponsorshipController');

  app.route('/v1/sponsorships')
	  .get(sponsorships.list_all_sponsorships)
	  .post(sponsorships.create_an_sponsorship);

  app.route('/v1/sponsorships/:sponsorshipId')
    .get(sponsorships.read_an_sponsorship)
	  .put(sponsorships.update_an_sponsorship)
    .delete(sponsorships.delete_an_sponsorship);

  app.route('/v1/sponsorships/:sponsorshipId/validate')
    .put(sponsorships.validate_an_sponsorship);

  app.route('/v1/sponsorships/pay/:sponsorshipId')
    .post(sponsorships.pay_an_sponsorship);
};