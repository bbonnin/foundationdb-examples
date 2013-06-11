var express = require("express");
var http = require("http");
var qs = require("querystring");
var fdb = require('fdb').apiVersion(22);
var db;

//***********************************************
// Express configuration
//***********************************************
var app = express();
var httpServer = http.createServer(app);

app.configure(function() {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
});

//***********************************************
// FoundationDB configuration
//***********************************************
other = fdb.open(null, 'DB', function(err, opendb) {

    if (!err) {
        db = opendb;
    }    
});

//***********************************************
// Requests processing
//***********************************************
function findByKey(req, resp) {
    var key = req.params.key;
    var value = db[key];
    if (value != null) {
        resp.send({ key : key, value : value }); 
    }
    else {
        resp.send(404, { error : "No value" });
    }
}

function insertValue(req, resp) {
    var data = req.body;
    db[data.key] = data.value;
    resp.send(204);
}

//***********************************************
// REST API
//***********************************************
app.get("/fdb/:key", findByKey);
app.post("/fdb", insertValue);

httpServer.listen(8888);
console.log("Listening on port 8888...");