let bodyParser = require('body-parser');

let express = require('express')
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;

// let bodyParser = require('body-parser');
// app.use(bodyParser.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

// serve up static content from "client" folder
//app.use(express.static('client'));

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

let globalNotification = io
    .of('/globalNotification')
    .on('connection', function (socket) {
        // Send message to client like usual
        console.log('global user connected');
        socket.emit('globalNotificationSubscribed', { message: 'you have subscribed to globalNotification' });
        // Broadcast message to everyone in this namespace
        //globalNamespace.emit('a message', { everyone: 'in', '/chat': 'will get' });
    });

    //var jsonParser = bodyParser.json()

app.post('/api/global', function (req, res) {

    //console.log(req);

    console.log(req.body);  
    var message = req.body.message;

    console.log('sending global message: ' + message);

    globalNotification.emit('globalMessage', { message: message });

    //io.sockets.in(room).emit('message', { message: message });

    res.json({message: 'test message from server - GLOBAL'}); // return all todos in JSON format
});



io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('new-message', (message) => {
      console.log(message);
      io.emit('new-message', message)
    });

    socket.on('disconnect', function () {
        io.emit('message', "User disconnected");
    });

});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});

//https://codingblast.com/chat-application-angular-socket-io/