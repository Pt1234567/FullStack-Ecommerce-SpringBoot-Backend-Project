package com.prash.ecommerce.contoller;

import com.prash.ecommerce.dto.Purchase;
import com.prash.ecommerce.dto.PurchaseResponse;
import com.prash.ecommerce.service.CheckOutService;
import org.springframework.beans.factory.annotation.Autowired;
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
}
