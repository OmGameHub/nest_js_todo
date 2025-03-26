import { Response } from "express";

export default class Helpers {
  static clearCookies(res: Response) {
    res.clearCookie("access_token");
  }

  static setCookies(
    res: Response,
    name: string,
    value: string,
    expires?: number,
  ) {
    res.cookie(name, value, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: expires,
      path: "/",
    });
  }
}
