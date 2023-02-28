const express = require('express');
const ws = require('ws');
const app = express();
const port = 3000;
const server = new ws.Server({ noServer: true });
const { v4: uuidv4 } = require('uuid');
var users = []
var rooms = []
var cards = []
var cardIds = 0

server.on('connection', (socket, req) => {
    const id = req.headers['sec-websocket-key'];

    socket.on('message', (data) => {
        var request = JSON.parse(getRequestObject(data))

        switch (request.source) {
            case "get-room":
                socket.send(JSON.stringify({ source: "get-room", content: getRoom(request.content.id, socket) }))
                break;

            case "create-room":
                socket.send(JSON.stringify({ source: "create-room", content: createRoom(request.content, id) }))
                break;

            case "join-room":
                var data = JSON.stringify({ source: "join-room", content: joinRoom(request.content, id) })
                socket.send(data)
                var roomUsers = getRoomUsers(request.content)
                roomUsers.forEach(user => {
                    user.socket.send(data)
                });
                break;

            case "send-vote":
                var cardIndex = cards.findIndex(x => x.id == request.content.cardId)
                cards[cardIndex].votes = request.content.votes
                var data = { source: "send-vote", content: { votes: cards[cardIndex].votes } }
                var roomUsers = getRoomUsers(request.content)
                roomUsers.forEach(user => {
                    user.socket.send(JSON.stringify(data))
                });
                break;

            case "get-user":
                socket.send(JSON.stringify({ source: "get-user", content: getUser(id) }))
                break;

            case "get-user-with-name":
                socket.send(JSON.stringify({ source: "get-user-with-name", content: getUserWithName(id, request.content.name, socket) }))
                break;

            case "change-username":
                socket.send(JSON.stringify({ source: "change-username", content: changeUsername(id, request.content) }))
                break;

            case "change-card":
                cardIds += 1
                var roomUsers = getRoomUsers(request.content)
                var card = { id: cardIds, title: request.content.title, description: request.content.description, votes: request.content.votes }
                cards.push(card)
                var data = JSON.stringify({ source: "change-card", content: card })
                roomUsers.forEach(user => {
                    user.socket.send(data)
                });
                break;
        }
    });
});

function getRoomUsers(cardObject) {
    var room = rooms.find(x => x.id == cardObject.roomId)
    if (!room) {
        console.log("room not found.")
        return
    }

    return room.users
}

function getUser(id, socket) {
    var user = users.find(x => x.id == id)
    if (!user) {
        user = {
            id: id,
            socket: socket
        }
        users.push(user)
    }
    return user
}

function getUserWithName(id, name, socket) {
    var user = users.find(x => x.id == id)
    if (!user) {
        user = { id: id, name: name, socket: socket }
        users.push(user)
    }
    return user
}

function getRoom(roomId) {
    return rooms.find(x => x.id == roomId)
}

function changeUsername(id, data) {
    var user = getUser(id)
    user.name = data.name
    users.push(user)
    return user
}

function joinRoom(data, id) {
    room = rooms.find(x => x.id == data.roomId)
    var user = getUser(id)
    if (room && user) {
        room.users.push(user)
    }

    return room
}

function createRoom(data, id) {
    var room = {
        id: uuidv4(),
        name: data.roomName,
        type: data.roomType,
        users: [],
        admins: []
    }

    var user = getUser(id)
    room.users.push(user);
    room.admins.push(user);
    rooms.push(room)
    return room
}

function getRequestObject(data) {
    var buffer = Buffer.from(data)
    return buffer.toString()
}

const httpServer =
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });

httpServer.on('upgrade', (request, socket, head) => {
    server.handleUpgrade(request, socket, head, socket => {
        server.emit('connection', socket, request);
    });
});