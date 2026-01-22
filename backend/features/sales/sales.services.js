import { prisma } from "../../libs/prisma.js";

class SaleService {
  async createService({ cashierId, items }) {
    return await prisma.$transaction(async (tx) => {
      // 1. fetch products
      const products = await this.#fetchProducts(tx, items);
      // 2. validate
      this.#validateStock(items, products);
      // 3. calculate totals
      const { totalAmount, preparedItems } = await this.#calculateTotals(
        items,
        products,
      );
      // 4. create sale record
      const sale = await this.#createSaleRecord(tx, cashierId, totalAmount);
      // 5. create sale item
      await this.#createSaleItems(tx, sale.id, preparedItems);
      // 6. update stock
      await this.#updateStock(tx, preparedItems);
      return {
        saleId: sale.id,
        totalAmount,
        items: preparedItems,
      };
    });
  }

  async #fetchProducts(tx, items) {
    const productIds = items.map((item) => item.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });
    return products;
  }
  async #validateStock(items, products) {
    items.forEach((item) => {
      const product = products.find((product) => product.id === item.productId);

      if (!product)
        throw new Error(`Product ${item.productId} not found or inactive.`);
      if (item.quantity > product.stockQuantity)
        throw new Error(`Not enough stock for product ${item.productId}`);
    });
  }
  async #calculateTotals(items, products) {
    let totalAmount = 0;
    const preparedItems = items.map((item) => {
      const product = products.find((product) => product.id === item.productId);
      const subTotal = item.quantity * product.price;
      totalAmount += subTotal;

      return {
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        subTotal,
      };
    });
    return { totalAmount, preparedItems };
  }
  async #createSaleRecord(tx, cashierId, totalAmount) {
    const sale = await tx.sale.create({
      data: {
        cashierId,
        totalAmount,
      },
    });
    return sale;
  }
  async #createSaleItems(tx, saleId, preparedItems) {
    return await tx.saleItem.createMany({
      data: preparedItems.map((item) => ({
        saleId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subTotal: item.subTotal,
      })),
    });
  }
  async #updateStock(tx, preparedItems) {
    for (const item of preparedItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }
  }
}

export default new SaleService();

// plan
// start transaction
// fetch products
// validate stock
// calculate totals
// create sale record
// create sale items
// update stock
// commit transaction
