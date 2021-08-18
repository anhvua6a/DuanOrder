var app = require('../app');
var debug = require('debug')('duan:server');
var http = require('http');
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
let user = require('../model/user');
let table = require('../model/table');
var server = http.createServer(app);

let io = require('socket.io')(server);

io.on('connection', client => {

    // let getAllTable = await table.find({});
    // console.log(getAllTable);
    // io.sockets.emit('getAllTable', {data: getAllTable})
    console.log('Có người kết nối ' + client.id)
    //
    // console.log(user.getAllUser)
    // client.on('disconnect', () => {
    //     console.log('user disconnected');
    // });
    client.on('order', status => {

        console.log(status);
        if (status === "Xong") {
            io.sockets.emit('reload', {reload: true});
        }
    });
    client.on('payy', status => {

        console.log(status+" 1");
        if (status === "Xong") {
            io.sockets.emit('reloadTable', {reload: true});
        }
    });


})


server.listen(port, () => {
    console.log(`Sever running at http://localhost:${port}`)
});
server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
