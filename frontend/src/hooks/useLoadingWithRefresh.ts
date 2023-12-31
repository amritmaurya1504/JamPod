import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../redux/slices/userSlice";
import { IUser } from "../types";
import { enqueueSnackbar } from "notistack";

interface IUseLoadingResult {
  loading: boolean;
}

export const useLoadingWithRefresh = (): IUseLoadingResult => {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  useEffect(() => {
    // immediately invoke function
    (async (): Promise<void> => {
      try {
        const { data }: AxiosResponse<IUser> = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/v1/refresh`,
          {
            withCredentials: true,
          }
        );
        dispatch(setAuth(data));
      } catch (error: any) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { loading };
};
