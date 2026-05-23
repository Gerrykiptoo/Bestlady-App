const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getMpesaToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    throw new Error('M-Pesa auth failed');
  }
};

const initiateSTKPush = async (phone, amount, reference, callbackUrl) => {
  // Normalise phone: must be 2547XXXXXXXX (12 digits, no +)
  let normalised = String(phone).replace(/[^0-9]/g, '');
  if (normalised.startsWith('0')) normalised = '254' + normalised.slice(1);
  if (normalised.startsWith('7') || normalised.startsWith('1')) normalised = '254' + normalised;
  if (normalised.length !== 12) {
    throw new Error(`Invalid phone number: ${phone}. Must be 12 digits (2547XXXXXXXX).`);
  }

  const token = await getMpesaToken();
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64');

  // M-Pesa requires a whole number amount
  const wholeAmount = Math.ceil(parseFloat(amount));

  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: wholeAmount,
    PartyA: normalised,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: normalised,
    CallBackURL: callbackUrl || process.env.MPESA_CALLBACK_URL,
    AccountReference: String(reference).slice(0, 12),
    TransactionDesc: 'BestLady Payment',
  };

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.errorMessage || error.response?.data?.ResultDesc || error.message;
    throw new Error(msg || 'STK Push failed');
  }
};

module.exports = {
  getMpesaToken,
  initiateSTKPush,
};
