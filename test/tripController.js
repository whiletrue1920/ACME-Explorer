var mongoose = require('mongoose');

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect
const app = require("../app.js");
const sinon = require("sinon");

const tripController = require('../api/controllers/tripController.js');

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

    it('POST /trips 500 Internal Server Error', (done) => {

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

describe("TRIPS: DELETE methods", () => {

    let sandbox;
    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

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
        "publish": false,
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

    it('DELETE /trips/{tripId} 204 No Content', done => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('5e65633baa30356c43cee9b5').resolves(trip)
        sandbox.mock(mongoose.Model).expects('findByIdAndRemove').withArgs('5e65633baa30356c43cee9b5').yields(null, trip);
        
        chai
            .request(app)
            .delete('/v1/trips/5e65633baa30356c43cee9b5')
            .end((err, res) => {
                expect(res).to.have.status(204);
                done();
            });
    });

    it('DELETE /trips/{tripId} 404 Not Found', done => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('0005633baa00000c43cee9b5').resolves(trip)
        sandbox.mock(mongoose.Model).expects('findByIdAndRemove').withArgs('0005633baa00000c43cee9b5').yields(null, null);

        chai
            .request(app)
            .delete('/v1/trips/0005633baa00000c43cee9b5')
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('DELETE /trips/{tripId} 404 Not Found (fail in isPublish)', done => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('0005633baa00000c43cee9b5').resolves(null);

        chai
            .request(app)
            .delete('/v1/trips/0005633baa00000c43cee9b5')
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('DELETE /trips/{tripId} 500 Internal Server Error', (done) => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('0005633baa00000c43cee9b5').resolves(trip)
        sandbox.mock(mongoose.Model).expects('findByIdAndRemove').withArgs('0005633baa00000c43cee9b5').yields(new Error(), null);

        chai
            .request(app)
            .delete('/v1/trips/0005633baa00000c43cee9b5')
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('DELETE /trips/{tripId} 400 Bad Request isPublish', done => {

        trip.publish=true
        sandbox.mock(mongoose.Model).expects('findById').withArgs('0005633baa00000c43cee9b5').resolves(trip);

        chai
            .request(app)
            .delete('/v1/trips/0005633baa00000c43cee9b5')
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

})

describe("TRIPS: PUT methods", () => {

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
        "publish": false,
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

    let trip_publish = {
        "_id": "5e65633baa30356c43cee9b5",
        "ticker": "6137-PRGJ",
        "title": "My Title",
        "description": "My description",
        "requirements": "requirements",
        "date_start": "2020-01-29T17:08:51.000Z",
        "date_end": "2020-01-29T17:08:51.000Z",
        "canceled": false,
        "reason": "",
        "publish": true,
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

    it('PUT /trips/{tripId} 200 OK', done => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('5e65633baa30356c43cee9b5').resolves(trip)
        sandbox.mock(mongoose.Model).expects('findOneAndUpdate').withArgs({_id: '5e65633baa30356c43cee9b5'},trip,{new: true}).yields(null, trip);
        
        chai
            .request(app)
            .put('/v1/trips/5e65633baa30356c43cee9b5')
            .send(trip)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.title).to.equal('My Title');
                expect(res.body.description).to.equal('My description');
                expect(res.body.organizedBy).to.equal('5e5bf4011c9d440000ebdb6d');
                expect(res.body.stages[0].title).to.equal('first stage');
                done();
            });
    });

    it('PUT /trips/{tripId} 404 Not Found', done => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('0005633baa00000c43cee9b5').resolves(trip)
        sandbox.mock(mongoose.Model).expects('findOneAndUpdate').withArgs({_id: '0005633baa00000c43cee9b5'},trip,{new: true}).yields(null, null);

        chai
            .request(app)
            .put('/v1/trips/0005633baa00000c43cee9b5')
            .send(trip)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('PUT /trips/{tripId} 404 Not Found (fail in isPublish)', done => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('0005633baa00000c43cee9b5').resolves(null);

        chai
            .request(app)
            .put('/v1/trips/0005633baa00000c43cee9b5')
            .send(trip)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('PUT /trips/{tripId} 500 Internal Server Error', (done) => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('0005633baa00000c43cee9b5').resolves(trip)
        sandbox.mock(mongoose.Model).expects('findOneAndUpdate').withArgs({_id: '0005633baa00000c43cee9b5'},trip,{new: true}).yields(new Error(), null);

        chai
            .request(app)
            .put('/v1/trips/0005633baa00000c43cee9b5')
            .send(trip)
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('PUT /trips/{tripId} 400 Bad Request isPublish', done => {

        trip.publish=true
        sandbox.mock(mongoose.Model).expects('findById').withArgs('0005633baa00000c43cee9b5').resolves(trip);

        chai
            .request(app)
            .put('/v1/trips/0005633baa00000c43cee9b5')
            .send(trip)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('PUT /trips/publish/{tripId} 200 OK', done => {

        sandbox.mock(mongoose.Model).expects('findOneAndUpdate').withArgs(
            { $and: [
                {_id: '5e65633baa30356c43cee9b5'},
                {date_start: {$gt: new Date()} }
            ]},
            { $set: { publish: true}},
            {new: true}
        ).yields(null, trip_publish);
        
        chai
            .request(app)
            .put('/v1/trips/publish/5e65633baa30356c43cee9b5')
            .send(trip_publish)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.title).to.equal('My Title');
                expect(res.body.description).to.equal('My description');
                expect(res.body.organizedBy).to.equal('5e5bf4011c9d440000ebdb6d');
                expect(res.body.publish).to.equal(true);
                expect(res.body.stages[0].title).to.equal('first stage');
                done();
            });

    });

    it('PUT /trips/publish/{tripId} 404 Not Found', done => {

        sandbox.mock(mongoose.Model).expects('findOneAndUpdate').withArgs(
            { $and: [
                {_id: '5e65633baa30356c43cee9b5'},
                {date_start: {$gt: new Date()} }
            ]},
            { $set: { publish: true}},
            {new: true}
        ).yields(null, null);
        
        chai
            .request(app)
            .put('/v1/trips/publish/5e65633baa30356c43cee9b5')
            .send(trip)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('PUT /trips/publish/{tripId} 500 Internal Server Error', done => {

        sandbox.mock(mongoose.Model).expects('findOneAndUpdate').withArgs(
            { $and: [
                {_id: '5e65633baa30356c43cee9b5'},
                {date_start: {$gt: new Date()} }
            ]},
            { $set: { publish: true}},
            {new: true}
        ).yields(new Error(), null);
        
        chai
            .request(app)
            .put('/v1/trips/publish/5e65633baa30356c43cee9b5')
            .send(trip)
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('PUT /trips/pay/{tripId} 200 OK', done => {

        let application = {
            "_id":"5e67d11eaa30356c432e7a25",
            "actorId":"5e63c941aa30356c4392188b",
            "tripId":"5e65633baa30356c43cee9b3",
            "comment":"xujiriygubxbmszdvgmltdswthqisbwpidmgrfjqrxabjhduerhjvwcuvfij",
            "status":"CANCELLED",
            "created":"2019-06-13 10:04:40"
        }

        sandbox.mock(mongoose.Model).expects('findOneAndUpdate').withArgs(
            { $and: [
                {actorId: '5e63c941aa30356c4392188b'},
                {tripId: '5e65633baa30356c43cee9b3'},
                {status: 'DUE'} 
            ]}, 
            { $set: {
                status: 'ACCEPTED'
            }},
            {new: true}
        ).yields(null, application);
        
        chai
            .request(app)
            .put('/v1/trips/pay/5e65633baa30356c43cee9b3/5e63c941aa30356c4392188b')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });

    });

    it('PUT /trips/pay/{tripId} 404 Not Found', done => {

        sandbox.mock(mongoose.Model).expects('findOneAndUpdate').withArgs(
            { $and: [
                {actorId: '5e63c941aa30356c4392188b'},
                {tripId: '5e65633baa30356c43cee9b3'},
                {status: 'DUE'} 
            ]}, 
            { $set: {
                status: 'ACCEPTED'
            }},
            {new: true}
        ).yields(null, null);
        
        chai
            .request(app)
            .put('/v1/trips/pay/5e65633baa30356c43cee9b3/5e63c941aa30356c4392188b')
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('PUT /trips/pay/{tripId} 500 Internal Server Error', done => {

        sandbox.mock(mongoose.Model).expects('findOneAndUpdate').withArgs(
            { $and: [
                {actorId: '5e63c941aa30356c4392188b'},
                {tripId: '5e65633baa30356c43cee9b3'},
                {status: 'DUE'} 
            ]}, 
            { $set: {
                status: 'ACCEPTED'
            }},
            {new: true}
        ).yields(new Error(), null);
        
        chai
            .request(app)
            .put('/v1/trips/pay/5e65633baa30356c43cee9b3/5e63c941aa30356c4392188b')
            .send(trip)
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

})