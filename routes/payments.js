require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const axios = require("axios");

const router = express.Router();

router.post("/orders", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZOR_PAY_KEY_ID,
      key_secret: process.env.RAZOR_PAY_KEY_SECRET,
    });

    const {
      amount,
      currency,
      currencyMultiplier,
      receipt_id,
      notes,
    } = req.body;

    const options = {
      amount: amount * currencyMultiplier, // amount in smallest currency unit
      currency: currency,
      receipt: receipt_id,
      notes,
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/capture", async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      amount,
      currencyMultiplier,
      currency,
    } = req.body;

    const shasum = crypto.createHmac(
      "sha256",
      process.env.RAZOR_PAY_KEY_SECRET
    );

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    const response = await axios
      .post(
        `https://${process.env.RAZOR_PAY_KEY_ID}:${process.env.RAZOR_PAY_KEY_SECRET}@api.razorpay.com/v1/payments/${razorpayPaymentId}/capture`,
        { amount: amount * currencyMultiplier, currency }
      )
      .then((response) => response.data);

    res.status(200).json({
      msg: "Success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
