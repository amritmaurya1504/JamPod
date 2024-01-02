const jwt = require("jsonwebtoken");
const RefreshModel = require("../models/refresh-model");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;


class TokenService {

    generateToken = async (payload) => {
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: '1h'
        });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: '1y'
        });

        return { accessToken, refreshToken };
    }

    storeRefreshToken = async (token, userId) => {
        try {
            await RefreshModel.create({ token, userId });
        } catch (error) {
            console.log(error.message);
        }
    }

    verifyAccessToken = async (token) => {
        return jwt.verify(token, accessTokenSecret);
    }

    verifyRefreshToken = async (token) => {
        return jwt.verify(token, refreshTokenSecret);
    }

    findRefreshToken = async (userId, token) => {
        return await RefreshModel.findOne({ userId: userId, token: token });

    }

    updateRefreshToken = async (userId, token) => {
        return await RefreshModel.updateOne({
            userId: userId
        }, {
            token: token
        })
    }

    removeToken = async (refreshToken) => {
        return await RefreshModel.deleteOne({token: refreshToken});
    }
}


module.exports = new TokenService();