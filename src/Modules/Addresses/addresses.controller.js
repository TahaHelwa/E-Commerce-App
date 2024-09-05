import { Address, User } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/error-class.utils.js";

/**
 * @api {post} /users/addAddress Add a new address for the user
 */
export const addAddress = async (req, res, next) => {
  const { _id } = req.user;
  const {
    country,
    postalCode,
    city,
    street,
    houseNumber,
    addressLabel,
    setAsDefault,
  } = req.body;
  // cities validation
  // const cities = await axios.get(
  //   `https://api.api-ninjas.com/v1/city?country=EG&limit=30`,
  //   {
  //     headers: {
  //       "x-api-key": process.env.CITY_API_KEY,
  //     },
  //   }
  // );
  // console.log(cities);

  // const isCityExist = cities.data.find((c) => c.name === city);
  // if (!isCityExist) {
  //   return next(new ErrorClass(400, "Invalid city"));
  // }
  // If setAsDefault is true, reset all other addresses' isDefault to false
  if (setAsDefault) {
    await Address.updateMany(
      { userId: _id, isDefault: true },
      { isDefault: false }
    );
  }

  const newAddressInstance = new Address({
    userId: _id,
    country,
    postalCode,
    city,
    street,
    houseNumber,
    addressLabel,
    isDefault: !!setAsDefault,
  });

  await newAddressInstance.save();

  const updateUser = await User.findByIdAndUpdate(
    _id,
    { $push: { addressId: newAddressInstance._id } },
    { new: true }
  ).populate("addressId");

  return res.status(201).json({
    status: "success",
    message: "New address added successfully",
    data: updateUser,
  });
};

/**
 * @api {get} /users/addresses Get user's addresses
 */
export const getAddresses = async (req, res, next) => {
  const { _id } = req.user;

  const userAddresses = await Address.find({
    userId: _id,
    isMarkedAsDeleted: false,
  });
  return res.status(200).json({
    status: "success",
    message: "User's addresses fetched successfully",
    data: userAddresses,
  });
};

/**
 * @api {put} /users/addresses/:addressId Update an existing address
 */
export const updateAddress = async (req, res, next) => {
  const { _id } = req.user;
  const { addressId } = req.params;
  const {
    country,
    postalCode,
    city,
    street,
    houseNumber,
    addressLabel,
    setAsDefault,
  } = req.body;

  const address = await Address.findById(addressId);
  if (!address) {
    return next(new ErrorClass("Address not found", 404));
  }

  if (setAsDefault) {
    await Address.updateMany(
      { userId: _id, isDefault: true },
      { isDefault: false }
    );
    address.isDefault = true;
  }

  if (country) address.country = country;
  if (postalCode) address.postalCode = postalCode;
  if (city) address.city = city;
  if (street) address.street = street;
  if (houseNumber) address.houseNumber = houseNumber;
  if (addressLabel) address.addressLabel = addressLabel;

  await address.save();

  const updatedUser = await User.findById(_id).populate("addressId");
  return res.status(200).json({
    status: "success",
    message: "Address updated successfully",
    data: updatedUser,
  });
};

/**
 * @api {delete} /users/addresses/:addressId Delete an address (soft delete)
 */
export const deleteAddress = async (req, res, next) => {
  const { _id } = req.user;
  const { addressId } = req.params;

  const address = await Address.findById(addressId);
  if (!address) {
    return next(new ErrorClass("Address not found", 404));
  }

  // Soft delete: Mark the address as deleted instead of removing it
  address.isMarkedAsDeleted = true;
  await address.save();

  const updateUser = await User.findByIdAndUpdate(
    _id,
    { $pull: { addressId: address._id } },
    { new: true }
  ).populate("addressId");

  return res.json({
    status: "success",
    message: "Address deleted successfully",
    data: updateUser,
  });
};
