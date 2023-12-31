import React from 'react'
import { ITextInput } from '../../types'

const TextInput:React.FC<ITextInput> = ({ placeholder, value, onChange, fullWidth }) => {
  return (
    <div>
      <input className={fullWidth === "true" ? `bg-[#323232] border-none py-2.5 px-5 outline-none rounded-lg text-white-500  text-[15px] placeholder:text-white-500 placeholder:text-sm placeholder:opacity-20 w-full` : 
      `bg-[#323232] border-none py-2.5 px-5 outline-none rounded-lg text-white-500  text-[15px] placeholder:text-white-500 placeholder:text-sm placeholder:opacity-20 w-[80%]`
    } type='text' value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  )
}

export default TextInput
