import React, { useEffect, useState } from "react";
import { Button, Card } from "../shared";
import { useDispatch, useSelector } from "react-redux";
import { activate } from "../../http";
import { setAuth } from "../../redux/slices/userSlice";
import { setAvatar } from "../../redux/slices/activateSlice";
import { getAvatar } from "../../utils";
import "./Steps.css";
import Loader from "../shared/Loader";
import { enqueueSnackbar } from "notistack";
import { AxiosResponse } from "axios";
import { IUser } from "../../types";
import { useMutation } from "@tanstack/react-query";

const StepAvatar: React.FC = () => {
  // Retrieve necessary data from Redux store
  const { name, avatar } = useSelector((state: any) => state.activate);
  const [image, setImage] = useState<any>();
  const dispatch = useDispatch();

  // Fetch the initial avatar URL
  useEffect(() => {
    const url: string = getAvatar();
    setImage(url);
    dispatch(setAvatar(url));
  }, []);

  // Define the mutation using useMutation hook
  const activateMutation = useMutation({
    mutationFn: async () => {
      return await activate({ name, avatar }); // Activate function mutation
    },
    onSuccess: (data: AxiosResponse<IUser>) => {
      if (data.data.auth) {
        dispatch(setAuth(data.data)); // Set authenticated user on success
      }
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error", // Display error message using snackbar
      });
    },
  });

  // Submit function to trigger the mutation
  const submit = async (): Promise<void> => {
    if (!name || !avatar) return;
    activateMutation.mutate(); // Trigger the mutation on button click
  };

  // Function to handle uploading a new image
  const captureImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = function () {
        const imageBase64 = reader.result;
        setImage(imageBase64); // Update displayed image
        dispatch(setAvatar(imageBase64)); // Update avatar in Redux store
      };
    }
  };

  // Display loader during mutation pending state
  if (activateMutation.isPending) return <Loader message="Activation in progress..." />;
  
  // Render the component with image upload functionality
  return (
    <div className="flex items-center justify-center mt-20">
      <Card title={`Okay, ${name}!`} icon="images/monkey-emoji.png">
        <p className="text-xs text-[#c0c0c0] -mt-2">How's this photo</p>
        <div className="flex items-center justify-center mt-2">
          <div className="avatar_wrapper">
            <img
              src={image}
              alt="image"
              width={100}
              height={100}
              className="avatar_image"
            />
          </div>
        </div>
        <div className="mt-2">
          <input
            onChange={captureImage}
            type="file"
            id="avatarInput"
            className="hidden"
          />
          <label
            htmlFor="avatarInput"
            className="text-indigo-500 text-xs cursor-pointer"
          >
            Choose a different one.
          </label>
        </div>
        <div className="mt-4">
          <Button title="Next" icon="arrow-forward.png" onClick={submit} />
        </div>
      </Card>
    </div>
  );
};

export default StepAvatar;
