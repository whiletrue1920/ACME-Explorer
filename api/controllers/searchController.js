'use strict';

/*---------------SEARCH----------------------*/

exports.get_search_by_user = function(req, res) {
  var query = {};

  var skip=0;

  console.log("Query: "+query);

  Order.find(query)
       .lean()
       .exec(function(err, order){
    console.log('Start searching trips');
    if (err){
      res.send(err);
    }
    else{
      res.json(order);
    }
    console.log('End searching orders');
  });

};

exports.post_search_by_user = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_search = new Search(req.body);
  new_search.save(function(err, search) {
    if (err){
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      res.json(search);
    }
  });
};


exports.delete_search_by_user = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  Search.deleteMany({_id: req.params.searchId}, function(err, search) {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.json({ message: 'Application successfully deleted' });
        }
    });
};