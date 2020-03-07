'use strict';

module.exports = function(app) {
  var actors = require('../controllers/actorController');

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
    .put(actors.unban_an_actor)
};