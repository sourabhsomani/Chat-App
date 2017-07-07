var http=require('http').createServer(createServer).listen(process.env.PORT||8090);
var io=require('socket.io')(http);
var fs=require('fs');
function createServer(req,res){
    fs.readFile('index.html',function(err,data){
        if(err){return;}
        res.write(data);
        res.end();
    });
}
var totalUser=0;
var skt=[];
var user=[];
io.on('connection',function(socket){
    io.emit('connected');
    skt.push(socket);
    socket.on('send',function(data){
        for(var i=0;i<skt.length;i++){
            if(skt[i].id==data.from){
                skt[i].emit('receive',data);
            }
        }
    });
    socket.on('saveUser',function(name){
        totalUser++;
        user.push({name:name,chatId:socket.id});
        for(var i=0;i<skt.length;i++){
            skt[i].emit('GetActiveUsers',user);
        }
    });
    socket.on('typing_from',function(name){
        for(var i=0;i<skt.length;i++){
            skt[i].emit('typing',name+" is typing...");
        }
    });
})
