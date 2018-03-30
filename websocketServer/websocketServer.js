// https://www.cnblogs.com/wangkangluo1/archive/2012/12/10/2811314.html
var http = require("http"), io = require("socket.io");
 
// Create HTTP server
var server = http.createServer(function(request, response) {
//   response.writeHead({ "Content-Type": "text/html" });
    response.end("response.end");
});
server.listen(8000, "localhost");
 
// Wrap HTTP server by socket.io
var socket = io.listen(server);
socket.on("connection", function(client) {
    console.log("connected");
 
    client.on("message", function(data) {
        client.send("Hello " + data);
    });
 
    client.on("disconnect", function() {
        console.log("disconnected");
    });
});
socket.on("open", function(client) {
    console.log("connected");
    client.on("message", function(data) {
        client.send("Hello " + data);
    });
 
    client.on("disconnect", function() {
        console.log("disconnected");
    });
});
