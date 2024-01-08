const expressAsyncHandler = require("express-async-handler");
const roomService = require("../services/room-service");
const RoomDTO = require("../dtos/roomDTO");

class RoomController {
    createRoom = expressAsyncHandler(async (req, res) => {
        const { roomType, topic } = req.body;

        if (!roomType || !topic) {
            res.status(422);
            throw new Error("All fields are required!");
        }

        let room;
        try {
            room = await roomService.create({ roomType, topic, ownerId: req.user._id });
        } catch (error) {
            res.status(500);
            throw new Error("DB Error!");
        }

        const roomDTO = new RoomDTO(room);
        res.status(201).json(roomDTO)

    })

    index = expressAsyncHandler(async (req, res) => {
        try {
            const { limit:reqLimit = 8, skip:reqSkip = 0 } = req.query;
            const limit = parseInt(reqLimit);
            const skip = parseInt(reqSkip);
            const {rooms, total} = await roomService.getAllRooms(limit, skip);
            const allRooms = rooms.map(room => new RoomDTO(room))
            res.status(200).json({allRooms, total, limit, skip});
        } catch (error) {
            res.status(500);
            throw new Error("DB Error!");
        }
    })

    show = expressAsyncHandler(async (req, res) => {
        try {
            const room = await roomService.getRoom(req.params.roomId);
            res.status(200).json(new RoomDTO(room));
        } catch (error) {
            res.status(500);
            throw new Error("DB Error!");
        }
    })

    showUserSpecificRoom = expressAsyncHandler(async (req, res) => {
        try {
            const rooms = await roomService.getUserSpecificRooms({ownerId : req.params.userId});
            const allRooms = rooms.map(room => new RoomDTO(room));
            res.status(200).json(allRooms);
        } catch (error) {
            res.status(500);
            throw new Error("DB Error!");
        }
    })
}

module.exports = new RoomController();