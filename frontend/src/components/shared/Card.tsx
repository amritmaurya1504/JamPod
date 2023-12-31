import React from 'react'
import { ICard } from '../../types'

const Card:React.FC<ICard> = ({ title, icon, children }) => {
    return (
        <div className='w-[500px] max-w-[90%] min-h-[300px] bg-black-700 p-[30px] rounded-[20px] text-center '>
            <div className='flex items-center justify-center mb-[20px]'>
                {icon && <img src={`/${icon}`} alt="logo" width={30} height={30} />}
                <h1 className={`text-md font-semibold text-white-500 ml-3`} >{title}</h1>
            </div>
            {children}
        </div>
    )
}

export default Card
