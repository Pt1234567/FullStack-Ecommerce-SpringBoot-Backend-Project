import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{

  product:Product[]=[];
  currentCategoryId:number=1;
  searchMode:boolean=false;
  previousCategoryId:number=1;
  previousKeyword:string="";

  //new properties for pagination
  thePageNumber:number=1;
  thePageSize:number=5;
  theTotalElements:number=0;

  constructor(private productService: ProductService,
    private cartService:CartService,
    private route:ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
    this.listProducts();
    });
  }


  listProducts() {
    this.searchMode=this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }


  handleSearchProducts() {
    const theKeyword:string=this.route.snapshot.paramMap.get('keyword')!;

    //now search for the products using keyword
    if(this.previousKeyword!=theKeyword){
      this.thePageNumber=1;
    }

    this.previousKeyword=theKeyword;  

    this.productService.searchProductsPaginate(this.thePageNumber-1,this.thePageSize,theKeyword).subscribe(
     this.processResult()
    );

    
  }
  processResult(){

    return (data:any)=>{
      this.product=data._embedded.products;
      this.thePageNumber=data.page.number+1;
      this.thePageSize=data.page.size;
      this.theTotalElements=data.page.totalElements;
        }
  }



  handleListProducts(){
         //check "id" parameter is available
    const hasCategoryId:boolean=this.route.snapshot.paramMap.has('id');

        
    if (hasCategoryId) {
        // Convert string to a number
        this.currentCategoryId =+this.route.snapshot.paramMap.get('id')!;
    } else {  
        // Not available category id then make it default
        this.currentCategoryId = 1;
    }



    //check if we have a different category than previous

    //if we have a different category id than previous
    // then set pagenumber to 1
    if(this.previousCategoryId!=this.currentCategoryId){
      this.thePageNumber=1;
    }

    // get products for given category id 


 this.productService.getProductListPagination(this.thePageNumber-1,this.thePageSize,this.currentCategoryId).subscribe(
  data=>{
    this.product=data._embedded.products;
    this.thePageNumber=data.page.number+1;
    this.thePageSize=data.page.size;
    this.theTotalElements=data.page.totalElements;
  }
 );
  }


  updatePageSize(pageSize:string){
        this.thePageSize=+pageSize;
        this.thePageNumber=1;
        this.listProducts();
  }


  addToCart(theProduct:Product){
       const cartItem=new CartItem(theProduct);
       this.cartService.addToCart(cartItem);
  }

}
