import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { IAuth, IStepsCompo } from '../../types';
import { sendOtp } from '../../http';
import { TextInput, Button, Card } from "../shared";
import { setOtp } from '../../redux/slices/userSlice';
import { enqueueSnackbar } from 'notistack';
import { AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

const StepEmail: React.FC<IStepsCompo> = ({ onNext }) => {
  const [emailId, setEmailId] = useState<string>('');
  const dispatch = useDispatch();

  const sendOtpMutation = useMutation({
    mutationFn : () => {
      return sendOtp({email : emailId})
    },
    onSuccess: (data: AxiosResponse<IAuth>) => {
      if (data) {
        dispatch(setOtp({ email: data.data.email, hash: data.data.hash }));
      }
      enqueueSnackbar('✅ OTP Sent!');
      onNext();
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response?.data.message, {
        variant: 'error',
      });
    },
  });

  const submit = () => {
    if(!emailId) return;

    sendOtpMutation.mutate()
  }

  return (
    <>
      <div className='flex items-center justify-center mt-20'>
        <div>
          <div className='mb-4 flex' >
            <button
              className="w-12 h-12 bg-orange-500 p-2 rounded-lg cursor-pointer "
            >
              <img src="/images/mail-white.png" alt="email" width={30} height={30} />
            </button>
            <button
              className="w-12 h-12 bg-black-700 p-2 rounded-lg cursor-pointer ml-3" onClick={() => alert("This feature is under development!")}
            >
              <img src="/images/phone-white.png" alt="phone" width={30} height={30} />
            </button>
          </div>
          <Card title="Enter your email id" icon="images/email-emoji.png">
            <TextInput placeholder="example@mail.com" value={emailId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailId(e.target.value)} />
            <div className='mt-9'>
              <div>
                <Button title="Next" icon='arrow-forward.png' onClick={submit} />
              </div>
              <p className='text-[#c4c5c5] w-[70%] m-auto text-[12px] mt-5' >By entering your email id, you’re agreeing to our <a href="" className='text-indigo-500' >Terms of Service</a> and <a href="/" className='text-indigo-500' >Privacy Policy</a>. Thanks!</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default StepEmail
