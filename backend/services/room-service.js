const RoomDTO = require("../dtos/roomDTO");
const RoomModel = require("../models/room-model");

class RoomService {
    create = async (payload) => {
        const { topic, roomType, ownerId } = payload;
        return await RoomModel.create({
            topic: topic,
            roomType: roomType,
            ownerId: ownerId,
            speakers: [ownerId]
        })
    }

    getAllRooms = async (types) => {
        const rooms = await RoomModel.find({ roomType: { $in: types } })
            .populate('speakers')
            .populate('ownerId')

        return rooms;
    }

    getRoom = async (roomId) => {
        const rooms = await RoomModel.findOne({ _id: roomId })
            .populate('speakers')
            .populate('ownerId')

        return rooms;
    }

    getUserSpecificRooms = async (filter) => {
        const rooms = await RoomModel.find(filter)
            .populate('speakers')
            .populate('ownerId')

        return rooms;
    }
}

module.exports = new RoomService();