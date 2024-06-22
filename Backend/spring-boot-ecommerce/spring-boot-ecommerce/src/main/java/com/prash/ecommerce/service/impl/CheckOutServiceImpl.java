package com.prash.ecommerce.service.impl;

import com.prash.ecommerce.dao.CustomerRepository;
import com.prash.ecommerce.dto.Purchase;
import com.prash.ecommerce.dto.PurchaseResponse;
import com.prash.ecommerce.entity.Customer;
import com.prash.ecommerce.entity.OrderItem;
import com.prash.ecommerce.entity.Order;
import com.prash.ecommerce.service.CheckOutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckOutServiceImpl implements CheckOutService {

    private CustomerRepository customerRepository;

    @Autowired
    public CheckOutServiceImpl(CustomerRepository repo){
        this.customerRepository=repo;
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
}
