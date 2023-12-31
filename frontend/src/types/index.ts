import { ReactNode } from "react";

export interface IStepsCompo {
  onNext: () => void;
}

export interface ISteps {
  [key: number]: React.FC<{ onNext: () => void }>
}

export interface IEmail {
  email: string | "";
}

export interface IAuth extends IEmail {
  hash: string | "";
}

export interface IVerifyOTP extends IAuth {
  otp: number;
}

export interface IState {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  activated: boolean;
  createdAt: string;
  muted?: boolean
}
export interface IUser {
  user: IState | null;
  auth: boolean;
}

export interface IActivate {
  name: string | '';
  avatar: string | '';
}

export interface IStoreUser {
  isAuth: boolean;
  user: IState | null;
  otp: IAuth;
}

export interface ICreateRoom {
  roomType: string;
  topic: string;
}

export interface RouteProps {
  children: React.ReactNode;
}

export interface ICountdown {
  initialTimeInSeconds: number;
  dependencies?: any[];
}

export interface ICountdownResult {
  displayTime: string;
  isExpired: boolean;
}

export interface IRoomCard {
  room: {
    roomId: string;
    topic: string;
    ownerId: string;
    speakers: {
      id: string;
      name: string;
      avatar: string;
    }[];
    totalPeoples: number;
  };
}

export interface IRoom {
  roomId: string;
  topic: string;
  ownerId: string;
  speakers: {
    id: string;
    name: string;
    avatar: string;
  }[];
  totalPeoples: number;
}
export interface IButton {
  title?: string,
  onClick?: () => void,
  icon?: string,
  iconPosition?: string
}

export interface IButtonOutline {
  title: string,
  url?: string | undefined
}

export interface IButtonPrimary {
  title: string,
  onClick?: () => void,
  url?: string | undefined,
  addClass?: string
}

export interface ICard {
  title?: string,
  icon?: string,
  children: ReactNode
}

export interface ITextInput {
  placeholder?: string
  value?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  fullWidth?: string
}

export interface ISocketOptions {
  'force new connection'?: boolean;
  reconnectionAttempt?: number | 'Infinity';
  timeout?: number;
  transports?: string[];
}