const mongoose = require('mongoose');
const Trip = require('../api/models/tripModel.js');

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect
const app = require("../app.js");
const should = chai.should();

chai.use(chaiHttp);

describe("TRIPS: GET methods", () => {

    it('should return all the matches', (done) => {
        chai
            .request(app)
            .get('/v1/trips')
            .end((err, res) => {
                console.log(res)
                expect(res).to.have.status(200);
                expect(res.body.length).should.be.eql(0);
                done();
            });
    });

    it('should return one trip', done => {
        chai
            .request(app)
            .get('/v1/trips/5e65633baa30356c43cee9b5')
            .end((err, res) => {
                console.log(res)
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('ticker');
                expect(res.body.ticker).to.equal("0920-BFPQ");
                done();
            });
    });

})