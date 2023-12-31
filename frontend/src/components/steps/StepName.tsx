import { IStepsCompo } from '../../types'
import React, { useState } from 'react'
import { Button, Card, TextInput } from '../shared'
import { useDispatch, useSelector } from 'react-redux';
import { setName } from '../../redux/slices/activateSlice';

const StepName: React.FC<IStepsCompo> = ({ onNext }) => {
  const { name } = useSelector((state: any) => state.activate);
  const [fullName, setFullName] = useState<string>(name);

  const dispatch = useDispatch();

  const nextStep = (): void => {
    if (!fullName) return;

    dispatch(setName(fullName))
    onNext();
  }

  return (
    <div className='flex items-center justify-center mt-20'>
      <Card title="What's your full name?" icon='images/goggle-emoji.png'>
        <TextInput placeholder='Enter Your Full Name' value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <div className='mt-9'>
          <p className='text-[#c4c5c5] w-[70%] m-auto text-[12px] mb-5'>
            Kindly grace us with your authentic identity. Your real name adds a touch of sincerity to our vibrant community! 🎵✨
          </p>
          <div>
            <Button title="Next" icon='arrow-forward.png' onClick={nextStep} />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default StepName
