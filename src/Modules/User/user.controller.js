import { Address, User } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @api {post} /users/register Register a new user
 */
export const registerUser = async (req, res, next) => {
  const {
    userName,
    password,
    email,
    gender,
    age,
    phone,
    userType,
    country,
    postalCode,
    street,
    houseNumber,
    addressLabel,
    city,
  } = req.body;

  // check if user already exists
  const user = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (user) {
    return next(new ErrorClass("User already exists", 400));
  }

  // hash password
  const hashedPassword = hashSync(password, Number(process.env.SALT_ROUNDS));

  // create new user
  const newUser = new User({
    userName,
    password: hashedPassword,
    email,
    gender,
    age,
    phone,
    userType,
  });

  // create new address instance
  const addressInstance = new Address({
    userId: newUser._id,
    country,
    postalCode,
    street,
    houseNumber,
    addressLabel,
    city,
    isDefault: true,
  });

  // Save the user and the address
  await newUser.save();
  await addressInstance.save();

  // send jwt token
  const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(201).json({
    status: "Success",
    message: "User Created Successfully",
    user: newUser,
    address: addressInstance,
    token,
  });
};

/**
 * @api {post} /users/login Authenticate a user
 */
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorClass("User not found", 404));
  }
  const isMatch = compareSync(password, user.password);
  if (!isMatch) {
    return next(new ErrorClass("Invalid password", 401));
  }
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
 * @api {get} /users/profile Get user profile
 */
export const getUserProfile = async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id).populate("addressId", "-_id");

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
 * @api {put} /users/update Update user profile
 */
export const updateUserProfile = async (req, res, next) => {
  const { _id } = req.user;
  const { userName, email, gender, age, phone, password } = req.body;

  const userObject = {};
  if (userName) userObject.userName = userName;
  if (email) userObject.email = email;
  if (gender) userObject.gender = gender;
  if (age) userObject.age = age;
  if (phone) userObject.phone = phone;
  if (password) {
    const hashedPassword = hashSync(password, Number(process.env.SALT_ROUNDS));
    userObject.password = hashedPassword;
  }

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
 * @api {delete} /users/delete Delete user profile
 */
export const deleteUserProfile = async (req, res, next) => {
  const { _id } = req.user;

  // Soft delete user
  await User.findByIdAndUpdate(_id, { isMarkedAsDeleted: true });

  res.json({
    status: "Success",
    message: "User profile deleted successfully",
  });
};
