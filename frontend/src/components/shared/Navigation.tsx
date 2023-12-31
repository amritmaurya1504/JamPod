import { Link } from 'react-router-dom'
import Button from './Button'
import { useDispatch, useSelector } from 'react-redux'
import "./Shared.css";
import { setAuth } from '../../redux/slices/userSlice';
import { logout } from '../../http';
import { AxiosResponse } from 'axios';
import { IUser } from '../../types';
import { enqueueSnackbar } from 'notistack';

const Navigation:React.FC = () => {
    const { isAuth, user } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const handleLogout = async ():Promise<void> => {
        try {
            const { data }:AxiosResponse<IUser> = await logout();
            dispatch(setAuth(data));
        } catch (error:any) {
            enqueueSnackbar(error.response.data.message, {
                variant : "error"
            })
        }
    }

    return (
        <div>
            <nav className="max-w-screen-xl mt-4 px-6 sm:px-8 lg:px-16 mx-auto grid grid-flow-col py-3 sm:py-4">
                <Link to="/">
                    <img src="/images/jampod-high-resolution-logo-transparent.svg" alt="Logo" width={120} height={140} />
                </Link>

                {
                    (isAuth && user.activated) && (
                        <div className="col-start-10 col-end-12 font-medium flex justify-end items-center">
                            <Link to={`/profile/${user._id}`} className='profile_avatar_wrapper' >
                                <img src={user.avatar} alt="user_icon" className='profile_avatar' />
                            </Link>
                            <svg onClick={handleLogout} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 ml-4 cursor-pointer ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                            </svg>

                        </div>
                    )
                }
            </nav>
        </div>
    )
}

export default Navigation
