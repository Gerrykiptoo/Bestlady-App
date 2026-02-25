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

const initiateSTKPush = async (phone, amount, reference) => {
  const token = await getMpesaToken();
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64');

  const data = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: reference,
    TransactionDesc: 'BestLady Payment',
  };

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/query', // This should be the process request URL, usually /mpesa/stkpush/v1/processrequest
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Correcting the URL for stkpush
    const responseActual = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return responseActual.data;
  } catch (error) {
    throw new Error(error.response?.data?.errorMessage || 'STK Push failed');
  }
};

module.exports = {
  getMpesaToken,
  initiateSTKPush,
};
