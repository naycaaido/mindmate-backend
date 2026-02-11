import authService from "../services/authService.js";
import BadRequestError from "../exceptions/BadRequestError.js";

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new BadRequestError(
        "All fields are mandatory",
        "MISSING_CREDENTIAL",
      );
    }

    const newUser = await authService.registerUser(req.body);

    res.status(201).json({
      status: "success",
      message: "Account created",
      data: { user: { _id: newUser.id, email: newUser.email } },
    });
  } catch (e) {
    next(e);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await authService.loginUser(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 tahun
    });

    res.status(200).json({
      status: "success",
      message: "User login successfully",
      data: {
        accessToken,
      },
    });
  } catch (e) {
    next(e);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new BadRequestError("Refresh token missing", "TOKEN_MISSING");
    }

    const accessToken = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      status: "success",
      message: "Access token refreshed",
      data: {
        accessToken,
      },
    });
  } catch (e) {
    console.error("Error during token refresh:", e.message);
    next(e);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new BadRequestError("No token provided", "TOKEN_MISSING");
    }

    await authService.logoutUser({ refreshToken });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.json({
      status: "success",
      message: "User logout successfully",
      data: {},
    });
  } catch (e) {
    next(e);
  }
};

export default {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
};
