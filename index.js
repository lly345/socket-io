const http = require("http");
const fs = require("fs");

const httpServer = http.createServer((req, res) => {
    if ((req.url = "/")) {
        res.end(fs.readFileSync("./public/index.html"));
    }
});
const io = require("socket.io")(httpServer);

const logs = [];
const allTalk = content => {
    logs.forEach(socket => {
        socket.send({
            code: 1,
            mesg: content,
            type: "all",
            id: socket.id
        });
    });
};
io.on("connection", socket => {
    const i = logs.indexOf(socket);
    i === -1 ? logs.push(socket) : (logs[i] = socket);
    if (logs.length > 30) {
        socket.send({
            code: 0,
            msg: "群聊人数已满"
        });
        socket.disconnect();
    }
    socket.send({
        code: 1,
        type: "alert",
        mesg: `目前${logs.length}人在线`
    });
    socket.on("message", obj => {
        switch (obj.type) {
            case "all":
                allTalk(obj.content);
                break;
        }
    });
});

httpServer.listen(3000, () => {
    console.log("port is 3000");
});
