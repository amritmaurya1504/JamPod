import { io } from "socket.io-client";
import { ISocketOptions } from "../types";


const socketInit = () => {
    const options:ISocketOptions = {
        'force new connection' : true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports : ['websocket'],
    }

    return io('https://api-vegfru.online', options);
}

export default socketInit