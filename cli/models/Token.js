export class Token {
  /**
   * Class represents Secret token of user
   * @param {{ token: string, err: boolean }}
   */
  constructor({ token, err }) {
    this.token = token;
    this.err = err;
  }
}
