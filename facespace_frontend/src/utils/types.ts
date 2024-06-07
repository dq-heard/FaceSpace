import { ReactNode } from "react";

export interface User {
  userName: ReactNode;
  _id: string;
  image: string;
}

export interface SaveType {
  _key: string;
  _type: string;
  pin: {
    _type: string;
    _ref: string;
  };
  postedBy: {
    _id?: string;
    _ref: string;
  };
  userID: string;
}

export type PinType = {
  _id: string;
  image: {
    asset: {
      url: string;
    };
  };
  postedBy: User;
  destination: string;
  save: SaveType[];
};

export type PinDetailType = PinType & {
  about: ReactNode;
  title: ReactNode;
  comments: CommentType[];
};

export interface CommentType {
  _id: string;
  postedBy: User & {
    _ref: string;
    _type: string;
  };
  comment: string;
}
