var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const fs = require('fs');
const logFile = './logger.txt';

// app.get('/', function(req, res){
//   res.send('<h1>Hello world</h1>');
// });
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', function (socket) {
        var lastTen;
        fs.readFile(logFile, 'utf-8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            const lines = data.split('\n')
            if (lines.length <= 10) {
            }
            else {
                lastTen = lines.slice(-10).join('\n')
                console.log("last ten:", lastTen)
            }
            io.emit('chat message', lastTen);

        })
});

fs.watch(logFile, (event, filename) => {
    if (filename) {
        console.log(`${filename} file Changed`);
        var lastTen;
        fs.readFile(logFile, 'utf-8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            const lines = data.split('\n')
            if (lines.length <= 10) {
            }
            else {
                lastTen = lines.slice(-10).join('\n')
            }
            io.emit('chat message', lastTen);

        })
    }
});
http.listen(3000, function () {
    console.log('listening on *:3000');
});
