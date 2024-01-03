"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const PORT = process.env.PORT || 3500;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const expressServer = app.listen(PORT, () => console.log(`listening on: ${PORT}`));
const io = new socket_io_1.Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    socket.emit('welcome', `Welcome, ${socket.id.slice(0, 5)}!`);
    socket.broadcast.emit('user_joined', `User, ${socket.id.slice(0, 5)} joined!`);
    socket.on('newMsg', (data) => {
        io.emit('newMsg', { message: data.message, sender: socket.id.slice(0, 5) });
    });
    socket.on('activity', () => {
        socket.broadcast.emit('activity', `${socket.id.slice(0, 5)} is typing!`);
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('user_disconnected', `User ${socket.id.slice(0, 5)} disconnected`);
    });
});
