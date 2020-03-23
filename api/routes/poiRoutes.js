'use strict';
module.exports = function(app) {
  var pois = require('../controllers/poiController');
  var authController = require('../controllers/authController');
   
  app.route('/v1/pois')
    .get(pois.get_pois)
    .post(pois.create_poi);

  app.route('/v1/pois/:poiId')
    .get(pois.get_poi)
    .put(pois.edit_poi)
    .delete(pois.delete_poi);
  
  app.route('/v2/pois')
  .get(authController.verifyUser(['ADMINISTRATORS', 'MANAGERS', 'EXPLORERS', 'SPONSORS']),pois.get_pois)
  .post(authController.verifyUser(['ADMINISTRATORS']),pois.create_poi);

  app.route('/v2/pois/:poiId')
	  .get(authController.verifyUser(['ADMINISTRATORS']),pois.get_poi)
    .delete(authController.verifyUser(['ADMINISTRATORS']),pois.edit_poi)
    .put(authController.verifyUser(['ADMINISTRATORS']),pois.delete_poi);    

  app.route('/v2/pois/assign/:poiId/trip/:tripId')
	  .put(authController.verifyUser(['MANAGERS']),pois.assig_poi_to_stage);    

};