import { prisma } from "../../libs/prisma";

class ProductService {
  async createProduct({ name, price, stockQuantity, sku, isActive = true }) {
    return await prisma.product.create({
      data: {
        name,
        price,
        stockQuantity,
        sku,
        isActive,
      },
    });
  }
  async getProducts({
    isActive = true,
    search,
    sortBy = "name",
    order = "asc",
  } = {}) {
    const products = await prisma.product.findMany({
      where: {
        isActive,
        name: search ? { contains: search, mode: "insensitive" } : undefined,
      },
      orderBy: {
        [sortBy]: order,
      },
    });
    return products;
  }
  async getProductById(id) {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) throw new Error("Product not found.");
    return product;
  }
  async updateProduct(id, data) {
    try {
      const updatedProduct = await prisma.product.update({
        where: {
          id: id,
        },
        data: data,
      });
      return updatedProduct;
    } catch (err) {
      if (err.code === "P2025")
        throw new Error("Product not found for update.");
      throw err;
    }
  }
  async deactivateProduct(id) {
    try {
      const updatedProduct = await prisma.product.update({
        where: {
          id: id,
        },
        data: {
          isActive: false,
        },
      });
      return updatedProduct;
    } catch (err) {
      if (err.code === "P2025")
        throw new Error("Product not found for deactivate.");
      throw err;
    }
  }
}

export default new ProductService();
