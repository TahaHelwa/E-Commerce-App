import { User } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @api { post } /users/register a new user
 */

export const registerUser = async (req, res, next) => {
  const { userName, password, email, gender, age, phone, userType } = req.body;
  // check if user already exists
  const user = await User.find({ email, phone });
  if (user) {
    return next(new ErrorClass("User already exists", 400));
  }
  // hash password
  const hashedPassword = hashSync(password, Number(process.env.SALT_ROUNDS));

  // create new user
  const newObject = {
    userName,
    password: hashedPassword,
    email,
    gender,
    age,
    phone,
    userType,
  };
  // save user to database
  const newUser = await User.create(newObject);
  // send jwt token
  const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(201).json({
    status: "Success",
    message: "User Created Successfully",
    user: newUser,
    token,
  });
};

/**
 * @api { post } /users/login authenticate a user
 */

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  // find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorClass("User not found", 404));
  }
  // check password
  const isMatch = compareSync(password, user.password);
  if (!isMatch) {
    return next(new ErrorClass("Invalid password", 401));
  }
  // generate jwt token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({
    status: "Success",
    message: "User authenticated successfully",
    user,
    token,
  });
};

/**
 * @api { get } /users/profile get user profile
 */

export const getUserProfile = async (req, res, next) => {
  const { _id } = req.user;

  // find user by id
  const user = await User.findById(_id);
  if (!user) {
    return next(new ErrorClass("User not found", 404));
  }
  res.json({
    status: "Success",
    message: "User profile fetched successfully",
    user,
  });
};

/**
 * @api { put } /users/update update user profile
 */

export const updateUserProfile = async (req, res, next) => {
  const { _id } = req.user;
  const { userName, email, gender, age, phone } = req.body;
  const userObject = {
    userName,
    email,
    gender,
    age,
    phone,
    password,
  };
  if (userName) userObject.userName = userName;
  if (email) userObject.email = email;
  if (gender) userObject.gender = gender;
  if (age) userObject.age = age;
  if (phone) userObject.phone = phone;
  if (password) {
    const hashedPassword = hashSync(password, Number(process.env.SALT_ROUNDS));
    userObject.password = hashedPassword;
  }

  // update user profile
  const updatedUser = await User.findByIdAndUpdate(_id, userObject, {
    new: true,
  });

  if (!updatedUser) {
    return next(new ErrorClass("User not found", 404));
  }

  res.json({
    status: "Success",
    message: "User profile updated successfully",
    user: updatedUser,
  });
};

/**
 * @api { delete } /users/delete delete user profile
 */

export const deleteUserProfile = async (req, res, next) => {
  const { _id } = req.user;

  // delete user profile
  await User.findByIdAndDelete(_id);

  res.json({
    status: "Success",
    message: "User profile deleted successfully",
  });
};
