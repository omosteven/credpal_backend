import UserModel from "../models/user.models";

import { IUser, IUserAuth, IUserUpdate } from "../types/index";

import { Request, Response } from "express";

import Helpers from "../helpers";

import Handlers from "../handlers";

/**
  @param {Request} req
  @param {Response}  res
  @returns
**/

const { hashPassword, generateToken, comparePasswords } = Helpers;

const { authError } = Handlers;

class AuthController {
  // CREATE
  static async register(req: Request, res: Response) {
    const { email, password }: IUser = req.body || {};

    try {
      if (!email || !password) {
        return res.status(400).json({
          code: 400,
          message: "Invalid Payload",
        });
      }

      if (password?.length < 8) {
        return res.status(400).json({
          code: 400,
          message: "Password must be minimum of 8 characters",
        });
      }

      const newUser = new UserModel({
        email,
        password: hashPassword(password),
      });

      await newUser.save();

      return res.status(200).json({
        code: 200,
        message: "Account Created",
        data: email,
      });
    } catch (e) {
      return res.status(400).json({
        code: 400,
        message: authError(e, false),
      });
    }
  }

  // READ  UPDATE
  static async login(req: Request, res: Response) {
    const { email, password }: IUserAuth = req.body || {};

    try {
      if (!email || !password) {
        return res.status(400).json({
          code: 400,
          message: "Invalid Payload",
        });
      }

      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(400).json({
          code: 400,
          message: "Email or password invalid",
        });
      }

      const doPasswordsMatch = await comparePasswords(password, user?.password);

      if (!doPasswordsMatch) {
        return res.status(404).json({
          code: 400,
          message: "Email or password invalid",
        });
      }

      const newToken = await generateToken(email);

      await UserModel.updateOne({ email }, { token: newToken });

      const { first_name, last_name } = user;

      return res.status(200).json({
        message: "User logged in",
        data: { email, first_name, last_name, token: newToken },
      });
    } catch (e) {
      return res.status(400).json({
        code: 400,
        message: "An  error occurred",
      });
    }
  }

  // READ
  static async getProfile(req: Request, res: Response) {
    const { email } = req.body.user || {};

    try {
      const user = await UserModel.findOne(
        { email },
        { email: 1, first_name: 1, last_name: 1 }
      );

      if (!user) {
        return res.status(400).json({
          code: 404,
          message: "User invalid",
        });
      }

      return res.status(200).json({
        code: 200,
        message: "User fetched",
        data: user,
      });
    } catch (e) {
      return res.status(400).json({
        code: 400,
        message: "An  error occurred",
      });
    }
  }

  //DELETE
  static async deleteAccount(req: Request, res: Response) {
    const { email } = req.body.user || {};

    try {
      const user = await UserModel.deleteOne({ email });

      if (!user || user?.deletedCount === 0) {
        return res.status(400).json({
          code: 404,
          message: "User invalid",
        });
      }

      return res.status(200).json({
        code: 200,
        message: "User deleted",
      });
    } catch (e) {
      return res.status(400).json({
        code: 400,
        message: "An  error occurred",
      });
    }
  }

  // UPDATE
  static async updateProfile(req: Request, res: Response) {
    const { email } = req.body.user || {};

    const { first_name, last_name }: IUserUpdate = req.body;

    try {
      const user = await UserModel.updateOne(
        { email },
        { first_name, last_name }
      );

      if (!user || user?.matchedCount === 0) {
        return res.status(400).json({
          code: 400,
          message: "User invalid",
        });
      }

      return res.status(200).json({
        code: 200,
        message: "User updated",
      });
    } catch (e) {
      return res.status(400).json({
        code: 400,
        message: "An  error occurred",
      });
    }
  }
}

export default AuthController;
