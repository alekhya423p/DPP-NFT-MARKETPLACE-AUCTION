import React, {useContext, useState } from 'react';
import { useForm } from "react-hook-form";
import { NftContext } from "../../NftContext/NftProvider";
import { useNavigate } from 'react-router';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';

const PaymentForm = (props) => {
    const navitage = useNavigate()
    const { currentUser,updateSubscription } = useContext(NftContext);

    const [subscriptionPrice, setSubscriptionPlanPrice] = useState({ key: '', price: 0,plan_type:'' });
    // const [subscriptionUser, setSubscriptionUser] = useState({ key: '', user: 0 });
    const [paymentMode, setPaymentMode] = useState(false)
    const [planId, setPlanId] = useState()
    // const [planId, setPlanId] = useState()
    // const [clientSecret, setClientSecret] = useState({})
    const { handleSubmit, } = useForm({
        mode: "onBlur",
    });
    const elements = useElements()
    const stripe = useStripe()
    const onPaymentSubmit = async (values, event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        const card = elements.getElement(CardElement);
        const result = await stripe.createToken(card);

        if (result.error) {
            toast.error(result.error.message)
        } else {
            const paymentData = {
                user_id:currentUser.user_id,
                subscription_id: planId,
                token: result.token.id,
                subscription_type: 'monthly_price',
                status: 'success',
                purchase_at: new Date(),
                expire_at: '1 time',
                // plantype:subscriptionPrice
            };
            
            // console.log('token.email',paymentData);

            updateSubscription(paymentData, navitage)
            hideEditModal();
        }
    };
    const showEditModal = id => {
        console.log(id);
        setPaymentMode(true);
        setPlanId(id);
    }
    const hideEditModal = async () => {
        setPaymentMode(false)
  
        setPlanId()
    }
    return (
        <>
            <div className="row justify-content-center">
                {props.subscription && props.subscription.map((item, index) => (
                    <div key={index} className="col-12 col-sm-8 col-md-6 col-lg-4">
                        <div className="single_price_plan wow fadeInUp" data-wow-delay="0.2s" >
                            <div className="title">
                                {/* <span>{item.status}</span> */}
                                <h4>{item.name}</h4>

                                <p>{item.description}</p>
                                <div className="line"></div>
                            </div>
                            <div className="price">
                            <h4>${index === subscriptionPrice.key ? subscriptionPrice.price : 0}</h4>
                                {/* <h4>${index === subscriptionPrice.key ? subscriptionPrice.user_id : 'N/A'}</h4> */}
                            </div>
                            <div className="description">
                                <div className="col">
                                    <select className="select2-selection form-select form-control" onChange={(e) => setSubscriptionPlanPrice({ key: index, price: e.target.value })}>
                                        <option value="">--Select Plan--</option>
                                        {item.price && item.price.map((res, index) => {
                                            let myStr = res.type?.split('_')[0];
                                           return <option key={index} value={res.amount}>{res.amount} ({myStr?.charAt(0).toUpperCase() + myStr?.slice(1) })</option>

                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="button"><button type='button' className="btn btn-block btn-primary custom-color-bttn" onClick={() => showEditModal(item.id)}>Buy Now</button></div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal show={paymentMode} onHide={hideEditModal}>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title">Make Payment</Modal.Title>
                    <button className='btn btn-outline-danger' onClick={hideEditModal}><i className="fas fa-times"></i></button>
                </Modal.Header>
                <Modal.Body>
                    <form className="form-auth-small" id="payment-form" onSubmit={handleSubmit(onPaymentSubmit)}>
                        <div className="col-md-12">
                            {paymentMode &&
                                <>
                                    <CardElement id="card-element" />
                                </>
                            }
                        </div>
                        <Modal.Footer className='mt-3'>
                            <button type="submit" className='btn btn-primary custom-color-bttn' disabled={!stripe || !elements}>Pay</button>
                            <button className='btn btn-outline-danger' onClick={hideEditModal}>Close</button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
};

export default PaymentForm;
