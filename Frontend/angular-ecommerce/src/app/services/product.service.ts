import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {



  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category'

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> {

    //need to build url based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;


    return this.httpClient.get<GetResponseProductList>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }


  getProductListPagination(thePage:number,
                            theSize:number,
                            theCategoryId: number): Observable<GetResponseProductList> {

             const url=`${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                         +`&page=${thePage}&size=${theSize}`;

                         return this.httpClient.get<GetResponseProductList>(url); 
  }


  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    //need to build url based on theKeyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;


    return this.httpClient.get<GetResponseProductList>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }


  getProduct(theProductId: number) :Observable<Product>{
      //build url for prduct id
      const productUrl=`${this.baseUrl}/${theProductId}`;

      return this.httpClient.get<Product>(productUrl);
  }

  searchProductsPaginate(thePage:number,thePageSize:number,theKeyword:string):Observable<GetResponseProductList>{
    
    const searchUrl=`${this.baseUrl}/search/findByNameContaining`+`?name=${theKeyword}`+`&page=${thePage}&size=${thePageSize}`;


     return this.httpClient.get<GetResponseProductList>(searchUrl);
  }

}

interface GetResponseProductList {
  _embedded: {
    products: Product[];
  },

  page:{
    size:number,
    totalElements:number,
    totalPages:number,
    number:number
  }
}



interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}