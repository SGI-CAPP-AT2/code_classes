export class ServerPath {
  /**
   * This is the path of the server.
   * @param {String} path
   */
  constructor(path, fn, method = "GET") {
    this.path = path;
    this.fn = fn;
    this.method = method;
  }
  /**
   * This function is used to execute the function of the path.
   * @param {Request} req
   * @param {Response} res
   */
  async execute(req, res) {
    if (!this.fn) {
      res.statusCode = 404;
      res.end(); // TODO: html page for 404
      return;
    }
    if (this.method !== req.method) {
      res.statusCode = 405;
      res.end(); // TODO: html page for 405
      return;
    }
    this.completeHandler(await this.fn(req, res));
  }
  dispose() {
    this.fn = null;
  }
  onCompleteTask(handler) {
    this.completeHandler = handler;
  }
}
