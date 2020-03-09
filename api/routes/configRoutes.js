'use strict';
module.exports = function(app) {
  var configs = require('../controllers/configController');

  /**
   * Manage configs of API: 
   * Post configs
   *    RequiredRoles: Administrator
   * Get configs 
   *    RequiredRoles: Administrator
   * Put configs 
   *    RequiredRoles: Administrator
   * Delete configs 
   *    RequiredRoles: Administrator
   *
   * @section configs
   * @type put,get,post,delete 
   * @url /v1/configs
  */
  app.route('/v1/configs')
		.get(configs.get_configs)
    .post(configs.create_configs)
    .delete(configs.delete_config)
    .put(configs.edit_config);
  
  app.route('/v2/configs')
		.get(authController.verifyUser(['ADMINISTRATORS']),configs.get_configs)
    .post(authController.verifyUser(['ADMINISTRATORS']),configs.create_configs)
    .delete(authController.verifyUser(['ADMINISTRATORS']),configs.delete_config)
    .put(authController.verifyUser(['ADMINISTRATORS']),configs.edit_config);

};
