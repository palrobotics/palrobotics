import axios from "axios";

export async function initiateMTNPayment({
  amount,
  phone,
  reference,
  callbackUrl,
}) {
  const tokenRes = await axios.post(
    `${process.env.MTN_BASE_URL}/collection/token/`,
    {},
    {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY,
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.MTN_API_USER}:${process.env.MTN_API_KEY}`
          ).toString("base64"),
      },
    }
  );

  const token = tokenRes.data.access_token;

  await axios.post(
    `${process.env.MTN_BASE_URL}/collection/v1_0/requesttopay`,
    {
      amount: String(amount),
      currency: "UGX",
      externalId: reference,
      payer: {
        partyIdType: "MSISDN",
        partyId: phone,
      },
      payerMessage: "Investment payment",
      payeeNote: "Pal Robotics",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Reference-Id": reference,
        "X-Target-Environment": "sandbox",
        "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return { success: true };
}
