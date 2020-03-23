var mongoose = require('mongoose');

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect
const app = require("../app.js");
const sinon = require("sinon");

const tripController = require('../api/controllers/applicationController.js');

chai.use(chaiHttp);

describe("APPLICATIONS: GET methods", () => {

    let sandbox;
    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('GET /applications 200 OK', (done) => {

        let applications = [
        {
            "status": [
                "ACCEPTED"
            ],
            "_id": "5e77542faa30356c431517a8",
            "actorId": "5e63c941aa30356c4392188b",
            "tripId": "5e65633baa30356c43cee9b4",
            "comment": "censpmooesjuclygtwolrtrnvursvykclpedtycyibdsejprqvqdvhlgciht",
            "created": "2020-05-29T10:22:54.000Z"
        },
        {
            "status": [
                "DUE"
            ],
            "_id": "5e77542faa30356c431517a9",
            "actorId": "5e63c941aa30356c43921896",
            "tripId": "5e65633baa30356c43cee9b4",
            "comment": "lyqmgregtchljggwjplldhaoaehdgqussmuajhkuppxxirbvfsccnbqxwfwt",
            "created": "2019-11-23T08:44:03.000Z"
        }]

        sandbox.mock(mongoose.Model).expects('find').withArgs().yields(null, applications);

        chai
            .request(app)
            .get('/v1/applications')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.length).eql(2);
                done();
            });
    });

    it('GET /applications 500 Internal Server Error', (done) => {

        sandbox.mock(mongoose.Model).expects('find').withArgs().yields(new Error(), null);

        chai
            .request(app)
            .get('/v1/applications')
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('GET /applications/{applicationId} 200 OK', done => {

        let application = {
            "status": [
                "ACCEPTED"
            ],
            "_id": "5e77542faa30356c431517a8",
            "actorId": "5e63c941aa30356c4392188b",
            "tripId": "5e65633baa30356c43cee9b4",
            "comment": "censpmooesjuclygtwolrtrnvursvykclpedtycyibdsejprqvqdvhlgciht",
            "created": "2020-05-29T10:22:54.000Z"
        }

        sandbox.mock(mongoose.Model).expects('findById').withArgs('5e77542faa30356c431517a8').yields(null, application);

        chai
            .request(app)
            .get('/v1/applications/5e77542faa30356c431517a8')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('actorId');
                expect(res.body.actorId).to.equal("5e63c941aa30356c4392188b");
                expect(res.body.tripId).to.equal("5e65633baa30356c43cee9b4");
                expect(res.body.comment).to.equal("censpmooesjuclygtwolrtrnvursvykclpedtycyibdsejprqvqdvhlgciht");
                expect(res.body.created).to.equal("2020-05-29T10:22:54.000Z");
                done();
            });
    });

    it('GET /applications/{applicationId} 500 Internal Server Error', (done) => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('5e77542faa30356c431517a8').yields(new Error(), null);

        chai
            .request(app)
            .get('/v1/applications/5e77542faa30356c431517a8')
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

})

describe("APPLICATIONS: POST methods", () => {

    let sandbox;
    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    let application = {
        "status": [
            "ACCEPTED"
        ],
        "_id": "5e77542faa30356c431517a8",
        "actorId": "5e63c941aa30356c4392188b",
        "tripId": "5e65633baa30356c43cee9b4",
        "comment": "censpmooesjuclygtwolrtrnvursvykclpedtycyibdsejprqvqdvhlgciht",
        "created": "2020-05-29T10:22:54.000Z"
    }

    it('POST /applications 200 OK', (done) => {

        sandbox.mock(mongoose.Model.prototype).expects('save').yields(null, application);

        chai
            .request(app)
            .post('/v1/applications')
            .send(application)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.actorId).to.equal("5e63c941aa30356c4392188b");
                expect(res.body.tripId).to.equal("5e65633baa30356c43cee9b4");
                expect(res.body.comment).to.equal("censpmooesjuclygtwolrtrnvursvykclpedtycyibdsejprqvqdvhlgciht");
                expect(res.body.created).to.equal("2020-05-29T10:22:54.000Z");
                done();
            });
    });

    it('POST /applications 500 Internal Server Error', (done) => {

        sandbox.mock(mongoose.Model.prototype).expects('save').yields(new Error(), null);

        chai
            .request(app)
            .post('/v1/applications')
            .send(application)
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

})
