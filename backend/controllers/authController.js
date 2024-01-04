const asyncHandler = require("express-async-handler");
const otpService = require("../services/otpService");
const hashService = require("../services/hashService");
const userService = require("../services/userService");
const tokenService = require("../services/tokenService");
const UserDTO = require("../dtos/userDTO");
const { isValidEmail } = require("../utils/utils");

class AuthController {

    sendOTP = asyncHandler(async (req, res) => {
        // Logics 
        const { email } = req.body;
        if (!email) {
            res.status(422);
            throw new Error("Email is required!")
        }

        // checking wether email is valid or not
        if (isValidEmail(email)) {

            // 1. Create OTP
            const otp = await otpService.generateOtp();

            // 2. Hash OTP
            const ttl = 1000 * 60 * 2; // time to leave (expiry time); 2 min
            const expires = Date.now() + ttl;
            const data = `${email}.${otp}.${expires}`;
            const hash = await hashService.hashOtp(data);

            // 3. Send OTP to Email
            try {
                await otpService.sendByEmail(email, otp);
                return res.json({
                    hash: `${hash}.${expires}`, email: email
                })
            } catch (error) {
                res.status(500);
                throw new Error("OTP Sending failed!");
            }
        } else {
            res.status(422);
            throw new Error("Email should be valid!");
        }
    });

    verifyOTP = asyncHandler(async (req, res) => {

        const { otp, hash, email } = req.body;
        if (!otp || !hash || !email) {
            res.status(422);
            throw new Error("All fields are required!");
        }

        // 1. OTP verification 

        const [hashedOTP, expires] = hash.split('.');
        if (Date.now() > +expires) {
            res.status(400);
            throw new Error("OTP Expired!");
        }

        const data = `${email}.${otp}.${expires}`;
        const isValid = await otpService.verifyOtp(hashedOTP, data);
        if (!isValid) {
            res.status(400);
            throw new Error("Invalid OTP!");
        }

        // 2. User Creation

        let user;

        try {
            user = await userService.findUser({ email: email });
            if (!user) {
                user = await userService.createUser({ email: email });
            }
        } catch (error) {
            res.status(500);
            throw new Error("DataBase error!");
        }

        // 3. Token Generation
        const { accessToken, refreshToken } = await tokenService.generateToken({ _id: user._id });

        // 4. Store token in DB
        await tokenService.storeRefreshToken(refreshToken, user._id);

        // 5. sending token to cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });

        const userDto = new UserDTO(user);
        res.json({ user: userDto, auth: true });

    });

    refresh = asyncHandler(async (req, res) => {
        // get refresh token from cookie
        const { refreshToken: refreshTokenFromCookie } = req.cookies;

        // check is token is valid
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
        } catch (error) {
            res.status(401);
            throw new Error("Invalid Token!")
        }

        // check if valid user
        let user;
        try {
            user = await userService.findUser({ _id: userData._id });
            if (!user) {
                res.status(404);
                throw new Error("User not found!");
            }
        } catch (error) {
            res.status(500);
            throw new Error("Internal Error!")
        }

        // check if token is in db 
        try {
            const token = tokenService.findRefreshToken(userData._id, refreshTokenFromCookie);
            if (!token) {
                res.status(401);
                throw new Error("Invalid Token!")
            }
        } catch (error) {
            res.status(500);
            throw new Error("Internal Error!");
        }

        // generate new tokens
        const { accessToken, refreshToken } = await tokenService.generateToken({ _id: userData._id });

        // update refresh token in DB
        try {
            tokenService.updateRefreshToken(userData._id, refreshToken);
        } catch (error) {
            res.status(500);
            throw new Error("Internal Error!");
        }

        // put in cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });


        // response 
        const userDto = new UserDTO(user);
        res.json({ user: userDto, auth: true });
    })

    getUser = asyncHandler(async (req, res) => {
        try {
            const user = await userService.findUser({_id : req.params.userId});
            res.status(200).json(new UserDTO(user));
        } catch (error) {
            res.status(500);
            throw new Error("DB Error");
        }
    })

    logout = asyncHandler(async (req, res) => {
        const { refreshToken } = req.cookies;
        // delete refresh token from db
        tokenService.removeToken(refreshToken)

        // delete cookies
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');

        res.json({ user: null, auth: false })
    })

}

module.exports = new AuthController();