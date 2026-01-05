import { auth } from "../config/firebase.js";

/**
 * Verifies Firebase ID token sent from frontend
 * Expects: Authorization: Bearer <ID_TOKEN>
 */
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const idToken = authHeader.split("Bearer ")[1];

    // Verify token and check for revocation where possible
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken, true);
    } catch (err) {
      // If token has been revoked, respond with 401
      if (err.code === "auth/id-token-revoked") {
        return res
          .status(401)
          .json({ success: false, message: "Session revoked" });
      }
      throw err;
    }

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      admin: decodedToken.admin === true,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }
};
