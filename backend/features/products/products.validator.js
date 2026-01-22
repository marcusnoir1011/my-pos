export const validator =
  (isUpdate = false) =>
  (req, res, next) => {
    try {
      const product = req.body;

      // create
      if (!isUpdate) {
        if (product.name === undefined)
          throw new Error("Product is missing a name.");
        if (product.price === undefined) throw new Error("Product is missing ");
        if (product.stockQuantity === undefined)
          throw new Error("Stock Quantity is missing.");
      }

      if (product.name !== undefined && typeof product.name !== "string")
        throw new Error("Name must be a string.");
      if (
        product.price !== undefined &&
        (typeof product.price !== "number" || product.price < 0)
      )
        throw new Error("Price must be a non-negative number.");
      if (
        product.stockQuantity !== undefined &&
        (typeof product.stockQuantity !== "number" || product.stockQuantity < 0)
      )
        throw new Error("Stock Quantity must be a non-negative number.");

      if (product.sku !== undefined && typeof product.sku !== "string")
        throw new Error("Sku must be a string.");
      if (
        product.isActive !== undefined &&
        typeof product.isActive !== "boolean"
      )
        throw new Error("isActive must be boolean.");
      next();
    } catch (err) {
      next(err);
    }
  };

// {
//   name: "Coke",
//   price: 1000,
//   stockQuantity: 5,
//   sku: "COKE-001",    // optional
//   isActive: true      // optional, mostly for update
// }
