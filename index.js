const app = require('express')();
const cors = require('cors');
let server = require('http').createServer(app);
let io = require('socket.io')(server);
const fs = require('fs');
const file = 'task-data.json';
const baseData = [{ "name": "office", "data": [] }, { "name": "work", "data": [] }, { "name": "personal", "data": [] }];

app.use(cors());

function writeDataToFile(dataStore) {
    let data = JSON.stringify(dataStore);
    console.log(data);
    if (data && data.length) {
        fs.writeFileSync(file, data);
    }
}

function readDataFromFile() {
    if (!fs.existsSync(file)) {
        writeDataToFile(baseData);
    }
    let rawdata = fs.readFileSync(file);
    return JSON.parse(rawdata);
}

io.on('connection', (socket) => {
    console.log('welcome', socket.id);
    socket.emit('fireInTheHole', readDataFromFile());

    socket.on('fireInTheHole', () => console.log('fireInTheHole event triggered'));
    socket.on('makeFireInTheHole', (data) => {
        writeDataToFile(data);
        socket.broadcast.emit('fireInTheHole', readDataFromFile());
    });
    socket.on('disconnect', () => console.log('disconnected from server'));
});

server.listen(process.env.PORT || 3333, () => console.log(`listening on ${process.env.PORT || 3333}`));