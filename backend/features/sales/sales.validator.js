export const validator = (req, res, next) => {
  try {
    // 1. items exist
    const items = req.body.items;
    if (!items) {
      throw new Error("Items missing.");
    }
    // 2. items is array
    if (!Array.isArray(items)) {
      throw new Error("Items must be an array.");
    }
    // 3. items array must be greater than 0
    if (items.length === 0) {
      throw new Error("Sale must contain at least one item.");
    }
    // 4. check or validate each things inside items
    items.forEach((item) => {
      // productId validation
      if (item.productId === undefined) {
        throw new Error("Item is missing productId.");
      }
      if (!Number.isFinite(item.productId)) {
        throw new Error("productId is not a number.");
      }

      // quantity validation
      if (item.quantity === undefined) {
        throw new Error("item is missing quantity.");
      }
      if (!Number.isFinite(item.quantity)) {
        throw new Error("quantity is not a number.");
      }
      if (item.quantity <= 0) {
        throw new Error("quantity must not be 0.");
      }
    });
    next();
  } catch (err) {
    next(err);
  }
};
