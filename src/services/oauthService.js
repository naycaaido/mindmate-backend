import { google } from "googleapis";
import prisma from "../database/prisma.js";
import { oauth2Client } from "../utils/oauthClient.js";
import jwt from "jsonwebtoken";

async function findOrCreateUserGoogle(data) {
  return await prisma.$transaction(async (tx) => {
    let existingUser = await tx.user.findUnique({
      where: { email: data.email },
    });

    console.log(data);

    if (!existingUser) {
      const newUser = await tx.user.create({
        data: {
          username: data.name || data.email.split("@")[0],
          photo_profile: data.picture,
          email: data.email,
          password: null,
          login_provider: "google",
          oauth_id: data.id,
        },
      });

      return newUser;
    }

    return existingUser;
  });
}

async function authCallback(code) {
  try {
    if (!code) throw new Error("Missing authorization code");

    // ambil token dari Google
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // ambil profile user
    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data } = await oauth2.userinfo.get();
    if (!data.email) throw new Error("Email tidak ditemukan dari Google");

    // Transaction: cari atau buat user. Gunakan field yang ada di schema.prisma
    const user = await findOrCreateUserGoogle(data);

    // Generate JWT tokens
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
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Error in authCallback:", error);
    throw error;
  }
}

export { authCallback, findOrCreateUserGoogle };
