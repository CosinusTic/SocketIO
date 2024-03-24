require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { Server } = require('socket.io');
const { createServer } = require('http');
const server = createServer(app);
const cors = require('cors');
const port = process.env.PORT || 4000; // Changed to 4000 to avoid conflict with React's default port
const usersRoutes = require('./routes/users.js');
const channelsRoutes = require('./routes/channels.js');
const messagesRoutes = require('./routes/messages.js');
const messageController = require('./controllers/messages.js');
const cookieParser = require('cookie-parser');
const { join } = require('path');

const corsOptions = {
    origin: "*",
    credentials: true,
};

let eventBuffer = [];
const interval = 5000; // 5 sec

const executeBuffer = async () => {
    
    if(eventBuffer.length > 0){
        await messageController.addMessages(eventBuffer);
        eventBuffer = [];
    }
}

setInterval(executeBuffer, interval);



app.use(cors(corsOptions))
    .use(express.json())
    .use(express.static(join(__dirname, 'public')))
    .use(cookieParser())
    .use(usersRoutes)
    .use(channelsRoutes)
    .use(messagesRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connection to MongoDB cluster established"))
    .catch((err) => console.error(`Error: ${err.message}`));

mongoose.connection.on("error", err => {
    /*console.log(`DB connection error: ${err.message}`);*/
});

const io = new Server(server, {
    cors: corsOptions
});

io.on('connection', (socket) => {
    /*console.log('New user connected');*/
    const rooms = new Set(); // Track rooms the user has joined

    socket.on('join room', (room) => {
        rooms.add(room);
        socket.join(room);
        /*console.log(`User joined room: ${room}`);*/
    });

    socket.on('leave room', (room) => {
        rooms.delete(room);
        socket.leave(room);
        /*console.log(`User left room: ${room}`);*/
    });

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
        eventBuffer.push(data);
    });

    socket.on('disconnect', () => {
        rooms.forEach(room => socket.leave(room));
        /*console.log('User disconnected');*/
    });
});

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'login.html'));
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
