import { Address, User } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/error-class.utils.js";
/**
 * @api { post } /users/addAddress a new user
 */

export const addAddress = async (req, res, next) => {
  // get user id from the request
  const { addressId, _id } = req.user;
  // create a new address object
  const {
    country,
    postalCode,
    city,
    street,
    houseNumber,
    addressLabel,
    setAsDefault,
  } = req.body;

  // TODO: city validation

  // create a new address object
  const newAddressInstance = new Address({
    country,
    postalCode,
    city,
    street,
    houseNumber,
    addressLabel,
    isDefault: [true, false].includes(setAsDefault) ? setAsDefault : false,
  });
  // Save the new address to the database
  const savedAddress = await newAddressInstance.save();

  // add the new address to the user's addresses array
  const updateUser = await User.findByIdAndUpdate(
    _id,
    { $push: { addressId: savedAddress._id } },
    { new: true }
  ).populate("addressId");
  res.json({
    status: "success",
    message: "New address added successfully",
    data: updateUser,
  });
};
