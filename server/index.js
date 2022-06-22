const express = require("express");
let config = require("config"),myConfig;
const PORT = process.env.PORT || 30001;
const app = express();
const configUpdateInterval = 5000;
const socketIo = require("socket.io")
const http = require("http")
const server = http.createServer(app)
const io = socketIo(server,{
    cors: {
        origin: "http://localhost:30000"
    }
})

io.on("connection",(socket)=>{
    console.log("client connected: ",socket.id)
    socket.join("config-test")
    socket.on("disconnect",(reason)=>{
        console.log(reason)
    })
})

const initConfigVariables=()=>{
    config = require('config');
    myConfig=config.get('MyVariables');
}

const refreshConfigVariables=()=>{
    delete require.cache[require.resolve('config')];
    initConfigVariables();
}

initConfigVariables();

setInterval(() => {
    refreshConfigVariables()
    io.to("config-test").emit("data", JSON.stringify(myConfig))
}, configUpdateInterval)

app.get("/push", (req, res) => {
    refreshConfigVariables()
    res.json({ message: JSON.stringify(myConfig)});
});

app.get("/pull", (req, res) => {
    res.json({message: JSON.stringify(myConfig)})
})

server.listen(PORT, err=> {
    if(err) console.log(err)
    console.log("Server running on Port ", PORT)
})