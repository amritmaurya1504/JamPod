import { Button, Card } from '../shared';
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp } from '../../http';
import { setAuth, setOtp } from '../../redux/slices/userSlice';
import { useCountdown } from '../../hooks/useCountdown';
import { enqueueSnackbar } from 'notistack';
import { AxiosResponse } from 'axios';
import { IAuth, IUser } from '../../types';

const StepOTP:React.FC = () => {
  const [resendTrigger, setResendTrigger] = useState<number>(0); // Updated state to trigger countdown update
  const { displayTime, isExpired } = useCountdown({ initialTimeInSeconds: 2 * 60 });
  const { email, hash } = useSelector((state: any) => state.auth.otp);
  const [otpArray, setOtpArray] = useState<string[]>(new Array(4).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null]);
  const dispatch = useDispatch();

  const handleOtpChange = ({ target }: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const { value } = target;
    if (!isNaN(parseInt(value))) {
      setOtpArray([...otpArray.map((d:string, idx:number) => (idx === index) ? value : d)]);

      // Move focus to the next input field when a digit is entered
      if (value !== '' && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }

  const handleClearOtp = (): void => {
    // Clear all OTP digits and move focus to the first input field
    setOtpArray(new Array(4).fill(""));
    inputRefs.current[0]?.focus();
  };

  const submit = async ():Promise<void> => {
    try {
      const otp = parseInt(otpArray.join(''), 10);
      if (isNaN(otp) || !email || !hash) {
        return;
      }
      const { data }:AxiosResponse<IUser> = await verifyOtp({ otp, email, hash });
      dispatch(setAuth(data));
    } catch (err: any) {
      enqueueSnackbar(err.response.data.message, {
        variant: "error"
      })
    }
  };

  const handleResendOtp = async ():Promise<void> => {
    try {
      const { data }:AxiosResponse<IAuth> = await sendOtp({ email });
      dispatch(setOtp({ email: data.email, hash: data.hash }))

      // Trigger countdown update by incrementing the state
      setResendTrigger((prevTrigger) => prevTrigger + 1);
    } catch (error:any) {
      enqueueSnackbar(error.response.data.message, {
        variant : "error"
      })
    }
  }

  return (
    <>
      <div className='flex items-center justify-center mt-24'>
        <Card title="Enter the code we just texted you" icon='images/lock-emoji.png'>
          <div className="flex items-center justify-center">
            {otpArray.map((digit, index) => (
              <input
                key={index}
                type="text"
                name="otp"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                className="w-12 h-12 text-center  rounded-md mx-1 bg-[#323232] text-white-500 outline-none "
                ref={(ref) => (inputRefs.current[index] = ref)}
              />
            ))}
            <button
              type="button"
              className="w-8 h-8 bg-red-500 bg-[#323232] text-indigo-500 ml-1 font-bold rounded-full"
              onClick={handleClearOtp}
            >
              X
            </button>
          </div>
          {
            isExpired ? (
              <span className="text-xs text-indigo-500 mt-2 cursor-pointer" onClick={handleResendOtp} >Resend OTP</span>
            ) : (
              <p className='text-xs mt-2' >OTP Expires in <span className='font-semibold'>{displayTime}</span></p>
            )
          }
          <div className='mt-9'>
            <div>
              <Button title="Next" icon='arrow-forward.png' onClick={submit} />
            </div>
            <p className='text-[#c4c5c5] w-[70%] m-auto text-[12px] mt-5'>
              By entering the OTP sent to your email, you’re confirming your agreement to our <a href="/" className='text-indigo-500' >Terms of Service</a> and <a href="" className='text-indigo-500' >Privacy Policy</a>. Thanks!
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default StepOTP;
