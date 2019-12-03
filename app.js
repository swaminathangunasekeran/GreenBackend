const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const cors = require('cors');
const autoIncrement = require('mongoose-auto-increment');
const config = require('./routes/config');
const publicationModule =  require('./module/dbInitModule')
const DBModule = require('./module/dbInitModule');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
const rateLimit = require("express-rate-limit");
const app = express();
var today = new Date();
var uuid = require('node-uuid');

const logDirectory = path.join(__dirname, 'log')
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})
logger.token('id', function getId (req) {
  return req.id
})

// app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
 
//  apply to all requests
 // app.use(limiter);



app.use(helmet());
app.use(compression());
// app.use(assignId); 

// log all requests to access.log
app.use(logger(':id :date[web] :method :url :http-version :remote-addr :status :response-time ',{stream: accessLogStream}));


app.set('superSecret', config.secret); // secret variable
app.set('pepperSecret', config.pepper);
app.set('verifySecret', config.verifySecret)
// view engine setup

////console.log("CONFIG SECRET ===",config.secret)
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

//app.use(express.static(path.join(__dirname, 'Client')));
//app.use(express.static(path.join(__dirname, 'node_modules')));


app.use(cookieParser());
app.use(busboy());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));
app.use(busboyBodyParser());

// add routes
// add cors
app.use(cors());
//connect to mongodb
////console.log("CONFIG DATASE IS :::"+config.database)

  mongoose.connect(config.database,{useNewUrlParser: true,autoIndex: false,socketTimeoutMS: 3000000,});

//mongoose.connect(config.database,{useMongoClient: true, socketTimeoutMS: 0,});
//mongoose.connect('mongodb://127.0.0.1:27017/local');
//on Connection on mongodb
mongoose.connection.on("connected",()=>{
   console.log("Connected to database mongodb @ cluster", process.env.NODE_ENV);
    let dbModule = new DBModule();
    dbModule.initDb();
});
//on error on mongoDB
mongoose.connection.on("error",(err)=>{
    if(err){
      console.log("Error in connection to database mongodb @27017",err)
    }
     //console.log("Error is ",err)
});

module.exports = app;

const route = require('./routes/route');
app.use('/kadal',route);
app.use(express.static(path.join(__dirname, 'public')));
app.use("/*",express.static(path.join(__dirname, 'public')));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    res.status(404);
    res.json(0,`Requested page not found 404`,next);
});
// error handler
app.use(function(err, req, res, next) {
    // log the error, treat it like a 500 internal server error
    // maybe also log the request so you have more debug information
    //log.error(err, req);

    // during development you may want to print the errors to your console
    ////console.log(err.stack);

    // send back a 500 with a generic message
   //  console.log("ON ERROR",err,'request===',req);
    res.status(500);
    res.json(-1,`Error on Server ${err}`,next);

});

function assignId (req, res, next) {
  req.id = uuid.v4()
  next()
}
