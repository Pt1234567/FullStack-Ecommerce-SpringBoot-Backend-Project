import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{

  product:Product[]=[];
  currentCategoryId:number=1;

  constructor(private productService: ProductService,
    private route:ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
    this.listProducts();
    });
  }


  listProducts() {
    //check "id" parameter is available
    const hasCategoryId:boolean=this.route.snapshot.paramMap.has('id');

        
      if (hasCategoryId) {
          // Convert string to a number
          this.currentCategoryId =+this.route.snapshot.paramMap.get('id')!;
      } else {  
          // Not available category id then make it default
          this.currentCategoryId = 1;
      }


      // get products for given category id 


   this.productService.getProductList(this.currentCategoryId).subscribe(
    data=>{
      this.product=data;
    }
   )
  }


}
