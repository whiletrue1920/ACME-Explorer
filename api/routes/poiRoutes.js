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

}