import prisma from "../database/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import BadRequestError from "../exceptions/BadRequestError.js";
import UnauthorizedError from "../exceptions/UnauthorizedError.js";

const registerUser = async ({ username, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new BadRequestError("Email already registered", "AUTH_EMAIL_TAKEN");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new BadRequestError(
      "Email and password required",
      "AUTH_MISSING_CREDENTIAL",
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user)
    throw new UnauthorizedError(
      "Wrong email or password",
      "AUTH_BAD_CREDENTIAL",
    );

  const isValid = await bcrypt.compare(password, user.password || "");
  if (!isValid) {
    throw new UnauthorizedError(
      "Wrong email or password",
      "AUTH_BAD_CREDENTIAL",
    );
  }

  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_KEY, {
    expiresIn: "30m",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_KEY, {
    expiresIn: "365d",
  });

  const { exp } = jwt.decode(refreshToken);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expired_at: new Date(exp * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new BadRequestError("Refresh token required!", "TOKEN_MISSING");
  }

  const tokenData = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: {
      user: {
        include: { roles: true, buyerProfile: true, sellerProfile: true },
      },
    },
  });

  if (!tokenData || tokenData.revoked) {
    throw new NotFoundError("Token not found or revoked", "TOKEN_REVOKED");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);
  } catch (err) {
    if (err.message === "jwt expired") {
      throw new UnauthorizedError("Refresh token expired", "TOKEN_EXPIRED");
    }
    throw new ForbiddenError("Invalid refresh token", "TOKEN_INVALID");
  }

  const activeRole = decoded.user.active_role; // <-- Ambil dari token lama

  const accessToken = jwt.sign(
    buildUserPayload(tokenData.user, activeRole),
    process.env.ACCESS_KEY,
    { expiresIn: "10m" },
  );

  return accessToken;
};

const logoutUser = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new BadRequestError("No token provided", "ALREADY_LOGOUT");
  }

  const updated = await prisma.refreshToken.updateMany({
    where: { token: refreshToken, revoked: false },
    data: { revoked: true },
  });

  if (updated.count === 0) {
    throw new NotFoundError("Token not found", "TOKEN_NOT_FOUND");
  }

  return { message: "Logout successful" };
};

export default {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
