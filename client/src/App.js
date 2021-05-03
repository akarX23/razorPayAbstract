import React from "react";
import usePaymentGateway from "./usePaymentGateway";

const App = () => {
  const handlePayment = usePaymentGateway();

  const capturePayment = (paymentInfo) => {
    console.log(paymentInfo);
  };

  return (
    <button
      onClick={() => {
        handlePayment(
          // amount and receipt_id required
          {
            amount: 1000,
            currency: "INR",
            currencyMultiplier: 100,
            receipt_id: "receipt#!",
          },
          // Properties of the modal
          {
            name: "Test",
            description: "Test payment",
            prefill: {
              name: "Ritik",
              email: "ritik@gmail.com",
              contact: "9007065959",
            },
          },
          // When user closes the modal, this function has to be called
          () => console.log("Modal dismissed"),
          // On successfull payment this is called
          capturePayment
        );
      }}
    >
      Click here to buy
    </button>
  );
};

export default App;
