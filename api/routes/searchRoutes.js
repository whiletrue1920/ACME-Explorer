'use strict';
module.exports = function(app) {
  var searches = require('../controllers/searchController');

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
 app.route('/v1/searches')
 .get(searches.get_search_by_user)
      
};