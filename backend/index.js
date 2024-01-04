require('dotenv').config();
const express = require("express");
const app = express();
const connectDB = require("./database");
const cookieParser = require("cookie-parser");
const server = require('http').createServer(app);
const ACTIONS = require('./actions');

const io = require('socket.io')(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
    }
})

const PORT = process.env.PORT || 5500;
connectDB();


// middlewares 


// middleware
const cors = require("cors");

app.use(cors({
    credentials: true,
    origin: ['https://jampod.vercel.app/', 'http://localhost:3000']
}));

app.use(cookieParser());
app.use(express.json({ limit: '8mb' }));
// app.use(morgan("dev"));
app.use('/storage', express.static('storage'));

// Root Endpoint
app.get("/", (req, res) => {
    res.json({message: "Hello from JamPod server!"});
})

// Other Endpoints
app.use("/api/v1", require("./routes"));

// Error Handling middlewares
const { notFound, errorHandler } = require("./middleware/errorHandlers");
app.use(notFound);
app.use(errorHandler);



// SOCKETS LOGIC

const socketUserMapping = {}

io.on('connection', (socket) => {
    // console.log('new connection', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
        socketUserMapping[socket.id] = user;

        // new Map
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.ADD_PEER, {
                peerId: socket.id,
                createOffer: false,
                user: user
            })
            socket.emit(ACTIONS.ADD_PEER, {
                peerId: clientId,
                createOffer: true,
                user: socketUserMapping[clientId]
            })
        });

        socket.join(roomId);

    });


    // handle relay ice
    socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
            peerId: socket.id,
            icecandidate
        });
    });

    // handle relay sdp (session description)
    socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerId: socket.id,
            sessionDescription
        });
    });



    // handle mute unmute


    socket.on(ACTIONS.MUTE, ({roomId, userId}) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.MUTE, {
                peerId : socket.id,
                userId,
            })
        })
    })

    socket.on(ACTIONS.UN_MUTE, ({roomId, userId}) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.UN_MUTE, {
                peerId : socket.id,
                userId,
            })
        })
    })

    // leaving the room
    const leaveRoom = ({ roomId }) => {
        const { rooms } = socket
        Array.from(rooms).forEach(roomId => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach(clientId => {
                io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: socketUserMapping[socket.id]?._id
                })

                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerId: clientId,
                    userId: socketUserMapping[clientId]?._id
                })
            })
            socket.leave(roomId)
        })

        delete socketUserMapping[socket.id];
    }

    socket.on(ACTIONS.LEAVE, leaveRoom);
    socket.on('disconnecting', leaveRoom);
})


// Server
server.listen(PORT, () => {
    console.log(`JamPod server is listening on port ${PORT}...`);
})