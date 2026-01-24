import authService from "./auth.service";

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });

      return res.status(201).json({
        success: true,
        message: "User registration successful.",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: "User log in successful.",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
