import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie =  (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      samesite: "strict",
      secure: process.env.NOVE_ENV !== "development",
    });

    return token
};
