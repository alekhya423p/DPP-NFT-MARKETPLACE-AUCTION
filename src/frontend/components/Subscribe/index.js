import React, { useState, useContext, useEffect } from 'react';
import { NftContext } from "../../NftContext/NftProvider";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import PaymentForm from './PaymentForm';

const stripePromise = loadStripe('pk_test_51LVEZuB6NrurbhtDBUqJ0jmZqNgghiPXPkb8x2h7CFi4TgLrqfTwNb5jm5wFMslmi4NbVXQEGBO5002l2AG6ViyN00n6zj1y8j');

const Subscribe = () => {
  const { getsubscription, subscription } = useContext(NftContext);
 
  useEffect(() => {
    getsubscription()

  }, [])


  return (
    <>
      <Elements stripe={stripePromise}>
        <section id="pricing" className="price_plan_area section_padding_130_80 content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-sm-8 col-lg-6">
                <div className="section-heading text-center wow fadeInUp" data-wow-delay="0.2s" >
                  <h2>Pricing Plan</h2>
                  <h6>Choose the plans as per your requirements</h6>
                  <div className="line"></div>
                </div>
              </div>
            </div>
            {subscription.length > 0 ?
                <PaymentForm subscription={subscription} />
              : (
                <div className="col-12 col-sm-12 col-md-12">
                  <div className=" mx-1 mb-3">
                    <div className="card-body">
                      <p className="text-center type-6 my-0">No Plan found...</p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </section>
      </Elements>
    </>
  );
}
export default Subscribe