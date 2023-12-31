import { useEffect, useState } from 'react'
import { AddRoomModal, RoomCard } from '../../../components/Rooms'
import { Button, Navigation } from '../../../components/shared'
import { getAllRooms } from '../../../http'
import { enqueueSnackbar } from 'notistack'
import { IRoom, IRoomCard } from '../../../types'
import styles from "../PR.module.css"
import { AxiosResponse } from 'axios'

const Rooms: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [rooms, setRooms] = useState<IRoom[]>();

  const handleShowModal = (): void => {
    setShowModal(true);
  }
  const handleCloseModal = (): void => {
    setShowModal(false);
  }

  useEffect(() => {
    const fetchRoom = async ():Promise<void> => {
      try {
        const { data }:AxiosResponse<IRoom[]> = await getAllRooms();
        setRooms(data);
      } catch (error: any) {
        enqueueSnackbar(error.response.data.message, {
          variant: "error"
        })
      }
    }

    fetchRoom();
  },[])

  return (
    <>
      <Navigation />
      <hr className='text-[#323232]' />

      {/* SubHeader */}
      <div className='max-w-screen-xl mt-4 px-6 sm:px-8 lg:px-16 mx-auto grid grid-flow-row py-3 sm:py-4'>
        <div className="flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between ">
          <div className="flex flex-col gap-5 md:gap-0 md:flex-row  items-center">
          <span className={`md:text-[18px] text-[13px] font-semibold ${styles.heading}`}>All voice rooms</span>
            <div className="bg-[#262626] ml-[20px] flex items-center py-1 px-10 min-w-[300px] rounded-[20px] justify-between gap-5" >
              <img src="/images/search-icon.png" alt='search_icon' width={30} height={30} />
              <input className="bg-transparent border-none outline-none p-10px w-[100%]" type='text' />
            </div>
          </div>
          <div className=''>
            <Button onClick={handleShowModal} title='Start a room' icon='add-room-icon.png' iconPosition="left" />
          </div>
        </div>

        {/* Room List */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px] lg:grid-cols-4 md:gap-[15px] lg:gap-[10px] mt-[80px]">
          {rooms?.map((room:IRoom) => (
            <>
              <RoomCard key={room.roomId} room={room} />
            </>
          ))}
        </div>
      </div>
      {
        showModal && <AddRoomModal handleCloseModal={handleCloseModal} />
      }
    </>
  )
}

export default Rooms
