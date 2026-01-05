export function generateReferralCode(uid) {
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `PAL-${uid.substring(0, 4).toUpperCase()}${random}`;
}
