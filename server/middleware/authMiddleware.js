const asyncHandler = require("express-async-handler");
const tokenService = require("../services/tokenService");

module.exports = asyncHandler(async function (req, res, next) {

    try {

        const { accessToken } = req.cookies;
        if (!accessToken) {
            throw new Error()
        }

        const userData = await tokenService.verifyAccessToken(accessToken);
        
        if(!userData){
            throw new Error();
        }

        req.user = userData;
        next();
        
    } catch (err) {
        res.status(401);
        throw new Error("Invalid Token!")
    }

})