'use strict';
module.exports = function(app) {
  var searches = require('../controllers/searchController');

    /**
   * Search engine for trips
   * Get trips depending on params
   *    
   *
   * @section orders
   * @type get
   * @url /v1/orders/search
   * @param {string} clerkId //if it is null we will include the non assigned orders
   * @param {string} delivered (true|false)
   * @param {string} cancelled (true|false)
   * @param {string} sortedBy (total)
   * @param {string} reverse (true|false)
   * @param {string} startFrom
   * @param {string} pageSize
  */
 app.route('/v1/searches')
 .get(searches.get_search_by_user)
 .post(searches.post_search_by_user)
 .delete(searches.delete_search_by_user);
      
};