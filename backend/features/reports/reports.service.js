import { AppError } from "../../libs/AppError";

class ReportService {
  async SalesSummary({ startDate = new Date(), endDate = null }) {
    // validatation
    if (!this.#ValidateDate(startDate))
      throw new AppError("Start date is not a valid date.", 400);

    if (endDate !== null && !this.#ValidateDate(endDate))
      throw new AppError("End date is not a valid date.", 400);

    if (endDate && startDate.getTime() > endDate.getTime())
      throw new AppError("Start date cannot be after end date.", 400);

    if (
      this.#IsFutureDate(startDate) ||
      (endDate && this.#IsFutureDate(endDate))
    )
      throw new AppError("Future date is invalid.", 400);
  }

  // helper
  #ValidateDate(dateObj) {
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  }
  #IsFutureDate(dateObj) {
    return dateObj.getTime() > Date.now();
  }
}
