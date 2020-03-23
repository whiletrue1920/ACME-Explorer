'use strict';
module.exports = function(app) {
  var pois = require('../controllers/poiController');
  var authController = require('../controllers/authController');

  /**
   * Manage catalogue of pois: 
   * Post pois
   *    RequiredRoles: NONE
   * Get pois 
   *    RequiredRoles: NONE
   *
   * @section pois
   * @type get post 
   * @url /v1/pois
  */
  app.route('/v1/pois')
    .get(pois.list_all_pois)
    .post(pois.create_a_poi);

  /**
   * Manage catalogue of pois: 
   * Post pois
   *    RequiredRoles: ADMINISTRATORS
   * Get pois 
   *    RequiredRoles: 'ADMINISTRATORS', 'MANAGERS', 'EXPLORERS', 'SPONSORS'
   *
   * @section pois
   * @type get post 
   * @url /v2/pois
  */
 app.route('/v2/pois')
 .get(authController.verifyUser(['ADMINISTRATORS', 'MANAGERS', 'EXPLORERS', 'SPONSORS']), pois.list_all_pois)
 .post(authController.verifyUser(['ADMINISTRATORS']), pois.create_a_poi);

  /**
   * Manage catalogue of a specific poi: 
   * Put poi
   *    RequiredRoles: NONE
   * Get poi
   *    RequiredRoles: NONE
   * Delete poi
   *    RequiredRoles: NONE
   *
   * @section poi
   * @type get put delete 
   * @url /v1/pois/:poiId
  */
  app.route('/v1/pois/:poiId')
    .get(pois.read_a_poi)
	  .put(pois.update_a_poi)
    .delete(pois.delete_a_poi);

  /**
   * Manage catalogue of a specific poi: 
   * Put poi
   *    RequiredRoles: ADMINISTRATORS
   * Get poi
   *    RequiredRoles: NONE
   * Delete poi
   *    RequiredRoles: ADMINISTRATORS
   *
   * @section poi
   * @type get put delete 
   * @url /v2/pois/:poiId
  */
  app.route('/v2/pois/:poiId')
  .get(authController.verifyUser(['ADMINISTRATORS', 'MANAGERS', 'EXPLORERS', 'SPONSORS']),pois.read_a_poi)
  .put(authController.verifyUser(['ADMINISTRATORS']), pois.update_a_poi)
  .delete(authController.verifyUser(['ADMINISTRATORS']), pois.delete_a_poi);

  /**
   * Assign POI to Stages
   * Put poi
   *    RequiredRoles: NONE
   * @section poi
   * @type get put delete 
   * @url /v1/pois/:poiId
  */
 app.route('/v1/pois/assingStages/:poiId')
 .put(pois.assignStagesToPoi)


  /**
   * Assign POI to Stages
   * Put poi
   *    RequiredRoles: NONE
   * @section poi
   * @type get put delete 
   * @url /v1/pois/:poiId
  */
 app.route('/v2/pois/assingStages/:poiId')
 .put(authController.verifyUser(['MANAGERS']), pois.assignStagesToPoi)

}