'use strict';
module.exports = function(app) {
  var applications = require('../controllers/applicationController');
  var authController = require('../controllers/authController');

  /**
   * Manage catalogue of applications: 
   * Post applications
   *    RequiredRoles: Administrator
   * Get applications 
   *    RequiredRoles: Administrator
   *
   * @section applications
   * @type put 
   * @url /v1/applications
  */
  app.route('/v1/applications')
		.get(applications.list_all_applications)
    .post(applications.create_an_application)
    .delete(applications.delete_all_applications);

  /**
   * Manage catalogue of a specific application: 
   * Put application
   *    RequiredRoles: Administrator
   * Get application
   *    RequiredRoles: Administrator
   * Delete application
   *    RequiredRoles: Administrator
   *
   * @section applications
   * @type put 
   * @url /v1/applications/:applicationId
  */
  app.route('/v1/applications/:applicationId')
    .get(applications.get_application)
    .put(applications.update_application)
    .delete(applications.delete_application);
  
  app.route('/v1/trips/apply/:tripId')    
    .post(applications.apply_valid_trip)

  app.route('/v1/applications/cancel/:applicationId')    
    .put(applications.cancel_application)    
  
  app.route('/v2/applications')
    .get(authController.verifyUser(['ADMINISTRATORS','MANAGERS','EXPLORERS']),applications.list_all_applications_verified_user)
    .post(authController.verifyUser(['ADMINISTRATORS', 'MANAGERS', 'EXPLORERS', 'SPONSORS']),applications.create_an_application)
    .delete(authController.verifyUser(['ADMINISTRATORS']),applications.delete_all_applications);

  app.route('/v2/applications/:applicationId')
    .get(authController.verifyUser(['ADMINISTRATORS', 'MANAGERS', 'EXPLORERS', 'SPONSORS']),applications.get_application_verified_user)
    .put(authController.verifyUser(['ADMINISTRATORS', 'MANAGERS', 'EXPLORERS', 'SPONSORS']),applications.update_application_verified_user)
    .delete(authController.verifyUser(['ADMINISTRATORS', 'MANAGERS', 'EXPLORERS', 'SPONSORS']),applications.delete_application_verified_user);

};
