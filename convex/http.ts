import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// Custom Google OAuth callback for mobile app
http.route({
  path: "/auth/google/mobile-callback",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const sessionId = url.searchParams.get("state") || "";

    if (!code) {
      return new Response("Missing authorization code", { status: 400 });
    }

    try {
      // Exchange authorization code for access token (server-side, secure)
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.AUTH_GOOGLE_ID!,
          client_secret: process.env.AUTH_GOOGLE_SECRET!,
          redirect_uri: `${process.env.CONVEX_SITE_URL}/auth/google/mobile-callback`,
          grant_type: "authorization_code",
        }),
      });
      const tokenData = await tokenRes.json();

      if (!tokenData.access_token) {
        console.error("Token exchange failed:", tokenData);
        return new Response(errorPage("Gagal mendapatkan token. Silakan coba lagi."), {
          headers: { "Content-Type": "text/html" },
          status: 500,
        });
      }

      // Fetch user info from Google
      const userRes = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const user = await userRes.json();

      // Store the result in the database for the app to poll
      await ctx.runMutation(internal.googleAuth.storeGoogleAuthResult, {
        sessionId,
        name: user.name || "",
        email: user.email || "",
        picture: user.picture || undefined,
      });

      // Return a success page telling user to go back to the app
      return new Response(successPage(user.name || user.email), {
        headers: { "Content-Type": "text/html" },
      });
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      return new Response(errorPage("Terjadi kesalahan. Silakan coba lagi."), {
        headers: { "Content-Type": "text/html" },
        status: 500,
      });
    }
  }),
});

function successPage(name: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Login Berhasil</title>
</head>
<body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e);color:white;">
  <div style="text-align:center;padding:40px;">
    <div style="font-size:64px;margin-bottom:20px;">✅</div>
    <h2 style="margin:0 0 12px;">Login Berhasil!</h2>
    <p style="color:#a0a0c0;margin:0 0 24px;">Selamat datang, ${name}</p>
    <p style="color:#666;font-size:14px;">Silakan kembali ke aplikasi.<br>Halaman ini bisa ditutup.</p>
  </div>
</body>
</html>`;
}

function errorPage(message: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Login Gagal</title>
</head>
<body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e);color:white;">
  <div style="text-align:center;padding:40px;">
    <div style="font-size:64px;margin-bottom:20px;">❌</div>
    <h2 style="margin:0 0 12px;">Login Gagal</h2>
    <p style="color:#a0a0c0;">${message}</p>
  </div>
</body>
</html>`;
}

export default http;
