var mongoose = require('mongoose');

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect
const app = require("../app.js");
const sinon = require("sinon");

chai.use(chaiHttp);

describe("POIS: GET methods", () => {

    let sandbox;
    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('GET /pois 200 OK', (done) => {

        let pois = [
            {
                "coordinates": [
                    -122.5,
                    37.7
                ],
                "_id": "5e78f600bf0a6a14ae5a92d9",
                "title": "My POI title 1 edited",
                "description": "My POI description 1 edited",
                "type": "restaurant",
                "__v": 0
            },
            {
                "coordinates": [
                    -122.5,
                    37.7
                ],
                "_id": "5e78f72f2ddae817077ee656",
                "title": "My POI title 2",
                "description": "My POI description 2",
                "type": "restaurant",
                "__v": 0
            }
        ]

        sandbox.mock(mongoose.Model).expects('find').withArgs().yields(null, pois);

        chai
            .request(app)
            .get('/v1/pois')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.length).eql(2);
                done();
            });
    });

    it('GET /pois/{poiId} 200 OK', done => {

        let poi = {
            "coordinates": [
                -122.5,
                37.7
            ],
            "_id": "5e78f600bf0a6a14ae5a92d9",
            "title": "My POI title 1 edited",
            "description": "My POI description 1 edited",
            "type": "restaurant",
            "__v": 0
        }

        sandbox.mock(mongoose.Model).expects('findById').withArgs('5e78f600bf0a6a14ae5a92d9').yields(null, poi);

        chai
            .request(app)
            .get('/v1/pois/5e78f600bf0a6a14ae5a92d9')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('coordinates');
                expect(res.body._id).to.equal("5e78f600bf0a6a14ae5a92d9");
                expect(res.body.title).to.equal("My POI title 1 edited");
                expect(res.body.description).to.equal("My POI description 1 edited");
                expect(res.body.type).to.equal("restaurant");
                done();
            });
    });
})

describe("POIS: POST methods", () => {

    let sandbox;
    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    let poi = {
        "coordinates": [
            -122.5,
            37.7
        ],
        "_id": "5e78f600bf0a6a14ae5a92d9",
        "title": "My POI title 1",
        "description": "My POI description 1",
        "type": "restaurant",
        "__v": 0
    }

    it('POST /pois 200 OK', (done) => {

        sandbox.mock(mongoose.Model.prototype).expects('save').yields(null, poi);

        chai
            .request(app)
            .post('/v1/pois')
            .send(poi)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.title).to.equal('My POI title 1');
                expect(res.body.description).to.equal('My POI description 1');
                expect(res.body.type).to.equal('restaurant');
                done();
            });
    });

})

describe("POIS: DELETE methods", () => {

    let sandbox;
    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    let poi = {
        "coordinates": [
            -122.5,
            37.7
        ],
        "_id": "5e78f600bf0a6a14ae5a92d9",
        "title": "My POI title 1",
        "description": "My POI description 1",
        "type": "restaurant",
        "__v": 0
    }

    it('DELETE /pois/{poId} 204 No Content', done => {

        sandbox.mock(mongoose.Model).expects('findByIdAndRemove').withArgs('5e78f600bf0a6a14ae5a92d9').yields(null, poi);
        
        chai
            .request(app)
            .delete('/v1/pois/5e78f600bf0a6a14ae5a92d9')
            .end((err, res) => {
                expect(res).to.have.status(204);
                done();
            });
    });

})

describe("POIS: PUT methods", () => {

    let sandbox;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    let poi = {
        "coordinates": [
            -122.5,
            37.7
        ],
        "_id": "5e78f600bf0a6a14ae5a92d9",
        "title": "My POI title 1 edited",
        "description": "My POI description 1 edited",
        "type": "restaurant",
        "__v": 0
    }

    it('PUT /pois/{poiId} 200 OK', done => {

        sandbox.mock(mongoose.Model).expects('findOneAndUpdate').withArgs({_id: '5e78f600bf0a6a14ae5a92d9'},poi,{new: true}).yields(null, poi);
        
        chai
            .request(app)
            .put('/v1/pois/5e78f600bf0a6a14ae5a92d9')
            .send(poi)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.title).to.equal('My POI title 1 edited');
                expect(res.body.description).to.equal('My POI description 1 edited');
                expect(res.body.type).to.equal('restaurant');
                expect(res.body.coordinates[0]).to.equal(-122.5);
                expect(res.body.coordinates[1]).to.equal(37.7);
                done();
            });
    });

})