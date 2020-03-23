'use strict';

//MONGOOSE ERROR RESPONSES
const VALIDATION_ERROR='ValidationError';
const CAST_ERROR='CastError';
const OBJECT_ID_ERROR='ObjectId';
const NOT_FOUND='NotFound';
const STRICT_MODE_ERROR='StrictModeError';
 
//RESPONSE_STATUS_CODE
const CREATED=201;
const NO_CONTENT=204;
const STATUS_CODE_NOT_FOUND=404;  
const STATUS_CODE_BAD_REQUEST=400;  
const STATUS_CODE_VALIDATION_ERROR=422;  
const STATUS_CODE_INTERNAL_SERVER_ERROR=500;

/*---------------GET----------------------*/
var mongoose = require('mongoose'),
 Poi = mongoose.model('Pois');

exports.list_all_pois = function(req, res) {
    console.log(Date(), ` -GET /pois`)
    Poi.find({}, function(err, pois){
        if(err){
            console.error(Date(), ` ERROR: - GET /pois , Some error occurred while retrieving pois: ${err.message}`);
            return processErrors(req, res, err);
        }else{
            console.log(Date(), ` SUCCESS: -GET /pois`);
            res.json(pois);
        }
    });
};

exports.read_a_poi = function (req, res) {
    console.log(Date(), ` -GET /pois/${req.params.poiId}`)
    Poi.findById(req.params.poiId, function(err, poi){
        if(err){
            console.error(Date(), ` ERROR: - GET /pois/${req.params.poiId} , Some error occurred while retrieving a poi : ${err.message}`);
            return processErrors(req, res, err);
        }else{
            if(!poi){
                console.error(Date(), ` ERROR: - GET /pois/${req.params.poiId} , Not found poi with id : ${req.params.poiId}`);
                return processErrors(req, res, {name: NOT_FOUND})
            }
            console.log(Date(), ` SUCCESS: -GET /pois/${req.params.poiId}`);
            res.json(poi);
        }
    });
};

exports.create_a_poi = function (req, res) {
    console.log(Date(), ` -POST /pois`);
    var new_poi;
    try{
        new_poi = new Poi(req.body);
    }catch(err){
        console.error(Date(), ` ERROR: - POST /pois , Some error occurred while saving a poi: ${err.message}`);
        return processErrors(req, res, err);
    }
    new_poi.save(function(err, poi) {
        if(err){
            console.error(Date(), ` ERROR: - POST /pois , Some error occurred while saving a poi: ${err.message}`);
            return processErrors(req, res, err);
        }else{
            console.log(Date(), ` SUCCESS: -POST /pois`);
            res.status(CREATED).json(poi);
        }
    });
};

exports.update_a_poi = async function(req, res) {

    console.log(Date(), ` -PUT /pois/${req.params.poiId}`)

    Poi.findOneAndUpdate({_id: req.params.poiId}, req.body, {new: true}, function(err, poi) {
        if(err){
            console.error(Date(), ` ERROR: - PUT /pois/${req.params.poiId} , Some error occurred while updating a poi : ${err.message}`);
            return processErrors(req, res, err);
        }else{
            if(!poi){
                console.error(Date(), ` ERROR: - PUT /pois/${req.params.poiId} , Not found poi with id : ${req.params.poiId}`);
                return processErrors(req, res, {name: NOT_FOUND});
            }
            console.log(Date(), ` SUCCESS: -PUT /pois/${req.params.poiId}`);
            res.json(poi);
        }
    });

};

exports.delete_a_poi = async function(req, res) {
    
    console.log(Date(), ` -DELETE /pois/${req.params.poiId}`)
    Poi.findByIdAndRemove(req.params.poiId, function(err, poi) {
        if(err){
            console.error(Date(), ` DELETE: - DELETE /pois/${req.params.poiId} , Some error occurred while deleting a poi : ${err.message}`);
            return processErrors(req, res, err);
        }else{
            if(!poi){
                console.error(Date(), ` ERROR: - DELETE /pois/${req.params.poiId} , Not found poi with id : ${req.params.poiId}`);
                return processErrors(req, res, {name: NOT_FOUND});
            }
            console.log(Date(), ` SUCCESS: -DELETE /pois/${req.params.poiId}`);
            res.status(NO_CONTENT).json({ message: 'Poi successfully deleted' });
        }
    });
};

function processErrors (req, res, err) {
    switch(err.name){
        case VALIDATION_ERROR:
            return res.status(STATUS_CODE_VALIDATION_ERROR).send(err);
        case CAST_ERROR:
            return res.status(STATUS_CODE_BAD_REQUEST).send(err);
        case OBJECT_ID_ERROR:
            return res.status(STATUS_CODE_NOT_FOUND).send(err);
        case NOT_FOUND:
            return res.status(STATUS_CODE_NOT_FOUND).send({message: `Not found poi with id : ${req.params.poiId}`});
        case STRICT_MODE_ERROR:
            return res.status(STATUS_CODE_VALIDATION_ERROR).send(err);
        default:
            return res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
    }
}