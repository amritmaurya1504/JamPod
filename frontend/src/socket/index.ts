import { io } from "socket.io-client";
import { ISocketOptions } from "../types";


const socketInit = () => {
    const options:ISocketOptions = {
        'force new connection' : true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports : ['websocket'],
    }

    return io('http://localhost:5500', options);
}

export default socketInit