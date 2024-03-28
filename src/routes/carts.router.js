const { Router } = require("express");
const router = Router();
const CartManager = require("../managers/cartManager");

const cartManager = new CartManager('./data/carts.json');

router.post("/", async (req, res) => {
  try {
    const { products } = req.body;
    const cart = await cartManager.addCart(products);
    res.status(201).json({ status: "success", data: cart });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const id = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(id);
    res.status(200).json({ status: "success", data: cart });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const id = parseInt(req.params.cid);
    const { products } = req.body;
    const cart = await cartManager.updateCart(id, products);
    res.status(200).json({ status: "success", data: cart });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const { quantity } = req.body;
    const updatedCart = await cartManager.updateCartItem(cartId, productId, quantity);
    res.status(200).json({ status: "success", data: updatedCart });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    await cartManager.removeCartItem(cartId, productId);
    res.status(200).json({ status: "success", message: "Product removed from cart" });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const id = parseInt(req.params.cid);
    await cartManager.deleteCart(id);
    res.status(200).json({ status: "success", message: "Cart deleted" });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

module.exports = router;
