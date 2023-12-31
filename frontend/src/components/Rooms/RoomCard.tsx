import { useNavigate } from "react-router-dom";
import { IRoomCard } from "../../types";
import styles from "./Room.module.css"
import { getBorderColor } from "../../utils";

const RoomCard: React.FC<IRoomCard> = ({ room }) => {

    const navigate = useNavigate();

    return (
        <div key={room.roomId} onClick={() => navigate(`/room/${room.roomId}`) } className="bg-[#1d1d1d] px-8 py-4 rounded-lg cursor-pointer">
            <h3 className="text-[17px]">{room.topic}</h3>
            <div className={`${styles.speakers} ${room.speakers?.length === 1 ? styles.singleSpeaker : ''}`}>
                <div className={styles.avatars}>
                    {room.speakers?.map((speaker) => {
                        return (
                            <img key={speaker.id} style={{
                                borderWidth : "3px",
                                borderStyle : "solid",
                                borderColor : getBorderColor()
                            }} src={speaker.avatar} alt="avatar" className="avatar_img" />
                        )
                    })}
                </div>
                <div className="flex items-center flex-col">
                    {room.speakers?.map((speaker) => {
                        return (
                            <div key={speaker.id} className="flex flex-row items-center mr-5">
                                <span className="text-[12px]" >{speaker.name}</span>
                                <img src="/images/chat-bubble.png" alt="mic" className="ml-2" width={13} height={13} />
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="flex items-center gap-2 justify-end ">
                <span className="text-[14px] font-bold">{room.speakers?.length} </span>
                <img src="/images/user-icon.png" alt="usericon" width={15} height={15} />
            </div>
        </div>
    );
};

export default RoomCard;
