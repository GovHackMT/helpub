var express = require('express');
var bodyParser = require('body-parser');
var httpHandler= require('http');
var path = require("path");

var usuarioRouter = require('./routes/usuario');
var chamadoRouter = require('./routes/chamado');

var serverAuthKeys = {
  apiKey:"621e36a9-4d62-4d0d-9e84-c8a61577598b",
  apiSecretkey:"69534a5b-28aa-40f5-909a-447ef1e3e645"
};

var app = express();

app.disable('x-powered-by');

app.use('/static', express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({
  limit:"50mb"
}));
app.use(bodyParser.urlencoded({  
  limit:"50mb", 
  extended: false
}));

//No cache
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

//Auth middleware
app.use(function (req, res, next) {
 
  var apiKey  = req.get("Api-Key"); 
  var apiSecretkey  = req.get("Api-Secret-Key"); 

  if(apiKey == serverAuthKeys.apiKey && apiSecretkey == serverAuthKeys.apiSecretkey){
    next();
  }else{
     res.status(401);
     res.json({
        message:"Server credentials are not valid!"
     });
  }
});

//Start server
httpHandler.createServer(app,function (req, res) {
    app.io.attach(httpHandler);
    }).listen(5001,function(){
    console.log("[Boot log] - Server started in port 5001");    
});

app.use('/usuario', usuarioRouter);
app.use('/chamado', chamadoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
