import { useState } from "react";
import { Button, TextInput } from "../shared"
import { createRoom } from "../../http";
import { AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { IRoom } from "../../types";

interface IAddRoomModal {
    handleCloseModal: () => void;
}

const AddRoomModal: React.FC<IAddRoomModal> = ({ handleCloseModal }) => {

    const [roomType, setRoomType] = useState<string>("open");
    const [topic, setTopic] = useState<string>("");
    const navigate = useNavigate();

    const handleCreateRoom = async ():Promise<void> => {
        if(!topic) return;
        // server call
        try {
            const { data }:AxiosResponse<IRoom> = await createRoom({ topic, roomType });
            navigate(`/room/${data.roomId}`)
            console.log(data);
        } catch (error:any) {
            enqueueSnackbar(error.response.data.message, {
                variant: "error"
            })
        }
    }

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-[#000] bg-opacity-60 flex items-center justify-center">
            <div className="relative w-[80%] md:w-[50%] md:max-w-[500px] bg-[#1d1d1d] rounded-[10px]" >
                <button onClick={handleCloseModal} className="absolute right-3 top-2">
                    <img src="/images/close.png" alt="close icon" width={20} height={20} />
                </button>
                <div className="p-[30px] border-b-2 border-[#262626]">
                    <h3 className="mb-3 text-[17px] font-semibold">Enter the title of you room </h3>
                    <TextInput fullWidth="true" onChange={(e) => setTopic(e.target.value)} />
                    <h2 className="mt-3">Room types</h2>
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mt-3 ">
                        <div className={`${roomType === "open" ? "bg-[#262626]" : ""} flex flex-col items-center gap-2 w-full px-7 py-2 rounded-[10px] cursor-pointer`} onClick={(): void => setRoomType("open")} >
                            <img src="/images/globe.png" alt="globe.png" width={30} height={30} />
                            <span className="text-[10px] md:text-[14px]">Open</span>
                        </div>
                        <div className={`${roomType === "social" ? "bg-[#262626]" : ""} flex flex-col items-center gap-2 w-full px-7 py-2 rounded-[10px] cursor-pointer`} onClick={(): void => setRoomType("social")} >
                            <img src="/images/social.png" alt="social.png" width={30} height={30} />
                            <span className="text-[10px] md:text-[14px]">Social</span>
                        </div>
                        <div className={`${roomType === "private" ? "bg-[#262626]" : ""} flex flex-col items-center gap-2 w-full px-7 py-2 rounded-[10px] cursor-pointer`} onClick={(): void => setRoomType("private")} >
                            <img src="/images/lock.png" alt="lock.png" width={30} height={30} />
                            <span className="text-[10px] md:text-[14px]">Private</span>
                        </div>
                    </div>
                </div>
                <div className="p-[30px] flex items-center flex-col gap-4">
                    <h3 className="text-[14px] font-semibold">Start a room, open to everyone</h3>
                    <Button onClick={handleCreateRoom} title="Let's go" icon="celebration.png" iconPosition="left" />
                </div>
            </div>
        </div>
    )
}

export default AddRoomModal

