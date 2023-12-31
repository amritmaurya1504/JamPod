class UserDTO {
    _id;
    name;
    avatar;
    email;
    activated;
    createdAt;

    constructor(user) {
        this._id = user._id;
        this.name = user.name;
        this.avatar = user.avatar;
        this.email = user.email;
        this.activated = user.activated;
        this.createdAt = user.createdAt;
    }

}

module.exports = UserDTO;