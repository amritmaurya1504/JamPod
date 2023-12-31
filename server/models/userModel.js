const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: false },
    avatar: {
        type: String, required: false, get: (avatar) => {
            return avatar ? (avatar.includes("https://api.dicebear.com/7.x/open-peeps/svg?seed") ? avatar : `${process.env.BASE_URL}${avatar}`) : null;
        }
    },
    email: { type: String, required: true },
    activated: { type: Boolean, required: false, default: false },
}, {
    timestamps: true,
    toJSON: {
        getters : true
    }
});


module.exports = mongoose.model('User', userSchema, 'users');