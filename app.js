var express = require("express");
var http = require("http");
var qs = require("querystring");
var fdb = require('fdb').apiVersion(100);
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
//fdb.options.setTraceEnable(".");
db = fdb.open(null, 'DB');

if (!db) {
    console.log("SEVERE : Database connection problem.");
    process.exit(1);
} 
else {
    console.log("Connected to database.");
}

//***********************************************
// Requests processing
//***********************************************
function findValues(req, resp) {
    if (req.query.key) {
        findByKey(req, resp);
    }
    else {
        findByRange(req, resp);
    }
}

function findByKey(req, resp) {
    var key = req.query.key;
    db.get(key, function(error, result) {
        if (error) {
            console.warn("ERROR : "  + error);
            resp.send(500);
        }
        else if (result) {
            resp.send({ key : key, value : result.toString() });
        }
        else {
            resp.send(404);
        }
    });
}

function findByRange(req, resp) {
    var begin = req.query.begin;
    var end = req.query.end;
    console.log("findByRange: begin=" + begin + ", end=" + end);
    db.getRange(begin, end, {}, function(error, results) {
        if (error) {
            console.warn("ERROR : "  + error);
            resp.send(500);
        }
        else if (results) {
            var values = [];
            results.forEach(function(result, index) {
                values.push({ key : result.key.toString(), 
                                value : result.value.toString() });
            });
            resp.send({ range : { begin : begin, end : end },
                        values : values });
        }
        else {
            resp.send(404);
        }
    });
}

function insertValue(req, resp) {
    var data = req.body;
    db.set(data.key, data.value, function(error, result) {
        if (error) {
            console.warn(error);
            resp.send(500);
        }
        else {
            resp.send(204);
        }
    });
}

function deleteValue(req, resp) {
    var key = req.params.key;
    db.clear(key, function(error, result) {
        if (error) {
            console.warn("ERROR : "  + error);
            resp.send(500);
        }
        else if (result) {
            resp.send(204);
        }
        else {
            resp.send(404);
        }
    });
}

//***********************************************
// REST API
//***********************************************
app.get("/fdb?", findValues);
app.post("/fdb", insertValue);
app.delete("/fdb/:key", deleteValue);

httpServer.listen(8888);
console.log("Listening on port 8888...");
