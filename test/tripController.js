var mongoose = require('mongoose');

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect
const app = require("../app.js");
const sinon = require("sinon");

chai.use(chaiHttp);

describe("TRIPS: GET methods", () => {

    let sandbox;
    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('GET /trips 200 OK', (done) => {

        let trips = [{
            "_id": "5e65633baa30356c43cee9b5",
            "ticker": "6137-PRGJ",
            "title": "Spain",
            "description": "Route abaout Spain",
            "requirements": "requirements",
            "date_start": "2020-01-29T17:08:51.000Z",
            "date_end": "2020-02-15T17:08:51.000Z",
            "canceled": false,
            "reason": "",
            "full_price": 350,
            "organizedBy": "5e5bf4011c9d440000ebdb6d",
            "stages": [{
                "title": "Sevilla",
                "description": "Sevilla description",
                "price": 100
            },{
                "title": "Cádiz stage",
                "description": "Cádiz description",
                "price": 250
            }]
        },{
            "_id": "5e65633baa30356c43cee9b5",
            "ticker": "6137-PRGJ",
            "title": "My Title",
            "description": "My description",
            "requirements": "requirements",
            "date_start": "2020-01-29T17:08:51.000Z",
            "date_end": "2020-01-29T17:08:51.000Z",
            "canceled": false,
            "reason": "",
            "organizedBy": "5e5bf4011c9d440000ebdb6d",
            "stages": [{
                "title": "first stage",
                "description": "first stage description",
                "price": 100
            },{
                "title": "second stage",
                "description": "second stage description",
                "price": 250
            }]
        }]

        sandbox.mock(mongoose.Model).expects('find').withArgs().yields(null, trips);

        chai
            .request(app)
            .get('/v1/trips')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.length).eql(2);
                done();
            });
    });

    it('GET /trips 500 Internal Server Error', (done) => {

        sandbox.mock(mongoose.Model).expects('find').withArgs().yields(new Error(), null);

        chai
            .request(app)
            .get('/v1/trips')
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('GET /trips/{tripId} 200 OK', done => {

        let trip = {
            "_id": "5e65633baa30356c43cee9b5",
            "ticker": "6137-PRGJ",
            "title": "My Title",
            "description": "My description",
            "requirements": "requirements",
            "date_start": "2020-01-29T17:08:51.000Z",
            "date_end": "2020-01-29T17:08:51.000Z",
            "canceled": false,
            "reason": "",
            "organizedBy": "5e5bf4011c9d440000ebdb6d",
            "stages": [{
                "title": "first stage",
                "description": "first stage description",
                "price": 100
            },{
                "title": "second stage",
                "description": "second stage description",
                "price": 250
            }]
        }

        sandbox.mock(mongoose.Model).expects('findById').withArgs('5e65633baa30356c43cee9b5').yields(null, trip);

        chai
            .request(app)
            .get('/v1/trips/5e65633baa30356c43cee9b5')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('ticker');
                expect(res.body.ticker).to.equal("6137-PRGJ");
                expect(res.body.title).to.equal("My Title");
                expect(res.body.date_start).to.equal("2020-01-29T17:08:51.000Z");
                expect(res.body.organizedBy).to.equal("5e5bf4011c9d440000ebdb6d");
                done();
            });
    });

    it('GET /trips/{tripId} 404 Not Found', done => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('0005633baa00000c43cee9b5').yields(null, null);

        chai
            .request(app)
            .get('/v1/trips/0005633baa00000c43cee9b5')
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('GET /trips/{tripId} 500 Internal Server Error', (done) => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('0005633baa00000c43cee9b5').yields(new Error(), null);

        chai
            .request(app)
            .get('/v1/trips/0005633baa00000c43cee9b5')
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

})

describe("TRIPS: POST methods", () => {

    let sandbox;
    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    let trip = {
        "title": "My Title",
        "description": "My description",
        "requirements": "requirements",
        "date_start": "2020-01-29T17:08:51.000Z",
        "date_end": "2020-01-29T17:08:51.000Z",
        "canceled": false,
        "organizedBy": "5e5bf4011c9d440000ebdb6d",
        "stages": [{
            "title": "first stage",
            "description": "first stage description",
            "price": 100
        },{
            "title": "second stage",
            "description": "second stage description",
            "price": 250
        }]
    }

    it('POST /trips 200 OK', (done) => {

        sandbox.mock(mongoose.Model.prototype).expects('save').yields(null, trip);

        chai
            .request(app)
            .post('/v1/trips')
            .send(trip)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.title).to.equal('My Title');
                expect(res.body.description).to.equal('My description');
                expect(res.body.organizedBy).to.equal('5e5bf4011c9d440000ebdb6d');
                expect(res.body.stages[0].title).to.equal('first stage');
                done();
            });
    });

    it('POST /trips 200 OK', (done) => {

        sandbox.mock(mongoose.Model.prototype).expects('save').yields(new Error(), null);

        chai
            .request(app)
            .post('/v1/trips')
            .send(trip)
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

})