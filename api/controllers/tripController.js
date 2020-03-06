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
const CANCEL_NOT_ALLOWED='CancelNotAllowed';
 
//RESPONSE_STATUS_CODE
const CREATED=201;
const NO_CONTENT=204;
const STATUS_CODE_NOT_FOUND=404;  
const STATUS_CODE_BAD_REQUEST=400;  
const STATUS_CODE_VALIDATION_ERROR=422;  
const STATUS_CODE_INTERNAL_SERVER_ERROR=500;

/*---------------GET----------------------*/
var mongoose = require('mongoose'),
 Trip = mongoose.model('Trips'),
 Application = mongoose.model('Applications');

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

    //Un viaje puede ser actualizado siempre que no esté publicado
    console.log(Date(), ` -PUT /trips/${req.params.tripId}`)

    try{
        var publicado = await isPublish(req.params.tripId);
        if(publicado){
            console.error(Date(), ` ERROR: - PUT /trips/${req.params.tripId} , The trip is publish can not update`);
            var err = {name: UPDATE_NOT_ALLOWED, message: 'Update is not allowed because the trip is publish'};
            throw err;
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
    }catch(err){
        return processErrors(req, res, err);
    }

    
};

//TODO: Publicar viaje
exports.publish_a_trip = function (req, res) {
    console.log(Date(), ` -PUT /trips/publish/${req.params.tripId}`);
    res.json({});
};

//Cancelar un viaje publicado, que no esté empezado ni tenga solicitudes aceptadas
exports.cancel_a_trip = async function (req, res) {
    console.log(Date(), ` -PUT /trips/cancel/${req.params.tripId}`);

    //1. Recuperamos el viaje
    var trip = await Trip.findById(req.params.tripId, function(err, trip){
        if(err){
            console.error(Date(), ` ERROR: - PUT /trips/cancel/${req.params.tripId} , Some error ocurred while retrieving a trip : ${err.message}`);
            return processErrors(req, res, err);
        }else{
            return trip;
        }
    });

    if(!trip){
        console.error(Date(), ` ERROR: - PUT /trips/cancel/${req.params.tripId} , Not found trip with id : ${req.params.tripId}`);
        return processErrors(req, res, {name: NOT_FOUND})
    }

    //2. Comprobamos que el viaje esté publicado
    if(!trip.publish){
        console.error(Date(), ` ERROR: - PUT /trips/cancel/${req.params.tripId} , The trip is not publish, can not cancel: ${req.params.tripId}`);
        return processErrors(req, res, {name: CANCEL_NOT_ALLOWED, message: 'Cancel is not allowed because the trip is not publish, try to update it'})
    }

    //3. Comprobamos la fecha de realización
    if(trip.date_start <= new Date()){
        console.error(Date(), ` ERROR: - PUT /trips/cancel/${req.params.tripId} , The trip date_start is over, can not cancel: ${req.params.tripId}`);
        return processErrors(req, res, {name: CANCEL_NOT_ALLOWED, message: 'Cancel is not allowed because the trip date_start is over'})
    }

    //4. Recuperamos las solicitudes aceptadas del viaje
    var applications_accepted_by_tripId = await Application.aggregate([
        { $match: { 
            $and: [
                {tripId:{$eq:trip._id}},
                {status: {$eq:"ACCEPTED"}}]
        }},
        { $group: {_id:"$tripId"}}
        ]).exec();
    
    //5. Comprobamos si el viaje tiene solicitudes aceptadas
    if(applications_accepted_by_tripId.length>0){
        console.error(Date(), ` ERROR: - PUT /trips/cancel/${req.params.tripId} , The trip has accepted applications, can not cancel: ${req.params.tripId}`);
        return processErrors(req, res, {name: CANCEL_NOT_ALLOWED, message: 'Cancel is not allowed because the trip has accepted applications'})
    }

    //6. Actualizamos el viaje canceled = true
    trip.canceled=true;
    Trip.findOneAndUpdate({_id: trip._id}, trip, {new: true}, function(err, tripUpdate) {
        if(err){
            console.error(Date(), ` ERROR: - PUT /trips/cancel/${trip._id} , Some error ocurred while updating a trip : ${err.message}`);
            return processErrors(req, res, err);
        }else{
            if(!trip){
                console.error(Date(), ` ERROR: - PUT /trips/cancel/${trip._id} , Not found trip with id : ${req.params.tripId}`);
                return processErrors(req, res, {name: NOT_FOUND});
            }
            console.log(Date(), ` SUCCESS: -PUT /trips/cancel/${trip._id}`);
            res.json(tripUpdate);
        }
    });
};

/*---------------DELETE----------------------*/

exports.delete_a_trip = async function(req, res) {
    
     //Un viaje puede ser eliminado siempre que no esté publicado
     console.log(Date(), ` -DELETE /trips/${req.params.tripId}`)

     try{
        var publicado = await isPublish(req.params.tripId);
        if(publicado){
            console.error(Date(), ` ERROR: - DELETE /trips/${req.params.tripId} , The trip is publish can not delete`);
            var err = {name: DELETE_NOT_ALLOWED, message: 'Delete is not allowed because the trip is publish'};
            throw err;
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
     }catch(err){
        return processErrors(req, res, err);
     }
};

//Función que devuelve si un viaje está publicado o no
function isPublish(tripId){
    return Trip.findById(tripId).then((trip) => {
        if(!trip){
            console.error(Date(), ` ERROR: isPublish tripId?: ${tripId}, Not found trip`);
            var err = {name: NOT_FOUND};
            throw err;
        }else{
            console.log(Date(), ` isPublish tripId?: ${tripId}, ${trip.publish}`);
            return trip.publish;
        }
    });
}

//Búsqueda de los Trips publicados que no han comenzado y no estén aceptados por alguna aplicación.
async function search_trips_publish_not_started_and_not_accepted(){
    console.log(Date(), ` search_trips_publish_not_started_and_not_accepted`);
    
    var applications_accepted_by_tripId = await Application.aggregate(
        [
            {$match:{status: {$eq:"ACCEPTED"}}},
            {$group:{_id:"$tripId"}}
        ]).toArray().exec();

    var trips = await Trip.aggregate([
        {$match:{_id:{$nin:applications_accepted_by_tripId},publish:false}},
        {$project: {date_start: {$dateFromString: {dateString: '$date_start'}}}},
        {$match: {date_start: {$gt: new Date()}}}
        ]).exec();

    return trips;
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
        case CANCEL_NOT_ALLOWED:
                return res.status(STATUS_CODE_BAD_REQUEST).send(err);
        default:
            return res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
    }
}