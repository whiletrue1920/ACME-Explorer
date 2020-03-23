'use strict';

module.exports = function(app) {
  var actors = require('../controllers/actorController');
  var authController = require('../controllers/authController');

  app.route('/v1/actors')
	  .get(actors.list_all_actors)
	  .post(actors.create_an_actor);

  app.route('/v1/actors/:actorId')
    .get(actors.read_an_actor)
	  .put(actors.update_an_actor)
    .delete(actors.delete_an_actor);

  app.route('/v1/actors/:actorId/validate')
    .put(actors.validate_an_actor);

  app.route('/v1/actors/:actorId/ban')
    .put(actors.ban_an_actor);

  app.route('/v1/actors/:actorId/unban')
    .put(actors.unban_an_actor);

  /**
   * Put an actor
   *    RequiredRoles: to be the proper actor
   * Get an actor
   *    RequiredRoles: any
	 *
	 * @section actors
	 * @type get put
	 * @url /v1/actors/:actorId
  */  
  app.route('/v2/actors/:actorId')
    .get(actors.read_an_actor)
    .put(authController.verifyUser(['ADMINISTRATORS', 'MANAGERS', 'EXPLORERS', 'SPONSORS']),actors.update_a_verified_actor);

  app.route('/v2/actors/:actorId/ban')
    .put(authController.verifyUser(['ADMINISTRATORS']),actors.ban_an_actor);

  app.route('/v2/actors/:actorId/unban')
    .put(authController.verifyUser(['ADMINISTRATORS']),actors.unban_an_actor);    

};