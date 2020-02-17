'use strict';
module.exports = function(app) {
  var applications = require('../controllers/applicationController');

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
    .post(applications.create_an_application);

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
};
