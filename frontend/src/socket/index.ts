import { io } from "socket.io-client";
import { ISocketOptions } from "../types";


const socketInit = () => {
    const options:ISocketOptions = {
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports : ['websocket'],
    }

    return io("https://jampod.onrender.com", options);
}

export default socketInit