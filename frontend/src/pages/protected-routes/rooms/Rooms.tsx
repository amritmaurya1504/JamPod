import { useEffect, useState } from "react";
import { AddRoomModal, RoomCard } from "../../../components/Rooms";
import { Button, Navigation } from "../../../components/shared";
import { getAllRooms } from "../../../http";
import { enqueueSnackbar } from "notistack";
import { IRoom, IRoomCard } from "../../../types";
import styles from "../PR.module.css";
import { AxiosResponse } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

interface IAllRooms {
  allRooms: IRoom[];
  limit: number;
  skip: number;
  total: number;
}

const Rooms: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false); // State to manage modal visibility
  
  const [searchParams, setSearchParams] = useSearchParams({ // Hook to manage URL search parameters
    skip : "0", // Default skip value if not provided in URL
    limit : "8", // Default limit value if not provided in URL
  })

  const limit = parseInt(searchParams.get("limit") || "0", 10); // Parsing limit from URL search params or defaulting to 0
  const skip = parseInt(searchParams.get("skip") || "0", 10); // Parsing skip from URL search params or defaulting to 0

  const { data, isError } = useQuery({ // Using React Query to fetch data
    queryKey: ["rooms", limit, skip], // Unique query key based on limit and skip
    queryFn: async (): Promise<AxiosResponse<any>> => { // Function to fetch rooms data
      return await getAllRooms({limit, skip}); // Calling the function to fetch rooms data
    },
    placeholderData : keepPreviousData // Keeping previous data while fetching new data
  });

  // Function to handle modal visibility
  const handleShowModal = (): void => {
    setShowModal(true);
  };

  // Function to handle modal closure
  const handleCloseModal = (): void => {
    setShowModal(false);
  };

  // Function to handle pagination navigation
  const handleMove = (moveCount:number):void => {
    setSearchParams((prev) => {
      prev.set("skip", Math.max(skip + moveCount, 0).toString()); // Updating skip parameter in URL
      return prev;
    })
  } 

  // Handling error if occurred during data fetching
  if(isError){
    enqueueSnackbar("Something went wrong!", {
      variant : "error"
    })
  }

  return (
    <>
      <Navigation />
      <hr className="text-[#323232]" />

      {/* SubHeader */}
      <div className="max-w-screen-xl mt-4 px-6 sm:px-8 lg:px-16 mx-auto grid grid-flow-row py-3 sm:py-4">
        <div className="flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between ">
          <div className="flex flex-col gap-5 md:gap-0 md:flex-row  items-center">
            <span
              className={`md:text-[18px] text-[13px] font-semibold ${styles.heading}`}
            >
              All voice rooms
            </span>
            <div className="bg-[#262626] ml-[20px] flex items-center py-1 px-10 min-w-[300px] rounded-[20px] justify-between gap-5">
              <img
                src="/images/search-icon.png"
                alt="search_icon"
                width={30}
                height={30}
              />
              <input
                className="bg-transparent border-none outline-none p-10px w-[100%]"
                type="text"
              />
            </div>
          </div>
          <div className="">
            <Button
              onClick={handleShowModal}
              title="Start a room"
              icon="add-room-icon.png"
              iconPosition="left"
            />
          </div>
        </div>

        {/* Room List */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px] lg:grid-cols-4 md:gap-[15px] lg:gap-[10px] mt-[80px]">
          {data?.data?.allRooms.map((room: IRoom) => (
            <>
              <RoomCard key={room.roomId} room={room} />
            </>
          ))}
        </div>
        <div className="flex gap-2 mt-12">
          <button
            disabled={skip < limit}
            className="bg-[#262626] hover:bg-[#333333] p-2 text-white rounded-[50%]"
            onClick={() => handleMove(-limit)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6 font-bold"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>
          <button
            disabled={limit + skip >= data?.data?.total}
            className="bg-[#262626] hover:bg-[#333333] p-2 text-white rounded-[50%]"
            onClick={() => handleMove(limit)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 font-bold"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
      {showModal && <AddRoomModal handleCloseModal={handleCloseModal} />}
    </>
  );
};

export default Rooms;
