'use strict';
module.exports = function(app) {
  var trips = require('../controllers/tripController');

  app.route('/v1/trips')
	.get(trips.list_all_trips)
	.post(trips.create_a_trip);

  app.route('/v1/trips/:tripId')
    .get(trips.read_a_trip)
	.put(trips.update_a_trip)
    .delete(trips.delete_a_trip);
  
  /**
   * Search engine for trips
   * Get trips depending on params
   *    RequiredRoles: Explorer
   *
   * @section trip
   * @type get
   * @url /v1/trips/search
   * @param {string} keyword
   * @param {string} price_range
   * @param {string} date_range 
  */
  app.route('/v1/trips/search')
  .get(trip.search_trips);
};