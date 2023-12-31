import React, { useEffect, useState } from 'react'
import { Button, Card } from '../shared'
import { useDispatch, useSelector } from 'react-redux'
import { activate } from '../../http'
import { setAuth } from '../../redux/slices/userSlice'
import { setAvatar } from '../../redux/slices/activateSlice'
import { getAvatar } from '../../utils'
import "./Steps.css";
import Loader from '../shared/Loader'
import { enqueueSnackbar } from 'notistack'
import { AxiosResponse } from 'axios'
import { IUser } from '../../types'

const StepAvatar:React.FC = () => {
  const { name, avatar } = useSelector((state: any) => state.activate);
  const [image, setImage] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const url: string = getAvatar();
    setImage(url);
    dispatch(setAvatar(url));
  }, [])

  const submit = async (): Promise<void> => {
    if (!name || !avatar) return;
    setLoading(true);
    try {
      const { data }: AxiosResponse<IUser> = await activate({ name, avatar })
      if (data.auth) {
        dispatch(setAuth(data));
      }
    } catch (err: any) {
      enqueueSnackbar(err.response.data.message, {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  const captureImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = function () {
        const imageBase64 = reader.result;
        // console.log(imageBase64);
        setImage(imageBase64);
        dispatch(setAvatar(imageBase64));
      };
    }
  };

  if (loading) return <Loader message="Activation in progress..." />
  return (
    <div className='flex items-center justify-center mt-20'>
      <Card title={`Okay, ${name}!`} icon='images/monkey-emoji.png'>
        <p className='text-xs text-[#c0c0c0] -mt-2' >How's this photo</p>
        <div className='flex items-center justify-center mt-2'>
          <div className='avatar_wrapper' >
            <img src={image} alt='image' width={100} height={100} className='avatar_image' />
          </div>
        </div>
        <div className='mt-2'>
          <input
            onChange={captureImage}
            type='file'
            id='avatarInput'
            className='hidden' />
          <label
            htmlFor="avatarInput"
            className='text-indigo-500 text-xs cursor-pointer'>
            Choose a different one.
          </label>
        </div>
        <div className='mt-4' >
          <Button title="Next" icon='arrow-forward.png' onClick={submit} />
        </div>
      </Card>
    </div>
  )
}

export default StepAvatar
