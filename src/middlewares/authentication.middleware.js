import jwt from "jsonwebtoken";
import { User } from "../../DB/Models/index.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authentication;

    if (!token) return res.status(400).json({ msg: "Please login first!" });

    // check the key phrase between backend and frontend
    if (!token.startsWith("ToTi "))
      return res.status(400).json({ msg: "Invalid token format" });

    // split the original token to decode it .
    const originalToken = token.split(" ")[1];

    const decodedToken = jwt.verify(originalToken, process.env.JWT_SECRET);

    if (!decodedToken?._id)
      return res.status(400).json({ msg: "Invalid token" });

    const user = await User.findById(decodedToken._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ msg: "Token is not valid", error: error.message });
  }
};
