package com.prash.ecommerce.service;

import com.prash.ecommerce.dto.Purchase;
import com.prash.ecommerce.dto.PurchaseResponse;

public interface CheckOutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
