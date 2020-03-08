var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080,
  mongoose = require('mongoose'),
  Actor = require('./api/models/actorModel'),
  Sponsorship = require('./api/models/sponsorshipModel'),
  Trip = require('./api/models/tripModel'),
  Application = require('./api/models/applicationModel'),
  Search = require('./api/models/searchModel'),
  Config = require('./api/models/configModel'),
  DataWareHouse = require('./api/models/dataWareHouseModel'),
  DataWareHouseTools = require('./api/controllers/dataWareHouseController'),
  bodyParser = require('body-parser'),
  admin = require("firebase-admin");

// MongoDB URI building
//var mongoDBHostname = process.env.mongoDBHostname || "localhost";
//var mongoDBPort = process.env.mongoDBPort || "27017";
//var mongoDBName = process.env.mongoDBName || "ACME-Explorer";
//var mongoDBURI = "mongodb://" + mongoDBHostname + ":" + mongoDBPort + "/" + mongoDBName;
var mongoDBURI = "mongodb+srv://consulta:consulta@acme-explorer-rmm7f.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(mongoDBURI, {
    //reconnectTries: 10,
    //reconnectInterval: 500,
    poolSize: 10, // Up to 10 sockets
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // skip trying IPv6
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routesActors = require('./api/routes/actorRoutes');
var routesSponsorships = require('./api/routes/sponsorshipRoutes');
var routesTrips = require('./api/routes/tripRoutes');
var routesApplication = require('./api/routes/applicationRoutes');
var searchApplication = require('./api/routes/searchRoutes');
var configApplication = require('./api/routes/configRoutes');
var routesDataWareHouse = require('./api/routes/dataWareHouseRoutes');
var serviceAccount = require("./firebase/whiletrue-1920-firebase-adminsdk-ue5hg-137a99caa4.json");

routesActors(app);
routesSponsorships(app);
routesTrips(app);
routesApplication(app);
searchApplication(app);
configApplication(app);
routesDataWareHouse(app);


console.log("Connecting DB to: " + mongoDBURI);
mongoose.connection.on("open", function (err, conn) {
    app.listen(port, function () {
        console.log('ACME-Explorer RESTful API server started on: ' + port);
    });
});

mongoose.connection.on("error", function (err, conn) {
    console.error("DB init error " + err);
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://whiletrue-1920.firebaseio.com"
  });
  
DataWareHouseTools.createDataWareHouseJob();