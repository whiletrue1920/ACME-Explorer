'use strict';
module.exports = function(app) {
  var searches = require('../controllers/searchController');

  app.route('/v1/searches/:actorId')
	  .get(searches.get_search_by_user)
    .post(searches.post_search_by_user)
    .delete(searches.delete_search_by_user);
      
};