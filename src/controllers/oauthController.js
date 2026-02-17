import { authCallback } from "../services/oauthService.js";
import { authorizationUrl } from "../utils/oauthClient.js";

const authCallbackController = async (req, res, next) => {
  try {
    // kirimkan kode yang diterima Google (req.query.code), bukan seluruh req.query
    const authData = await authCallback(req.query.code);
    console.log("📥 Received Google callback with code:", req.query.code);

    res.cookie("refreshToken", authData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 tahun
    });

    // Redirect ke frontend dengan token dan user data sebagai query parameters
    const frontendUrl = process.env.FRONTEND_URL;
    const redirectUrl = `${frontendUrl}/auth/google/callback?token=${
      authData.accessToken
    }&user=${encodeURIComponent(JSON.stringify(authData.user))}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("OAuth callback error:", error);
    const frontendUrl = process.env.FRONTEND_URL;
    res.redirect(`${frontendUrl}/login?error=Gagal login dengan Google`);
    next(error);
  }
};

const authLoginController = (res) => {
  res.redirect(authorizationUrl);
};

export { authCallbackController, authLoginController };
