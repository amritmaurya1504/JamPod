const asyncHandler = require("express-async-handler");
const userService = require("../services/userService");
const UserDTO = require("../dtos/userDTO");
const { processImage } = require("../utils/utils");

class ActivateController {
    activate = asyncHandler(async (req, res) => {

        const { name, avatar } = req.body;
        if (!name || !avatar) {
            res.status(422);
            throw new Error("All fields are required!");
        }

        // image (base64) store it into server
        let imagePath;
        if (!avatar.startsWith("https")) {
            imagePath = await processImage(avatar);
        } else {
            imagePath = avatar;
        }
        // Update user
        try {
            const user = await userService.findUser({ _id: req.user._id });
            if (!user) {
                res.status(404);
                throw new Error("User not found!");
            }

            user.activated = true;
            user.name = name;
            user.avatar = imagePath
            await user.save();

            res.cookie('activated', user.activated, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true
            });

            res.status(201).json({ user: new UserDTO(user), auth: true })

        } catch (error) {
            res.status(500);
            throw new Error("Something went wrong!");
        }


    });
}

module.exports = new ActivateController();