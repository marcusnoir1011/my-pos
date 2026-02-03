import { prisma } from "../libs/prisma";
import { AppError } from "./AppError";

class OwnershipMiddleware {
  saleOwner = async (req, res, next) => {
    try {
      const saleId = Number(req.params.id);

      if (!saleId) {
        return next(new AppError("Invalid Sale Id.", 400));
      }

      const sale = await prisma.sale.findUnique({
        where: {
          id: saleId,
        },
        select: {
          cashierId: true,
        },
      });

      if (!sale) {
        return next(new AppError("Sale not found.", 404));
      }

      // Admin
      if (req.user.role === "admin") {
        return next();
      }
      if (sale.cashierId !== req.user.id) {
        return next(new AppError("Forbidden.", 403));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

export default new OwnershipMiddleware();
