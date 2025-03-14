export class User {
  /**
   * Class which represents User
   * @param {{ id : Number, picture : string, family_name : string, given_name : string, name : string, verified_email : boolean, email : string, err:boolean=false }} object
   */
  constructor({
    id,
    picture,
    family_name,
    given_name,
    name,
    verified_email,
    email,
    err = false,
  }) {
    this.id = id;
    this.picture = picture;
    this.family_name = family_name;
    this.given_name = given_name;
    this.name = name;
    this.verified_email = verified_email;
    this.email = email;
    this.err = err;
  }
}
