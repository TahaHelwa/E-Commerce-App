import { Product, Cart } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";
/**
 * @API {post} /carts/create - Create a new
 */

export const createCart = async (req, res, next) => {
  const userId = req.user._id;
  const { quantity } = req.body;
  const { productId } = req.params;

  // get product details
  const product = await Product.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });

  // check if product already exists with quantity needed
  if (!product) {
    return next(new ErrorClass("Product not found", 404, "Product not found"));
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    const subTotal = quantity * product.appliedPrice;
    const newCart = new Cart({
      userId,
      products: [
        { productId: product._id, quantity, price: product.appliedPrice },
      ],
      subTotal,
    });
    await newCart.save();
    return res
      .status(201)
      .json({ message: "Product added to cart successfully", cart: newCart });
  }

  // check if product already exists in cart
  const productExists = cart.products.find((p) => p.productId == productId);

  if (productExists) {
    return next(new ErrorClass("Product is already in cart", 404));
  }

  cart.products.push({
    productId: product._id,
    quantity,
    price: product.appliedPrice,
  });
  cart.subTotal += quantity * product.appliedPrice;

  await cart.save();

  return res
    .status(200)
    .json({ message: "Product added to cart successfully", cart });
};

/**
 * @API {get} /carts/get - Get all cart items
 */

export const getCart = async (req, res, next) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId: userId });
  if (!cart) {
    return next(new ErrorClass("cart not found", 404));
  }

  return res.json({ message: "Cart items", cart });
  // TODO:calculate the total price for the cart items.
};

/**
 * @API {put} /carts/update/:productId - Update an existing cart
 */

export const updateCart = async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ userId, "products.productId": productId });
  if (!cart) {
    return next(new ErrorClass("product not in the cart", 404));
  }
  // check quantity availble in the product stock
  const product = await Product.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });
  if (!product) {
    return next(new ErrorClass("Product not found or not in stock", 404));
  }
  // update quantity
  const productIndex = await cart.products.findIndex(
    (p) => p.productId.toString() == product._id.toString()
  );
  cart.products[productIndex].quantity = quantity;
  // change subtotal after update product quantity in the cart
  cart.subTotal = 0;
  cart.products.forEach((product) => {
    cart.subTotal += product.quantity * product.price;
  });
  await cart.save();
  return res.json({ message: "Cart updated successfully", cart });
};

/**
 * @API {put} /carts/remove/:productId - Delete a cart
 */

export const removeFromTheCart = async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;
  // check if the product is already in the cart by productId or not
  const cart = await Cart.findOne({ userId, "products.productId": productId });
  if (!cart) {
    return next(new ErrorClass("cart not found", 404));
  }
  // ubdate cart after remove product from the cart
  cart.products = cart.products.filter(
    (product) => product.productId != productId
  );
  // check if cart is empty after remove product from the cart
  if (cart.products.length === 0) {
    await Cart.deleteOne({ userId });
    return res.json({ message: "Cart is deleted" });
  }
  // change subtotal after remove product from the cart
  cart.subTotal = 0;
  cart.products.forEach((product) => {
    cart.subTotal += product.quantity * product.price;
  });
  await cart.save();
  return res.json({ message: "Product removed from cart", cart });
};
