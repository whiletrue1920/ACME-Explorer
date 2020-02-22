'use strict';
/*---------------TRIP----------------------*/

//MONGOOSE ERROR RESPONSES
const VALIDATION_ERROR='ValidationError';
const CAST_ERROR='CastError';
const OBJECT_ID_ERROR='ObjectId';
const NOT_FOUND='NotFound';
const STRICT_MODE_ERROR='StrictModeError';
const UPDATE_NOT_ALLOWED='UpdateNotAllowed';
const DELETE_NOT_ALLOWED='DeleteNotAllowed';
 
//RESPONSE_STATUS_CODE
const CREATED=201;
const NO_CONTENT=204;
const STATUS_CODE_NOT_FOUND=404;  
const STATUS_CODE_BAD_REQUEST=400;  
const STATUS_CODE_VALIDATION_ERROR=422;  
const STATUS_CODE_INTERNAL_SERVER_ERROR=500;

/*---------------GET----------------------*/
var mongoose = require('mongoose'),
 Trip = mongoose.model('Trips');

exports.list_all_trips = function(req, res) {
    console.log(Date(), ` -GET /trips`)
    Trip.find({}, function(err, trips){
        if(err){
            console.error(Date(), ` ERROR: - GET /trips , Some error ocurred while retrieving trips: ${err.message}`);
            return processErrors(req, res, err);
        }else{
            console.log(Date(), ` SUCCESS: -GET /trips`);
            res.json(trips);
        }
    });
};

exports.read_a_trip = function (req, res) {
    console.log(Date(), ` -GET /trips/${req.params.tripId}`)
    Trip.findById(req.params.tripId, function(err, trip){
        if(err){
            console.error(Date(), ` ERROR: - GET /trips/${req.params.tripId} , Some error ocurred while retrieving a trip : ${err.message}`);
            return processErrors(req, res, err);
        }else{
            if(!trip){
                console.error(Date(), ` ERROR: - GET /trips/${req.params.tripId} , Not found trip with id : ${req.params.tripId}`);
                return processErrors(req, res, {name: NOT_FOUND})
            }
            console.log(Date(), ` SUCCESS: -GET /trips/${req.params.tripId}`);
            res.json(trip);
        }
    });
};

/*---------------POST----------------------*/

exports.create_a_trip = function (req, res) {
    console.log(Date(), ` -POST /trips`);
    var new_trip;
    try{
        new_trip = new Trip(req.body);
    }catch(err){
        console.error(Date(), ` ERROR: - POST /trips , Some error ocurred while saving a trip: ${err.message}`);
        return processErrors(req, res, err);
    }
    new_trip.save(function(err, trip) {
        if(err){
            console.error(Date(), ` ERROR: - POST /trips , Some error ocurred while saving a trip: ${err.message}`);
            return processErrors(req, res, err);
        }else{
            console.log(Date(), ` SUCCESS: -POST /trips`);
            res.status(CREATED).json(trip);
        }
    });
};

/*---------------PUT----------------------*/

exports.update_a_trip = async function(req, res) {
    console.log(Date(), ` -PUT /trips/${req.params.tripId}`)
    var tripPublish;
    
    try{
        tripPublish = await isPublish(req.params.tripId);
        if(tripPublish==null){
            return processErrors(req, res, {name: NOT_FOUND});
        }
    }catch(err){
        return processErrors(req, res, err);
    }

    //Un viaje puede ser actualizado siempre que no esté publicado
    if(tripPublish.publish){
        console.error(Date(), ` ERROR: - PUT /trips/${req.params.tripId} , The trip is publish can not update`);
        return processErrors(req, res, {
            name: UPDATE_NOT_ALLOWED,
            message: 'Update is not allowed because the trip is publish'});
    }else{
        Trip.findOneAndUpdate({_id: req.params.tripId}, req.body, {new: true}, function(err, trip) {
            if(err){
                console.error(Date(), ` ERROR: - PUT /trips/${req.params.tripId} , Some error ocurred while updating a trip : ${err.message}`);
                return processErrors(req, res, err);
            }else{
                if(!trip){
                    console.error(Date(), ` ERROR: - PUT /trips/${req.params.tripId} , Not found trip with id : ${req.params.tripId}`);
                    return processErrors(req, res, {name: NOT_FOUND});
                }
                console.log(Date(), ` SUCCESS: -PUT /trips/${req.params.tripId}`);
                res.json(trip);
            }
        });
    }
};

/*---------------DELETE----------------------*/

exports.delete_a_trip = async function(req, res) {
    console.log(Date(), ` -DELETE /trips/${req.params.tripId}`)
    var tripPublish;
     //Un viaje puede ser eliminado siempre que no esté publicado

    try{
        tripPublish = await isPublish(req.params.tripId);
        if(tripPublish==null){
            return processErrors(req, res, {name: NOT_FOUND});
        }
    }catch(err){
        return processErrors(req, res, err);
    }

    if(tripPublish.publish){
        console.error(Date(), ` ERROR: - DELETE /trips/${req.params.tripId} , The trip is publish can not delete`);
        return processErrors(req, res, {
            name: DELETE_NOT_ALLOWED,
            message: 'Delete is not allowed because the trip is publish'});
    }else{
        Trip.findByIdAndRemove(req.params.tripId, function(err, trip) {
            if(err){
                console.error(Date(), ` DELETE: - DELETE /trips/${req.params.tripId} , Some error ocurred while deleting a trip : ${err.message}`);
                return processErrors(req, res, err);
            }else{
                if(!trip){
                    console.error(Date(), ` ERROR: - DELETE /trips/${req.params.tripId} , Not found trip with id : ${req.params.tripId}`);
                    return processErrors(req, res, {name: NOT_FOUND});
                }
                console.log(Date(), ` SUCCESS: -DELETE /trips/${req.params.tripId}`);
                res.status(NO_CONTENT).json({ message: 'Trip successfully deleted' });
            }
        });
    }
};

function isPublish(tripId){
    return Trip.findById(tripId, function(err, trip) {
        if(err){
            console.error(Date(), ` ERROR: isPublish tripId?: ${tripId}, Some error ocurred: ${err.message}`);
            return err;
        }else{
            if(!trip){
                console.error(Date(), ` ERROR: isPublish tripId?: ${tripId}, Not found trip`);
            }else{
                console.log(Date(), ` isPublish tripId?: ${tripId}, ${trip.publish}`);
            }
            return trip;
        }
    });
}

function processErrors (req, res, err) {
    switch(err.name){
        case VALIDATION_ERROR:
            return res.status(STATUS_CODE_VALIDATION_ERROR).send(err);
        case CAST_ERROR:
            return res.status(STATUS_CODE_BAD_REQUEST).send(err);
        case OBJECT_ID_ERROR:
            return res.status(STATUS_CODE_NOT_FOUND).send(err);
        case NOT_FOUND:
            return res.status(STATUS_CODE_NOT_FOUND).send({message: `Not found trip with id : ${req.params.tripId}`});
        case STRICT_MODE_ERROR:
            return res.status(STATUS_CODE_VALIDATION_ERROR).send(err);
        case UPDATE_NOT_ALLOWED:
            return res.status(STATUS_CODE_BAD_REQUEST).send(err);
        case DELETE_NOT_ALLOWED:
            return res.status(STATUS_CODE_BAD_REQUEST).send(err);
        default:
            return res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
    }
}