import {
  APP_DIR,
  GOOGLE_USER_DETAILS_API,
  USER_DETAILS_DIR,
  USER_DETAILS_FILE,
  USER_TOKEN_FILE,
} from "../GLOBALS.js";
import fs, { rm } from "fs";
import { User } from "../models/User.js";
import { Token } from "../models/Token.js";
export const getUserDetailsFromFetch = async () => {
  if (!fs.existsSync(USER_TOKEN_FILE)) return new User({ err: true });
  const token = fs.readFileSync(USER_TOKEN_FILE).toString();
  const res = await fetch(
    GOOGLE_USER_DETAILS_API.replace("%ACCESS_TOKEN%", token)
  );
  const userDetails = await res.json();
  cacheUserDetails(userDetails);
  return new User(res.ok == false ? { err: true } : userDetails);
};
export const cacheUserDetails = async (userDetails) => {
  fs.writeFileSync(USER_DETAILS_FILE, JSON.stringify(userDetails));
};
export const getUserDetailsFromCache = () => {
  if (fs.existsSync(USER_DETAILS_FILE))
    return new User(JSON.parse(fs.readFileSync(USER_DETAILS_FILE)));
  return new User({ err: true });
};
export const deleteUserDetails = async () => {
  const err = await new Promise((resolve) =>
    rm(
      USER_DETAILS_DIR,
      {
        recursive: true,
      },
      (error) => {
        resolve(error);
      }
    )
  );
  return err != null && true;
};
export const getUserToken = () => {
  if (!fs.existsSync(USER_TOKEN_FILE)) return new Token({ err: true });
  const token = fs.readFileSync(USER_TOKEN_FILE).toString();
  return new Token({ token });
};
