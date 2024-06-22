package com.prash.ecommerce.service.impl;

import com.prash.ecommerce.dao.CustomerRepository;
import com.prash.ecommerce.dto.PaymentInfo;
import com.prash.ecommerce.dto.Purchase;
import com.prash.ecommerce.dto.PurchaseResponse;
import com.prash.ecommerce.entity.Customer;
import com.prash.ecommerce.entity.OrderItem;
import com.prash.ecommerce.entity.Order;
import com.prash.ecommerce.service.CheckOutService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CheckOutServiceImpl implements CheckOutService {

    private CustomerRepository customerRepository;

    @Autowired
    public CheckOutServiceImpl(CustomerRepository repo, @Value("${stripe.key.secret}")String secretKey){
        this.customerRepository=repo;
        Stripe.apiKey=secretKey;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        //retrieve order info from dto
        Order order=purchase.getOrders();

        //generate tracking number
        String orderTrackingNumber=generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems=purchase.getOrderItems();
        orderItems.forEach(item->order.add(item));

        //populate address with billing and shipping address
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //populate customer with order
        Customer customer=purchase.getCustomer();

        //check if this is an existing customer
        String email=customer.getEmail();

        Customer customerFromDB=customerRepository.findByEmail(email);

        if(customerFromDB!=null){
            customer=customerFromDB;
        }

        customer.add(order);

        //save to database
        customerRepository.save(customer);

        //return a response
        return new PurchaseResponse(orderTrackingNumber);
    }



    private String generateOrderTrackingNumber() {

        //generate a random uuid
        return UUID.randomUUID().toString();
    }


    @Override
    public PaymentIntent paymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodType =new ArrayList<>();
        paymentMethodType.add("card");

        Map<String , Object> params=new HashMap<>();
        params.put("amount",paymentInfo.getAmount());
        params.put("currency",paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodType);
        params.put("receipt_email", paymentInfo.getReceiptEmail());

        return PaymentIntent.create(params);
    }
}
