'use strict';
module.exports = function(app) {
  var searches = require('../controllers/searchController');
  var dwh = require('../controllers/dataWareHouseController');

    /**
   * Search engine for trips
   * Get trips depending on params
   *    
   * @section orders
   * @type get
   * @url /v1/searches
   * @param {string} actorId 
   * @param {string} keyword
   * @param {string} date_max
   * @param {string} price_range
  */
 app.route('/v1/searches/trips')
 .get(searches.get_search_by_user);

 app.route('/v1/searches/10keyword')
 .get(searches.top10keyword);

 app.route('/v1/searches/avgrangeprices')
 .get(searches.pricerangesearches);

 app.route('/v2/searches/trips')
 .get(searches.get_search_by_user);
      
};