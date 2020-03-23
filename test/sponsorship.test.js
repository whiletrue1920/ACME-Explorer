var mongoose = require('mongoose');

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect;
const app = require("../app.js");
const sinon = require("sinon");

chai.use(chaiHttp);

describe("SPONSORSHIP: GET methods", () => {

    let sandbox;
    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('GET /sponsorships 200 OK', (done) => {

        let sponsorships = [
        {
            "_id": "5e752113aa30356c43d44f41",
            "actorId": "5e63c941aa30356c4392188f",
            "tripId":"5e65633baa30356c43cee9b3",
            "banner":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIsSURBVDjLpZNNSFRRGIafc2fGP3Iaw58SSVyYJRHGCJUVtGldJLZoUS3atIqkdYStwkWLWhjiJghCpIWRLSKMQENFC/uhhsixn0HLTFPn3uvc+30tprlOIVH0wuEsDuf53vc73zGqyv8oDHD6+tPzQC1wAIiDKopBFMsyWAZEBPFZiIT1bUNNtBlRLrRuN6gqp65NdOs/6krvK1XVrAPgIEDP0Hxg7U/BzuzfxOv3C24QAdHNucP6ykIAjFn/8ptZFwDbyRQEAFUtyVVNfHb/qnnq+2YNIBrOWVtPK19GWZweoGpXO6GCaNa0L+QDDEDbpYc4IojCvcuHmUotgjjou9vEqltITvZiVbdRV70RFR8AKwvI0ubsDHt2VDFve0H1yMIg0co40S278WYeIctT2QjeL4Bsz5ccn4wqaTcLUDvFyvQApeUx/O/9VDaeYDXZh4qHiLcGMD8duG4GO+PjOxlQJfOhn/L6I+BMMHrzFhtiNu6nERanh1FvNc9B3qvnJnt5ZoJCWaK0LI24U6CCvzxG3aF2Pj65QcSk1wDiSUC4P5QkbITUWA+xrU1IehIVm3hrA7KaoqgoQbRmL83FYxoAfJEkwPOuo7zoPsaDcyGKyuopKZ1Dva9gQozfSQCCOAkqttXSFBnRxx07G42qcvzi4FVV3aaq+xApO1vRScvJLkJWEvW+/TbYFqHiBmZfPiNxt6PPrPedhzvjc+pLiYqiInlLgx0RVHX8BxTzXjKQ0/OBAAAAAElFTkSuQmCC",
            "link":"https://jigsy.com/at/nulla.png?elementum=diam&eu=neque&interdum=vestibulum&eu=eget&tincidunt=vulputate&in=ut&leo=ultrices&maecenas=vel&pulvinar=augue&lobortis=vestibulum&est=ante&phasellus=ipsum&sit=primis&amet=in&erat=faucibus&nulla=orci&tempus=luctus&vivamus=et&in=ultrices&felis=posuere&eu=cubilia&sapien=curae&cursus=donec&vestibulum=pharetra&proin=magna&eu=vestibulum&mi=aliquet&nulla=ultrices&ac=erat&enim=tortor&in=sollicitudin&tempor=mi&turpis=sit&nec=amet&euismod=lobortis&scelerisque=sapien&quam=sapien&turpis=non&adipiscing=mi&lorem=integer&vitae=ac&mattis=neque",
            "payed":true
        },
        {
            "_id":"5e752113aa30356c43d44f42",
            "actorId":"5e63c941aa30356c43921890",
            "tripId":"5e65633baa30356c43cee9b4",
            "banner":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAImSURBVDjLpZPfa1JhGMcHXfZ/eBUVdNOVBqGDgwaSy1HLg6R5IUVyYCi5li6Wv+dRysAQoiG4ple1aMyRYj/wF8Ugl8PVTSCM0GI0K/DbeR9RJ4xi9MLnnPf9Pg+f877ncMYAjP0PdOGjVZtEWKIsAT5a6fKRCvhwGUbpfiVagVEsgQ+VWqZIseTPbMK/XMN+QRyHHN6lDyOCTbZ6WPg6IP4X2DAGXneGArHS7gty9V0iv3UwfcHknVx3IDCEy79YGP/Hk/fvQO9aHx7hcqjUPew7mLi1NhRMBYoU6mbXoJ5ZBedcpfX2l/aBUK/zxVBwyfeWwjPTzzGXfI/TwspAsNP6MUJfcN6+MhRc9Lyh8NT1p7j5qAjOKiIYDCKRSMDr86H8roatz034/QHKWG3qhgi5XH60t4P5VyQ4dnUZvHAXoiii2Wyi0Wggl8shtBDGvfsP8LFep6xQKFCPWq329XYwXyDB8QseCNN2VDc24PF4oNFoYDabEYlE4HA4aM4yVmMSQRDaJJh05+krnOCsmHXNkaDT6UA1Po5sNotqtYp8Po90Ok0ZqzGB2+3eI8HE7ZfbTJBKpWCz2UjgcrmgVCqhUqmg1WoJNmcZqzGBxWJp9QQz6ws6Z/aZ+trjb+d0BngDYSwmnyCTySAWi5HUbrfTnGWLyaWuLxD6LR2nNvJrymSyIwqF4iTHcZ9MJtOu1Wrdk/ip1+sNEmel+XeWsRrrYb1/AB4L/elcpleiAAAAAElFTkSuQmCC",
            "link":"http://amazon.co.uk/neque/vestibulum/eget/vulputate.aspx?ante=volutpat&nulla=eleifend&justo=donec&aliquam=ut&quis=dolor&turpis=morbi&eget=vel&elit=lectus&sodales=in&scelerisque=quam&mauris=fringilla&sit=rhoncus&amet=mauris&eros=enim&suspendisse=leo&accumsan=rhoncus&tortor=sed&quis=vestibulum&turpis=sit&sed=amet&ante=cursus&vivamus=id&tortor=turpis&duis=integer&mattis=aliquet&egestas=massa&metus=id&aenean=lobortis&fermentum=convallis&donec=tortor&ut=risus&mauris=dapibus&eget=augue&massa=vel&tempor=accumsan&convallis=tellus&nulla=nisi&neque=eu&libero=orci&convallis=mauris&eget=lacinia&eleifend=sapien&luctus=quis&ultricies=libero&eu=nullam&nibh=sit&quisque=amet&id=turpis&justo=elementum&sit=ligula&amet=vehicula&sapien=consequat&dignissim=morbi&vestibulum=a&vestibulum=ipsum&ante=integer&ipsum=a&primis=nibh&in=in&faucibus=quis&orci=justo&luctus=maecenas",
            "payed":true
        }]

        sandbox.mock(mongoose.Model).expects('find').withArgs().yields(null, sponsorships);

        chai
            .request(app)
            .get('/v1/sponsorships')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.length).eql(2);
                done();
            });
    });

    it('GET /sponsorships 500 Internal Server Error', (done) => {

        sandbox.mock(mongoose.Model).expects('find').withArgs().yields(new Error(), null);

        chai
            .request(app)
            .get('/v1/sponsorships')
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('GET /sponsorships/{sponsorshipId} 200 OK', done => {

        let sponsorship = {
            
            "_id":"5e752113aa30356c43d44f42",
            "actorId":"5e63c941aa30356c43921890",
            "tripId":"5e65633baa30356c43cee9b4",
            "banner":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAImSURBVDjLpZPfa1JhGMcHXfZ/eBUVdNOVBqGDgwaSy1HLg6R5IUVyYCi5li6Wv+dRysAQoiG4ple1aMyRYj/wF8Ugl8PVTSCM0GI0K/DbeR9RJ4xi9MLnnPf9Pg+f877ncMYAjP0PdOGjVZtEWKIsAT5a6fKRCvhwGUbpfiVagVEsgQ+VWqZIseTPbMK/XMN+QRyHHN6lDyOCTbZ6WPg6IP4X2DAGXneGArHS7gty9V0iv3UwfcHknVx3IDCEy79YGP/Hk/fvQO9aHx7hcqjUPew7mLi1NhRMBYoU6mbXoJ5ZBedcpfX2l/aBUK/zxVBwyfeWwjPTzzGXfI/TwspAsNP6MUJfcN6+MhRc9Lyh8NT1p7j5qAjOKiIYDCKRSMDr86H8roatz034/QHKWG3qhgi5XH60t4P5VyQ4dnUZvHAXoiii2Wyi0Wggl8shtBDGvfsP8LFep6xQKFCPWq329XYwXyDB8QseCNN2VDc24PF4oNFoYDabEYlE4HA4aM4yVmMSQRDaJJh05+krnOCsmHXNkaDT6UA1Po5sNotqtYp8Po90Ok0ZqzGB2+3eI8HE7ZfbTJBKpWCz2UjgcrmgVCqhUqmg1WoJNmcZqzGBxWJp9QQz6ws6Z/aZ+trjb+d0BngDYSwmnyCTySAWi5HUbrfTnGWLyaWuLxD6LR2nNvJrymSyIwqF4iTHcZ9MJtOu1Wrdk/ip1+sNEmel+XeWsRrrYb1/AB4L/elcpleiAAAAAElFTkSuQmCC",
            "link":"http://amazon.co.uk/neque/vestibulum/eget/vulputate.aspx?ante=volutpat&nulla=eleifend&justo=donec&aliquam=ut&quis=dolor&turpis=morbi&eget=vel&elit=lectus&sodales=in&scelerisque=quam&mauris=fringilla&sit=rhoncus&amet=mauris&eros=enim&suspendisse=leo&accumsan=rhoncus&tortor=sed&quis=vestibulum&turpis=sit&sed=amet&ante=cursus&vivamus=id&tortor=turpis&duis=integer&mattis=aliquet&egestas=massa&metus=id&aenean=lobortis&fermentum=convallis&donec=tortor&ut=risus&mauris=dapibus&eget=augue&massa=vel&tempor=accumsan&convallis=tellus&nulla=nisi&neque=eu&libero=orci&convallis=mauris&eget=lacinia&eleifend=sapien&luctus=quis&ultricies=libero&eu=nullam&nibh=sit&quisque=amet&id=turpis&justo=elementum&sit=ligula&amet=vehicula&sapien=consequat&dignissim=morbi&vestibulum=a&vestibulum=ipsum&ante=integer&ipsum=a&primis=nibh&in=in&faucibus=quis&orci=justo&luctus=maecenas",
            "payed":true
        }

        sandbox.mock(mongoose.Model).expects('findById').withArgs('5e752113aa30356c43d44f42').yields(null, sponsorship);

        chai
            .request(app)
            .get('/v1/sponsorships/5e752113aa30356c43d44f42')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('actorId');
                expect(res.body.actorId).to.equal("5e63c941aa30356c43921890");
                expect(res.body.tripId).to.equal("5e65633baa30356c43cee9b4");
                expect(res.body.banner).to.equal("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAImSURBVDjLpZPfa1JhGMcHXfZ/eBUVdNOVBqGDgwaSy1HLg6R5IUVyYCi5li6Wv+dRysAQoiG4ple1aMyRYj/wF8Ugl8PVTSCM0GI0K/DbeR9RJ4xi9MLnnPf9Pg+f877ncMYAjP0PdOGjVZtEWKIsAT5a6fKRCvhwGUbpfiVagVEsgQ+VWqZIseTPbMK/XMN+QRyHHN6lDyOCTbZ6WPg6IP4X2DAGXneGArHS7gty9V0iv3UwfcHknVx3IDCEy79YGP/Hk/fvQO9aHx7hcqjUPew7mLi1NhRMBYoU6mbXoJ5ZBedcpfX2l/aBUK/zxVBwyfeWwjPTzzGXfI/TwspAsNP6MUJfcN6+MhRc9Lyh8NT1p7j5qAjOKiIYDCKRSMDr86H8roatz034/QHKWG3qhgi5XH60t4P5VyQ4dnUZvHAXoiii2Wyi0Wggl8shtBDGvfsP8LFep6xQKFCPWq329XYwXyDB8QseCNN2VDc24PF4oNFoYDabEYlE4HA4aM4yVmMSQRDaJJh05+krnOCsmHXNkaDT6UA1Po5sNotqtYp8Po90Ok0ZqzGB2+3eI8HE7ZfbTJBKpWCz2UjgcrmgVCqhUqmg1WoJNmcZqzGBxWJp9QQz6ws6Z/aZ+trjb+d0BngDYSwmnyCTySAWi5HUbrfTnGWLyaWuLxD6LR2nNvJrymSyIwqF4iTHcZ9MJtOu1Wrdk/ip1+sNEmel+XeWsRrrYb1/AB4L/elcpleiAAAAAElFTkSuQmCC");
                expect(res.body.link).to.equal("http://amazon.co.uk/neque/vestibulum/eget/vulputate.aspx?ante=volutpat&nulla=eleifend&justo=donec&aliquam=ut&quis=dolor&turpis=morbi&eget=vel&elit=lectus&sodales=in&scelerisque=quam&mauris=fringilla&sit=rhoncus&amet=mauris&eros=enim&suspendisse=leo&accumsan=rhoncus&tortor=sed&quis=vestibulum&turpis=sit&sed=amet&ante=cursus&vivamus=id&tortor=turpis&duis=integer&mattis=aliquet&egestas=massa&metus=id&aenean=lobortis&fermentum=convallis&donec=tortor&ut=risus&mauris=dapibus&eget=augue&massa=vel&tempor=accumsan&convallis=tellus&nulla=nisi&neque=eu&libero=orci&convallis=mauris&eget=lacinia&eleifend=sapien&luctus=quis&ultricies=libero&eu=nullam&nibh=sit&quisque=amet&id=turpis&justo=elementum&sit=ligula&amet=vehicula&sapien=consequat&dignissim=morbi&vestibulum=a&vestibulum=ipsum&ante=integer&ipsum=a&primis=nibh&in=in&faucibus=quis&orci=justo&luctus=maecenas");
                expect(res.body.payed).to.equal(true);
                done();
            });
    });

    it('GET /sponsorships/{sponsorshipId} 500 Internal Server Error', (done) => {

        sandbox.mock(mongoose.Model).expects('findById').withArgs('5e752113aa30356c43d44f42').yields(new Error(), null);

        chai
            .request(app)
            .get('/v1/sponsorships/5e752113aa30356c43d44f42')
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

})

describe("SPONSORSHIPS: POST methods", () => {

    let sandbox;
    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    let sponsorship = {
        "_id":"5e752113aa30356c43d44456",
        "actorId":"5e63c941aa30356c43921890",
        "tripId":"5e65633baa30356c43cee9b4",
        "banner":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAImSURBVDjLpZPfa1JhGMcHXfZ/eBUVdNOVBqGDgwaSy1HLg6R5IUVyYCi5li6Wv+dRysAQoiG4ple1aMyRYj/wF8Ugl8PVTSCM0GI0K/DbeR9RJ4xi9MLnnPf9Pg+f877ncMYAjP0PdOGjVZtEWKIsAT5a6fKRCvhwGUbpfiVagVEsgQ+VWqZIseTPbMK/XMN+QRyHHN6lDyOCTbZ6WPg6IP4X2DAGXneGArHS7gty9V0iv3UwfcHknVx3IDCEy79YGP/Hk/fvQO9aHx7hcqjUPew7mLi1NhRMBYoU6mbXoJ5ZBedcpfX2l/aBUK/zxVBwyfeWwjPTzzGXfI/TwspAsNP6MUJfcN6+MhRc9Lyh8NT1p7j5qAjOKiIYDCKRSMDr86H8roatz034/QHKWG3qhgi5XH60t4P5VyQ4dnUZvHAXoiii2Wyi0Wggl8shtBDGvfsP8LFep6xQKFCPWq329XYwXyDB8QseCNN2VDc24PF4oNFoYDabEYlE4HA4aM4yVmMSQRDaJJh05+krnOCsmHXNkaDT6UA1Po5sNotqtYp8Po90Ok0ZqzGB2+3eI8HE7ZfbTJBKpWCz2UjgcrmgVCqhUqmg1WoJNmcZqzGBxWJp9QQz6ws6Z/aZ+trjb+d0BngDYSwmnyCTySAWi5HUbrfTnGWLyaWuLxD6LR2nNvJrymSyIwqF4iTHcZ9MJtOu1Wrdk/ip1+sNEmel+XeWsRrrYb1/AB4L/elcpleiAAAAAElFTkSuQmCC",
        "link":"http://amazon.co.uk/neque/vestibulum/eget/vulputate.aspx?ante=volutpat&nulla=eleifend&justo=donec&aliquam=ut&quis=dolor&turpis=morbi&eget=vel&elit=lectus&sodales=in&scelerisque=quam&mauris=fringilla&sit=rhoncus&amet=mauris&eros=enim&suspendisse=leo&accumsan=rhoncus&tortor=sed&quis=vestibulum&turpis=sit&sed=amet&ante=cursus&vivamus=id&tortor=turpis&duis=integer&mattis=aliquet&egestas=massa&metus=id&aenean=lobortis&fermentum=convallis&donec=tortor&ut=risus&mauris=dapibus&eget=augue&massa=vel&tempor=accumsan&convallis=tellus&nulla=nisi&neque=eu&libero=orci&convallis=mauris&eget=lacinia&eleifend=sapien&luctus=quis&ultricies=libero&eu=nullam&nibh=sit&quisque=amet&id=turpis&justo=elementum&sit=ligula&amet=vehicula&sapien=consequat&dignissim=morbi&vestibulum=a&vestibulum=ipsum&ante=integer&ipsum=a&primis=nibh&in=in&faucibus=quis&orci=justo&luctus=maecenas",
        "payed":false
    }

    it('POST /sponsorships 200 OK', (done) => {

        sandbox.mock(mongoose.Model.prototype).expects('save').yields(null, sponsorship);

        chai
            .request(app)
            .post('/v1/sponsorships')
            .send(sponsorship)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('actorId');
                expect(res.body.actorId).to.equal("5e63c941aa30356c43921890");
                expect(res.body.tripId).to.equal("5e65633baa30356c43cee9b4");
                expect(res.body.banner).to.equal("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAImSURBVDjLpZPfa1JhGMcHXfZ/eBUVdNOVBqGDgwaSy1HLg6R5IUVyYCi5li6Wv+dRysAQoiG4ple1aMyRYj/wF8Ugl8PVTSCM0GI0K/DbeR9RJ4xi9MLnnPf9Pg+f877ncMYAjP0PdOGjVZtEWKIsAT5a6fKRCvhwGUbpfiVagVEsgQ+VWqZIseTPbMK/XMN+QRyHHN6lDyOCTbZ6WPg6IP4X2DAGXneGArHS7gty9V0iv3UwfcHknVx3IDCEy79YGP/Hk/fvQO9aHx7hcqjUPew7mLi1NhRMBYoU6mbXoJ5ZBedcpfX2l/aBUK/zxVBwyfeWwjPTzzGXfI/TwspAsNP6MUJfcN6+MhRc9Lyh8NT1p7j5qAjOKiIYDCKRSMDr86H8roatz034/QHKWG3qhgi5XH60t4P5VyQ4dnUZvHAXoiii2Wyi0Wggl8shtBDGvfsP8LFep6xQKFCPWq329XYwXyDB8QseCNN2VDc24PF4oNFoYDabEYlE4HA4aM4yVmMSQRDaJJh05+krnOCsmHXNkaDT6UA1Po5sNotqtYp8Po90Ok0ZqzGB2+3eI8HE7ZfbTJBKpWCz2UjgcrmgVCqhUqmg1WoJNmcZqzGBxWJp9QQz6ws6Z/aZ+trjb+d0BngDYSwmnyCTySAWi5HUbrfTnGWLyaWuLxD6LR2nNvJrymSyIwqF4iTHcZ9MJtOu1Wrdk/ip1+sNEmel+XeWsRrrYb1/AB4L/elcpleiAAAAAElFTkSuQmCC");
                expect(res.body.link).to.equal("http://amazon.co.uk/neque/vestibulum/eget/vulputate.aspx?ante=volutpat&nulla=eleifend&justo=donec&aliquam=ut&quis=dolor&turpis=morbi&eget=vel&elit=lectus&sodales=in&scelerisque=quam&mauris=fringilla&sit=rhoncus&amet=mauris&eros=enim&suspendisse=leo&accumsan=rhoncus&tortor=sed&quis=vestibulum&turpis=sit&sed=amet&ante=cursus&vivamus=id&tortor=turpis&duis=integer&mattis=aliquet&egestas=massa&metus=id&aenean=lobortis&fermentum=convallis&donec=tortor&ut=risus&mauris=dapibus&eget=augue&massa=vel&tempor=accumsan&convallis=tellus&nulla=nisi&neque=eu&libero=orci&convallis=mauris&eget=lacinia&eleifend=sapien&luctus=quis&ultricies=libero&eu=nullam&nibh=sit&quisque=amet&id=turpis&justo=elementum&sit=ligula&amet=vehicula&sapien=consequat&dignissim=morbi&vestibulum=a&vestibulum=ipsum&ante=integer&ipsum=a&primis=nibh&in=in&faucibus=quis&orci=justo&luctus=maecenas");
                expect(res.body.payed).to.equal(false);
                done();
            });
    });

    it('POST /sponsorships 500 Internal Server Error', (done) => {

        sandbox.mock(mongoose.Model.prototype).expects('save').yields(new Error(), null);

        chai
            .request(app)
            .post('/v1/sponsorships')
            .send(sponsorship)
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

})
