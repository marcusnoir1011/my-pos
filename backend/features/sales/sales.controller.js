import salesServices from "./sales.services";

class SaleController {
  async createSale(req, res, next) {
    try {
      const cashierId = req.user.id;
      const items = req.user.items;
      const result = await salesServices.createService({ cashierId, items });

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export default new SaleController();
