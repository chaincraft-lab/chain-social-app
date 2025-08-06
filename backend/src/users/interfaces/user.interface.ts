import { Address } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export interface IUser {
  id: number;
  uuid: string;
  name: string;
  surname: string;
  email: string;
  username: string;
  createdAt: Date;
  isDeleted: boolean;
  isBlocked: boolean;
}

export interface IUpdateUserDetailsDto {
  userDetails: IUserDetails;
  address: Address;
}

interface IUserDetails {
  age: number;
  physicalInfo: JsonValue;
  about: string;
}

