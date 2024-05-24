import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

import config from "../../config/config";

class Helpers {
  static async generateToken(email: string) {
    const jwtKey = config("jwt_key");

    const jwtExpirySeconds = 604800;
    // For a week

    const token = jwt.sign(
      {
        email,
      },
      jwtKey,
      {
        algorithm: "HS256",

        expiresIn: jwtExpirySeconds,
      }
    );

    return token;
  }

  static hashPassword(password: string) {
    let hashedPassword = bcrypt.hashSync(password, 10);

    return hashedPassword;
  }

  static async comparePasswords(password1: string, password2: string) {
    return await bcrypt.compare(password1, password2);
  }
}

export default Helpers;
