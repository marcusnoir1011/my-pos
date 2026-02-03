import authService from "./auth.service";

const cookieOptions = {
  httpOnly: true,
  secure: (process.env.NODE_ENV = "production"),
  sameSite: "strict",
  path: "/auth/refresh",
};

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });

      res.cookie("refreshToken", result.refreshToken, cookieOptions);

      res.status(201).json({
        success: true,
        message: "User registration successful.",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      res.cookie("refreshToken", result.refreshToken, cookieOptions);

      res.status(200).json({
        success: true,
        message: "User logged in successfully.",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }
  async logout(req, res, next) {
    try {
      const token = req.cookies.refreshToken;
      await authService.logout(refreshToken);

      res.clearCookit("refreshToken", cookieOptions);

      res.status(200).json({
        success: true,
        message: "User logged out successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const token = req.cookies.refreshToken;
      const { accessToken, refreshToken } =
        await authService.refreshToken(token);

      res.cookie("refreshToken", refreshToken, cookieOptions);

      res.status(200).json({
        success: true,
        message: "Refreshed token successfully.",
        data: {
          accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
