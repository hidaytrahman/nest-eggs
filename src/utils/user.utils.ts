// user utils

import { User } from "src/types/user.types";

export const getFullName = (
  user: User,
):
  | string
  | {
      message: string;
    } => {
  if (user) {
    return `Mr ${user.firstName} ${user.lastName}`;
  } else {
    return {
      message: "No user",
    };
  }
};
export {};
