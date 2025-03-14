import { ServerConfig } from "./ServerConfig.js";
import express from "express";

/**
 *
 * @param {ServerConfig} serverConfig
 */
export const startServer = (serverConfig) => {
  const app = express();
  app.all("*", (req, res) => {
    serverConfig.executeOnPath(req.path, req, res);
  });
  // console.log("Server being started on port " + serverConfig.port);
  app.listen(serverConfig.port, () => {
    // console.log("Server started on port " + serverConfig.port);
  });
};
