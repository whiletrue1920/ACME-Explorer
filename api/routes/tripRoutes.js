'use strict';
module.exports = function(app) {
  var trips = require('../controllers/tripController');

  app.route('/v1/trips')
    .get(trips.list_all_trips)
    .post(trips.create_a_trip);

  app.route('/v1/trips/:tripId')
    .get(trips.read_a_trip)
	  .put(trips.update_a_trip)
    .delete(trips.delete_a_trip);

  app.route('/v1/trips/search/:keyWord')
    //TODO: Buscar viajes usando una keyWord que contenga el ticker, title o description
    .get(trips.search_trips)

  app.route('/v1/trips/publish/:tripId')
    //TODO: Publicar viajes
    .post(trips.publish_a_trip)
    
  app.route('/v1/trips/cancel/:tripId')
    //TODO: Cancelar viajes que no hayan empezado y no tengan solicitudes aceptadas
    .post(trips.cancel_a_trip)

  app.route('/v1/trips/dashboard')
    //TODO: Dashboard con la media, mínimo, máximo y desviación estándar del precio de los viajes
    .get(trips.dashboard) 

    app.route('/v1/trips/sponsorships/random')
    //TODO: Mostar aleatoriamente un viaje que esté patrocinado
    .get(trips.random_sponsorships) 

};