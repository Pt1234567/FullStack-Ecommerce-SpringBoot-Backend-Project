package com.prash.ecommerce.service;

import com.prash.ecommerce.dto.PaymentInfo;
import com.prash.ecommerce.dto.Purchase;
import com.prash.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckOutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent paymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
