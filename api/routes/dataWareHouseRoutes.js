'use strict';
module.exports = function(app) {
  var dataWareHouse = require('../controllers/dataWareHouseController');
  var authController = require('../controllers/authController');

  	/**
	 * Get a list of all indicators or post a new computation period for rebuilding
	 * RequiredRole: NONE
	 * @section dataWareHouse
	 * @type get post
	 * @url /v1/dataWareHouse
	 * @param [string] rebuildPeriod
	 * 
	*/
	app.route('/v1/dataWareHouse')
	.get(dataWareHouse.list_all_indicators)
	.post(dataWareHouse.rebuildPeriod);

	app.route('/v1/cube/:explorer/:period')
		.get(dataWareHouse.cube);

	/**
	 * Get a list of all indicators or post a new computation period for rebuilding
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type get post
	 * @url /v2/dataWareHouse
	 * @param [string] rebuildPeriod
	 * 
	*/
	app.route('/v2/dataWareHouse')
	.get(authController.verifyUser(['ADMINISTRATORS']),dataWareHouse.list_all_indicators)
	.post(authController.verifyUser(['ADMINISTRATORS']),dataWareHouse.rebuildPeriod);

	/**
	 * Get a list of last computed indicator
	 * RequiredRole: NONE
	 * @section dataWareHouse
	 * @type get
	 * @url /dataWareHouse/latest
	 * 
	*/
	app.route('/v1/dataWareHouse/latest')
	.get(dataWareHouse.last_indicator);

	/**
	 * Get a list of last computed indicator
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type get
	 * @url /v2/dataWareHouse/latest
	 * 
	*/
	app.route('/v2/dataWareHouse/latest')
	.get(authController.verifyUser(['ADMINISTRATORS']),dataWareHouse.last_indicator);
};