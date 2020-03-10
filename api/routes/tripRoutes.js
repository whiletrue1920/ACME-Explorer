'use strict';
module.exports = function(app) {
  var trips = require('../controllers/tripController');
  var authController = require('../controllers/authController');

  /**
   * Manage catalogue of trips: 
   * Post trips
   *    RequiredRoles: NONE
   * Get applications 
   *    RequiredRoles: NONE
   *
   * @section trips
   * @type get post 
   * @url /v1/trips
  */
  app.route('/v1/trips')
    .get(trips.list_all_trips)
    .post(trips.create_a_trip);

  /**
   * Manage catalogue of trips: 
   * Post trips
   *    RequiredRoles: MANAGERS
   * Get applications 
   *    RequiredRoles: NONE
   *
   * @section trips
   * @type get post 
   * @url /v2/trips
  */
  app.route('/v2/trips')
    .get(trips.list_all_trips)
    .post(authController.verifyUser(['MANAGERS']), trips.create_a_trip);

  /**
   * Manage catalogue of a specific trip: 
   * Put trip
   *    RequiredRoles: NONE
   * Get trip
   *    RequiredRoles: NONE
   * Delete trip
   *    RequiredRoles: NONE
   *
   * @section trip
   * @type get put delete 
   * @url /v1/trips/:tripId
  */
  app.route('/v1/trips/:tripId')
    .get(trips.read_a_trip)
	  .put(trips.update_a_trip)
    .delete(trips.delete_a_trip);

  /**
   * Manage catalogue of a specific trip: 
   * Put trip
   *    RequiredRoles: MANAGER
   * Get trip
   *    RequiredRoles: NONE
   * Delete trip
   *    RequiredRoles: MANAGERS
   *
   * @section trip
   * @type get put delete 
   * @url /v2/trips/:tripId
  */
  app.route('/v2/trips/:tripId')
    .get(trips.read_a_trip)
    .put(authController.verifyUser(['MANAGERS']), trips.update_a_trip)
    .delete(authController.verifyUser(['MANAGERS']), trips.delete_a_trip);

  /**
	 * Publish a specific trip
	 * RequiredRole: NONE
	 * @section trip
	 * @type put
	 * @url /v1/trips/publish/:tripId
	 * 
	*/
  app.route('/v1/trips/publish/:tripId')
    .put(trips.publish_a_trip)

  /**
	 * Publish a specific trip
	 * RequiredRole: MANAGERS
	 * @section trip
	 * @type put
	 * @url /v2/trips/publish/:tripId
	 * 
	*/
  app.route('/v2/trips/publish/:tripId')
    .put(authController.verifyUser(['MANAGERS']), trips.publish_a_trip)
  
  /**
	 * Cancel a specific trip
	 * RequiredRole: NONE
	 * @section trip
	 * @type put
	 * @url /v1/trips/cancel/:tripId
	 * 
	*/
  app.route('/v1/trips/cancel/:tripId')
    .put(trips.cancel_a_trip)

   /**
	 * Cancel a specific trip
	 * RequiredRole: MANAGERS
	 * @section trip
	 * @type put
	 * @url /v2/trips/cancel/:tripId
	 * 
	*/
  app.route('/v2/trips/cancel/:tripId')
    .put(authController.verifyUser(['MANAGERS']), trips.cancel_a_trip)
  
  /**
	 * Pay a specific trip of an actor
	 * RequiredRole: NONE
	 * @section trip
	 * @type put
	 * @url /v1/trips/pay/:tripId/:actorId
	 * 
	*/
  app.route('/v1/trips/pay/:tripId/:actorId')
    .put(trips.pay_a_trip)

  /**
	 * Pay a specific trip of an actor
	 * RequiredRole: EXPLORERS
	 * @section trip
	 * @type put
	 * @url /v2/trips/pay/:tripId/:actorId
	 * 
	*/
  app.route('/v2/trips/pay/:tripId/:actorId')
    .put(authController.verifyUser(['EXPLORERS']),trips.pay_a_trip)
};