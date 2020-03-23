var mongoose = require('mongoose');

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect
const app = require("../app.js");
const sinon = require("sinon");

const poiController = require('../api/controllers/poiController.js');

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
                "title": "Aquario",
                "description": "Visita Aquario",
                "coordinates": 
                    {
                        "type" : "Point",
                        "coordinates" : [
                            -122.5,
                            37.7
                                        ]
            },
                "type": "Ocio"
            },
            {
                "title": "Bar AAA",
                "description": "AAA",
                "coordinates": 
                    {
                        "type" : "Point",
                        "coordinates" : [
                            -124.5,
                            37.7
                                        ]
            },
                "type": "Ocio"
            }]

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

    it('GET /pois 500 Internal Server Error', (done) => {

        sandbox.mock(mongoose.Model).expects('find').withArgs().yields(new Error(), null);

        chai
            .request(app)
            .get('/v1/pois')
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('GET /pois/{poiId} 200 OK', done => {

        let poi = {
            "_id": "5e78f6c747379b28ea8359a3",
            "title": "Aquario",
            "description": "Visita Aquario",
            "coordinates": {
                "coordinates": [
                    -122.5,
                    37.7
                ],
                "_id": "5e78f6c747379b28ea8359a4",
                "type": "Point"
            },
            "type": "Ocio"
        }
        sandbox.mock(mongoose.Model).expects('findById').withArgs('5e78f6c747379b28ea8359a3').yields(null, poi);

        chai
            .request(app)
            .get('/v1/applications/5e78f6c747379b28ea8359a3')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('title');
                expect(res.body.title).to.equal("Aquario");
                expect(res.body.type).to.equal("Ocio");
                done();
            });
    });

    it('GET /pois/{poiId} 500 Internal Server Error', (done) => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('5e78f6c747379b28ea8359a3').yields(new Error(), null);

        chai
            .request(app)
            .get('/v1/pois/5e78f6c747379b28ea8359a3')
            .end((err, res) => {
                expect(res).to.have.status(500);
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
        "_id": "5e78f6c747379b28ea8359a3",
        "title": "Aquario",
        "description": "Visita Aquario",
        "coordinates": {
            "coordinates": [
                -122.5,
                37.7
            ],
            "type": "Point"
        },
        "type": "Ocio"
    }

    it('POST /pois 200 OK', (done) => {

        sandbox.mock(mongoose.Model.prototype).expects('save').yields(null, poi);

        chai
            .request(app)
            .post('/v1/pois')
            .send(poi)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.type).to.equal("Ocio");
                expect(res.body.title).to.equal("Aquario");
                done();
            });
    });

    it('POST /pois 500 Internal Server Error', (done) => {

        sandbox.mock(mongoose.Model.prototype).expects('save').yields(new Error(), null);

        chai
            .request(app)
            .post('/v1/pois')
            .send(poi)
            .end((err, res) => {
                expect(res).to.have.status(500);
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
        "_id": "5e78f6c747379b28ea8359a3",
        "title": "Aquario",
        "description": "Visita Aquario",
        "coordinates": {
            "coordinates": [
                -122.5,
                37.7
            ],
            "_id": "5e78f6c747379b28ea8359a4",
            "type": "Point"
        },
        "type": "Ocio"
    }

    it('DELETE /pois/{poiId} 200 Deleted', done => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('5e78f6c747379b28ea8359a3').resolves(poi)
        sandbox.mock(mongoose.Model).expects('findByIdAndRemove').withArgs('5e78f6c747379b28ea8359a3').yields(null, poi);
        
        chai
            .request(app)
            .delete('/v1/pois/5e78f6c747379b28ea8359a3')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

})

describe("POIS: PUT methods", () => {

    let sandbox;
    let clock;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        clock = sinon.useFakeTimers(new Date(2021,1,1).getTime());
    });

    afterEach(function () {
        sandbox.restore();
        clock.restore()
    });

    let poi = {
        "_id": "5e78f6c747379b28ea8359a3",
        "title": "Aquario",
        "description": "Visita Aquario",
        "coordinates": {
            "coordinates": [
                -122.5,
                37.7
            ],
            "_id": "5e78f6c747379b28ea8359a4",
            "type": "Point"
        },
        "type": "Ocio"
    }

    it('PUT /pois/{poiId} 200 OK', done => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('5e78f6c747379b28ea8359a3').resolves(poi)
        sandbox.mock(mongoose.Model).expects('findOneAndUpdate').withArgs({_id: '5e78f6c747379b28ea8359a3'},poi).yields(new Error(), null);
        
        chai
            .request(app)
            .put('/v1/pois/5e78f6c747379b28ea8359a3')
            .send(poi)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.title).to.equal('Aquario');
                expect(res.body.description).to.equal('Visita Aquario');
                done();
            });
    });

})
