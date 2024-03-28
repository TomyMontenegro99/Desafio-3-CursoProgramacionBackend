const { Router } = require("express");
const router = Router();
const ProductManager = require("../managers/productManager");

const productManager = new ProductManager('./data/products.json');

router.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    const returnProducts = await productManager.getProducts(limit, page, sort, query);

    const totalProducts = await productManager.getTotalProducts();
    const totalPages = Math.ceil(totalProducts / limit);

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    const prevLink = hasPrevPage ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
    const nextLink = hasNextPage ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;

    res.status(200).json({
      status: "success",
      payload: returnProducts,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const product = await productManager.getProductById(id);
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, price, thumbnails, code, stock, status, category } = req.body;
    const product = await productManager.addProduct(title, description, price, thumbnails, code, stock, status, category);
    res.status(201).json({ status: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const { title, description, price, thumbnails, code, stock, status, category } = req.body;
    const product = await productManager.updateProduct(id, title, description, price, thumbnails, code, stock, status, category);
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    await productManager.deleteProduct(id);
    res.status(200).json({ status: "success", message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

module.exports = router;
