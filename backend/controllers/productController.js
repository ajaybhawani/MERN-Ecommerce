import Product from "../models/Product.js";

// create new product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error:", error });
  }
};

// get all product
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Server Error:", error });
  }
};

//  update  product
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({
      message: "Product updated successfully",
      updated,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error:", error });
  }
};

//  delete  product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error:", error });
  }
};
