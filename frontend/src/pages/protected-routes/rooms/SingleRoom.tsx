import { useNavigate, useParams } from "react-router-dom"
import { Navigation } from "../../../components/shared"
import { useWebRTC } from "../../../hooks/useWebRTC";
import { useSelector } from "react-redux";
import { IRoom, IState } from "../../../types";
import styles from "../PR.module.css"
import { useEffect, useState } from "react";
import { getRoom } from "../../../http";
import { getBorderColor } from "../../../utils";
import { AxiosResponse } from "axios";


const SingleRoom: React.FC = () => {
    const { id: roomId } = useParams()
    const user: IState = useSelector((state: any) => state.auth.user);
    const [room, setRoom] = useState<IRoom | null>(null)
    const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
    const [isMute, setMute] = useState<boolean>(true)
    const navigate = useNavigate();

    useEffect(() => {
        handleMute(isMute, user._id);
    }, [isMute])

    const handleManualLeave = () => {
        navigate("/rooms");
    }

    useEffect(() => {
        const fetchRoom = async () => {
            const { data }:AxiosResponse<IRoom> = await getRoom(roomId);
            setRoom(data);
            console.log(data);
        }

        fetchRoom();
    }, [roomId]);

    const handleMuteClick = (clientId: string) => {
        if (clientId !== user._id) return;
        setMute(!isMute);
    }

    return (
        <>
            <Navigation />
            <hr className='text-[#323232]' />

            {/* SubHeader */}
            <div className='max-w-screen-xl mt-4 px-6 sm:px-8 lg:px-16 mx-auto grid grid-flow-row py-3 sm:py-4'>
                <div className="flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between ">
                    <div className="flex flex-row gap-3 items-center">
                        <img onClick={() => navigate(-1)} className="cursor-pointer" src="/images/arrow-left.png" alt="arrow" width={17} height={17} />
                        <span className={`md:text-[18px] text-[13px] font-semibold ${styles.heading}`}>All voice rooms</span>
                    </div>
                </div>
            </div>
            <div className={styles.clientwrapper} >
                <div className="flex items-center justify-between">
                    <h2 className="text-[18px] font-semibold">{room?.topic}</h2>
                    <div className="flex items-center gap-16">
                        <button className="bg-[#262626] px-4 py-2 rounded-[20px] hover:bg-[#333333] transition-all">
                            <img src="/images/palm.png" alt="palm" width={20} height={20} />
                        </button>
                        <button onClick={handleManualLeave} className="flex items-center gap-4 bg-[#262626] px-4 py-2 rounded-[20px] hover:bg-[#333333] transition-all">
                            <img src="/images/win.png" alt="win" width={20} height={20} />
                            <span>Leave quietly</span>
                        </button>
                    </div>
                </div>
                <h3 className="mt-5 text-sm text-[#888888]">Host</h3>
                <div className={styles.clientList}>
                    {
                        room?.speakers.map((speaker) => {
                            return (
                                <div onClick={() => navigate(`/profile/${speaker.id}`)} className="flex flex-col items-center cursor-pointer" key={speaker.id}>
                                    <div className={`relative bg-[#fff8f9] w-[100px] h-[100px] rounded-[50%]`} style={{
                                        borderColor: "#5453e0",
                                        borderWidth: "4px",
                                        borderStyle: "solid"
                                    }} >
                                        <audio
                                            ref={(instance) => provideRef(instance, speaker.id)}
                                            autoPlay>
                                        </audio>
                                        <img src={speaker.avatar} width={30} alt="avatar" height={30} className="w-[100%] h-[100%] rounded-[50%]" />
                                    </div>
                                    <h4 className="text-[14px] mt-2">{speaker.name}</h4>
                                </div>
                            )
                        })
                    }
                </div>
                <hr className='text-[#323232] mt-5' />
                <h3 className="mt-5 text-sm text-[#888888]">Guests in the room</h3>
                <div className={styles.clientList}>
                    {
                        typeof clients === "object" && clients.map((client: IState) => {
                            return (
                                <>
                                    <div className="flex flex-col items-center cursor-pointer " key={client._id}>
                                        <div className={`relative bg-[#fff8f9] w-[100px] h-[100px] rounded-[50%]`} style={{
                                            borderColor: getBorderColor(),
                                            borderWidth: "4px",
                                            borderStyle: "solid"
                                        }} >
                                            <audio
                                                ref={(instance) => provideRef(instance, client._id)}
                                                autoPlay>
                                            </audio>
                                            <img src={client.avatar} width={30} alt="avatar" height={30} className="w-[100%] h-[100%] rounded-[50%]" />

                                            <button onClick={() => handleMuteClick(client._id)} className={styles.micBtn}>
                                                {
                                                    client.muted ? (
                                                        <img src="/images/mic-mute.png" alt="mic-mute-png" />
                                                    ) : (
                                                        <img src="/images/mic.png" alt="mic-png" />
                                                    )
                                                }
                                            </button>
                                        </div>
                                        <h4 onClick={() => navigate(`/profile/${client._id}`)} className="text-[14px] mt-3">{client.name}</h4>
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default SingleRoom
