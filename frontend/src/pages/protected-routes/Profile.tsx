import React, { useEffect, useState } from 'react'
import { Button, Navigation } from '../../components/shared'
import styles from "./PR.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { getUser, getUserSpecificRoom } from '../../http';
import { AxiosResponse } from 'axios';
import { IRoom, IState } from '../../types';

import { useQuery } from '@tanstack/react-query';

const Profile: React.FC = () => {
    const { id } = useParams(); // Fetching parameters from the URL
    const navigate = useNavigate(); // Accessing navigation function

    const { data: user } = useQuery({ // Fetching user data based on ID using React Query
        queryKey: ["user", id], // Unique query key based on user ID
        queryFn: async (): Promise<AxiosResponse<IState>> => { // Function to fetch user data
            return await getUser(id); // Calling the function to get user data
        }
    });

    const { data: rooms } = useQuery({ // Fetching user-specific rooms using React Query
        queryKey: ["rooms", id], // Unique query key based on user ID
        queryFn: async (): Promise<AxiosResponse<IRoom[]>> => { // Function to fetch user-specific rooms
            return await getUserSpecificRoom(id); // Calling the function to get user-specific rooms data
        }
    });

    return (
        <>
            <Navigation />
            <hr className='text-[#323232]' />

            {/* SubHeader */}
            <div className='max-w-screen-xl mt-4 px-6 sm:px-8 lg:px-16 mx-auto grid grid-flow-row py-3 sm:py-4'>
                <div className="">
                    <div className="flex items-center gap-3">
                        <img onClick={() => navigate(-1)} className="cursor-pointer" src="/images/arrow-left.png" alt="arrow" width={15} height={17} />
                        <span className={`md:text-[18px] text-[13px] font-semibold ${styles.heading}`}>Profile</span>
                    </div>
                </div>

                <div className='flex items-center flex-col md:flex-row md:justify-between gap-8 md:gap-0 mt-[40px] md:mt-[80px]'>
                    <div className='flex items-center flex-col w-[400px] gap-6'>
                        <div className='flex items-center justify-between w-[100%]'>
                            <div className='flex items-center gap-3'>
                                <div className={`relative bg-[#fff8f9] w-[80px] h-[80px] rounded-[50%]`} style={{
                                    borderColor: "#5453e0",
                                    borderWidth: "4px",
                                    borderStyle: "solid"
                                }} >
                                    <img src={user?.data.avatar} width={30} alt="avatar" height={30} className="w-[100%] h-[100%] rounded-[50%]" />
                                </div>
                                <div className='flex items-start flex-col'>
                                    <h3 className='font-bold text-[20px]'>{user?.data.name}</h3>
                                    <span className='text-xs text-[#c4c5c5]'>@username</span>
                                </div>
                            </div>
                            <Button title='Follow' />
                        </div>
                        <p className='text-[#c4c5c5] text-[15px]'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur consequuntur dolorum sit officia culpa numquam dicta maiores fugiat labore alias!
                        </p>
                    </div>
                    <div className='flex items-center flex-row gap-10 bg-[#1d1d1d] rounded-[10px] p-5'>
                        <div className='flex items-center flex-col gap-1'>
                            <h2 className='text-[20px] font-bold'>25</h2>
                            <span className='text-[14px] text-[#C4C5C5]'>Followers</span>
                        </div>
                        <div className='flex items-center flex-col gap-1'>
                            <h2 className='text-[20px] font-bold'>0</h2>
                            <span className='text-[14px] text-[#C4C5C5]'>Following</span>
                        </div>
                    </div>
                </div>


                <div className='mt-10 w-full md:w-[400px] max-w-[95%]  md:max-w-[80%]'>
                    {rooms && <h3 className='text-[15px] font-bold mb-4'>Rooms</h3>}
                    <div>
                        {
                            rooms?.data.map((room: IRoom) => {
                                return (
                                    <div className='bg-[#1d1d1d] px-8 py-4 rounded-lg cursor-pointer mb-3 flex items-center gap-3' key={room.roomId}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500">
                                            <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                                            <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                                        </svg>

                                        <span>{room.topic}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

            </div>
        </>
    )
}

export default Profile
