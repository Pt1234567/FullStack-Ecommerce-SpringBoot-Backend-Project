package com.prash.ecommerce.dto;

import com.prash.ecommerce.entity.Address;
import com.prash.ecommerce.entity.Customer;
import com.prash.ecommerce.entity.OrderItem;
import com.prash.ecommerce.entity.Order;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order orders;
    private Set<OrderItem> orderItems;
}
