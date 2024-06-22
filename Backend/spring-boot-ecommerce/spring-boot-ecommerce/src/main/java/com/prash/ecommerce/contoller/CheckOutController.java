package com.prash.ecommerce.contoller;

import com.prash.ecommerce.dto.PaymentInfo;
import com.prash.ecommerce.dto.Purchase;
import com.prash.ecommerce.dto.PurchaseResponse;
import com.prash.ecommerce.service.CheckOutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/checkout")
public class CheckOutController {

    private CheckOutService checkOutService;

    @Autowired
    public CheckOutController(CheckOutService checkOutService){
        this.checkOutService=checkOutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){
        PurchaseResponse purchaseResponse=checkOutService.placeOrder(purchase);

        return purchaseResponse;
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo paymentInfo) throws StripeException{

        PaymentIntent paymentIntent=checkOutService.paymentIntent(paymentInfo);

        String paymentStr=paymentIntent.toJson();

        return new ResponseEntity<>(paymentStr, HttpStatus.OK);
    }
}
