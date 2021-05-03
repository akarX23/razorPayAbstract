import React, { useState } from "react";
import axios from "axios";

const usePaymentGateway = () => {
  const handlePayment = async (
    dataToBeSent,
    optionsForTheModal,
    dismissModal,
    capturePayment
  ) => {
    const orderUrl = `http://localhost:5000/payment/orders`;

    // Creating a new order
    const response = await axios.post(orderUrl, dataToBeSent);
    console.log("Order response : ");
    console.log(response);
    const order = response.data;

    const options = {
      // PUBLIC KEY
      key: "rzp_test_7HOlWYzGZhw8vp",
      order_id: order.id,
      handler: async (response) => {
        // data to be sent in this format to the backend
        const paymentInfo = {
          orderCreationId: order.id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          ...dataToBeSent,
        };

        return capturePayment(paymentInfo);
      },
      ...optionsForTheModal,
      theme: optionsForTheModal.theme
        ? optionsForTheModal.theme
        : {
            color: "#61dafb",
          },
      modal: {
        ondismiss: function () {
          dismissModal();
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return handlePayment;
};

export default usePaymentGateway;
