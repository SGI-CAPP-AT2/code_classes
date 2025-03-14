import path from "path";
// PORTS
export const LOGIN_PORT = 61109;
export const SERVER_PORT = 3000;
// PATHS FOR INSTALLATION
export const INSTALL_DIR = import.meta.dirname;
export const APP_DIR = path.join(INSTALL_DIR, ".code_classes");
// PATHS FOR USER DETAILS
export const USER_DETAILS_DIR = path.join(APP_DIR, ".user");
export const USER_DETAILS_FILE = path.join(USER_DETAILS_DIR, "user.json");
export const USER_TOKEN_FILE = path.join(USER_DETAILS_DIR, ".token");
// PATHS FOR PAGES DIRECTORY
export const PAGES_DIR = path.join(INSTALL_DIR, "pages");
export const PAGES_LOGIN_SUCESS = path.join(PAGES_DIR, "loginSuccessful.html");
// API ENDPOINTS
export const GOOGLE_USER_DETAILS_API =
  "https://www.googleapis.com/oauth2/v1/userinfo?access_token=%ACCESS_TOKEN%";

export const AUTH_URL = `http://localhost:${SERVER_PORT}/auth/google`;
