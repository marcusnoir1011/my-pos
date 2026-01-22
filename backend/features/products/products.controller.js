import productServices from "./products.service";

class ProductController {
  async createProduct(req, res, next) {
    try {
      const product = req.body;
      const result = await productServices.createProduct(product);
      return res.json({
        success: true,
        message: "Create product successful.",
        result,
      });
    } catch (err) {
      next(err);
    }
  }
  async updateProduct(req, res, next) {
    try {
      const productId = Number(req.params.id);
      const updateData = req.body;
      const result = await productServices.updateProduct(productId, updateData);
      return res.json({
        success: true,
        message: "Update product successful.",
        result,
      });
    } catch (err) {
      next(err);
    }
  }
  async getProducts(req, res, next) {
    try {
      const query = req.query;
      const result = await productServices.getProducts(query);
      return res.json({
        success: true,
        message: "Product retrieved successfully.",
        result,
      });
    } catch (err) {
      next(err);
    }
  }
  async getProductById(req, res, next) {
    try {
      const productId = Number(req.params.id);
      const result = await productServices.getProductById(productId);
      return res.json({
        success: true,
        message: "Product retrieved successfully.",
        result,
      });
    } catch (err) {
      next(err);
    }
  }
  async deactivateProduct(req, res, next) {
    try {
      const productId = Number(eq.params.id);
      const result = await productServices.deactivateProduct(productId);
      return res.json({
        success: true,
        message: "Deactivate product successful.",
        result,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new ProductController();
