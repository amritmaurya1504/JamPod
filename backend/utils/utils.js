const Jimp = require("jimp");
const path = require("path");

async function processImage(base64Data) {
    const buffer = Buffer.from(base64Data.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
    const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

    try {
        const jimpResp = await Jimp.read(buffer);
        jimpResp.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `../storage/${imagePath}`));
        return `/storage/${imagePath}`;
    } catch (error) {
        throw new Error("Could not process the image!");
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


module.exports = { processImage, isValidEmail };