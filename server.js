const express = require('express');
const app = express();
var users = [];
// var db=require('./db');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);


app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
})
// MAKING THE SOCKET CONNECTION
io.on('connection',function(socket){
    console.log('connected');
// listening to client on 'new user; and pushing the number of users coming from client to users array
    socket.on('new user',function(data,callback){
 
        if(users.indexOf(data)!=-1){
            callback(false);
        }else{
            callback(true);
            socket.username = data;
            users.push(socket.username);
            updateusers();
        }  
 })
//  updating the users array and emitting to client on event 'usernames'
function updateusers(){
    io.emit('usernames',users);
}
// LISTENING TO CLIENT ON 'send message' AND EMITTING TO SERVER ON 'new message'
    socket.on('send message',function(data){
       io.emit('new message',{msg:data,user:socket.username});
    })
// disconnect socket function and if user disconnected than updating the users array by updateusers method()
socket.on('disconnect',function(data){
    if(!socket.username){
        return;
    }
    users.splice(users.indexOf(socket.username),1);
    updateusers();
})
})




server.listen(process.env.port||3000);
console.log('server listening');




