import { io } from "socket.io-client";
import { ISocketOptions } from "../types";


const socketInit = () => {
    const options:ISocketOptions = {
        'force new connection' : true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports : ['websocket'],
    }

    return io(`${process.env.REACT_APP_ENDPOINT}`, options);
}

export default socketInit