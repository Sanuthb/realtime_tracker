const express = require('express')
const http = require('http');
const path = require('path');

const app = express()
const socketio = require('socket.io');
const server=http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname,"public")));
app.set("view engine", "ejs");

io.on('connection', (socket) => {
    socket.on('send-location',function(data){
        io.emit('receive-location',{id:socket.id, ...data});
    })
    socket.on('user-disconnected',function(data){
        io.emit('user-disconnected',socket.id);
    })
    console.log('connection')
})
app.get('/', (req, res) => {
    res.render('index')
})

server.listen(9000)