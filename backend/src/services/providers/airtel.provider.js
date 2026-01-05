import axios from "axios";

export async function initiateAirtelPayment({ amount, phone, reference }) {
  const tokenRes = await axios.post(
    `${process.env.AIRTEL_BASE_URL}/auth/oauth2/token`,
    {
      client_id: process.env.AIRTEL_CLIENT_ID,
      client_secret: process.env.AIRTEL_CLIENT_SECRET,
      grant_type: "client_credentials",
    }
  );

  const token = tokenRes.data.access_token;

  await axios.post(
    `${process.env.AIRTEL_BASE_URL}/merchant/v1/payments/`,
    {
      reference,
      subscriber: {
        country: "UG",
        currency: "UGX",
        msisdn: phone,
      },
      transaction: {
        amount,
        country: "UG",
        currency: "UGX",
        id: reference,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return { success: true };
}
