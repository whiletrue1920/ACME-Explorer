var mongoose = require('mongoose');

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect
const app = require("../app.js");
const sinon = require("sinon");

chai.use(chaiHttp);

describe("TRIPS: GET methods", () => {

   /* it('should return all trips', (done) => {

        sinon.mock(Trip).expects('find').withArgs('').yields(null, []);

        chai
            .request(app)
            .get('/v1/trips')
            .end((err, res) => {
                console.log(res)
                expect(res).to.have.status(200);
                expect(res.body.length).should.be.eql(0);
                done();
            });
    });*/

    it('200 OK: should return one trip', done => {

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

        sinon.mock(mongoose.Model).expects('findById').withArgs('5e65633baa30356c43cee9b5').yields(null, trip);

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

})

describe("TRIPS: POST methods", () => {

   /* it('should save a trip', (done) => {

        let trip = {
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

        chai
            .request(app)
            .post('/v1/trips')
            .send(trip)
            .end((err, res) => {
                console.log(res)
                expect(res).to.have.status(200);
                expect(res.body).should.be.a('object');
                expect(res.body.trip).should.have.property('title');
                expect(res.body.trip).should.have.property('ticker');
                expect(res.body.trip).should.have.property('description');
                done();
            });
    });*/

})