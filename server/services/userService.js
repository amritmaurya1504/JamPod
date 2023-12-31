const UserModel = require("../models/userModel");

class UserService {

    findUser = async (filter) => {
        const user = await UserModel.findOne(filter);
        return user;
    }

    createUser = async (data) => {
        const user = await UserModel.create(data);
        return user;
    }

}

module.exports = new UserService();