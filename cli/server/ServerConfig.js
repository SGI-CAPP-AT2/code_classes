import { ServerPath } from "./ServerPath.js";

export class ServerConfig {
  /**
   * This is the configuration class for the server.
   * @param {ServerPath[]} paths
   */
  constructor({ paths, port }) {
    this.paths = paths;
    this.port = port;
  }
  /**
   * This function is used to execute the function of the path.
   * @param {ServerPath} path
   * @param {Request} req
   * @param {Response} res
   */
  executeOnPath(path, req, res) {
    const _path = this.paths.find((p) => p.path === path);
    if (_path) {
      _path.execute(req, res);
    } else {
      res.statusCode = 404;
      res.end();
    }
  }
}
