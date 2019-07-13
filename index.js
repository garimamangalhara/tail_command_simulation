var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const fs = require('fs');
const buttonPressesLogFile = './logger.txt';

// app.get('/', function(req, res){
//   res.send('<h1>Hello world</h1>');
// });
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});

fs.watch(buttonPressesLogFile, (event, filename) => {
    if (filename) {
        console.log(`${filename} file Changed`);
        var lastTen;
        fs.readFile(buttonPressesLogFile, 'utf-8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            console.log(data)
            const lines = data.split('\n')
            if (lines.length <= 10) {
                console.log(lines)
            }
            else {
                lastTen = lines.slice(-10).join('\n')
                console.log("last ten:", lastTen)
            }
            io.emit('chat message', lastTen);

        })
    }
});
fs.readFile(buttonPressesLogFile, 'utf-8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    console.log(data)
    const lines = data.split('\n')
    if (lines.length <= 10) {
        console.log(lines)
    }
    else {
        let lastTen = lines.slice(-10)
        console.log("last ten:", lastTen)
    }
})
http.listen(3000, function () {
    console.log('listening on *:3000');
});