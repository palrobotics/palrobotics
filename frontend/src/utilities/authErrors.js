export function getAuthErrorMessage(error) {
  if (!error?.code) {
    return "Something went wrong. Please try again.";
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "Invalid email address.";

    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";

    case "auth/user-disabled":
      return "This account has been disabled. Contact support.";

    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again later.";

    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";

    default:
      return "Login failed. Please try again.";
  }
}
