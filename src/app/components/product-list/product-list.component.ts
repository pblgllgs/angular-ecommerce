import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  public products : Product[] = [];
  public currentCategoryId: number | null = 0;
  public searchMode!: boolean;

  constructor(
    private productService:ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword :string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(theKeyword)
      .subscribe(data => {
        this.products = data;
      });
  }

  handleListProducts(){

    const hasCategoryId: boolean =  this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      //obtiene id por url que es un string y lo tranforma con '+' a un number para asignarlo a currentCategory
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }else{
      this.currentCategoryId =1;
    }

    this.productService.getProductsList(this.currentCategoryId)
      .subscribe( data =>{
        this.products = data;
    });
  }

}
