import dayjs, { Dayjs } from "dayjs";
import {
  EditSearchTypeEnum,
  FilterTypeEnum,
  SearchTypeEnum,
} from "./enums";

export type TFormLoginParams = {
  email: string;
  password: string;
};

export type TLoginResponseData = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiredAt: string;
};

export type TPaginationResponse = {
  limit: number;
  offset: number;
  total: number;
  __typename: string;
};

export type TProvince = {
  code: string;
  id: string;
  title: string;
  __typename: string;
};



export type TAdmin = {
  avatar: string,
  createdAt: string,
  email: string,
  fullName: string
  id: string,
  phoneNumber: string,
  updatedAt: string,
  viewableAvatar: string,
}

export type TLayoutFilterItem = {
  title: string;
  type: FilterTypeEnum;
  key: string;
  onSearch?: any;
  searchConfig?: {
    type?: SearchTypeEnum;
    searchKey?: string;
  };
  options?: {
    label: string;
    value: string;
  }[];
  onChange?: (value: any) => void;
  onLoadMore?: () => void;
  value?: any;
};

export type TOption = {
  value: string;
  label: string;
};

export type ITag = {
  key: string;
  label: string;
  value: string;
};
export interface STagProps {
  tags: ITag[];
  onRemoveTag: (key: string) => void;
}

export type TProfileResponseData = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  viewableAvatar: string;
  role: string;
};
