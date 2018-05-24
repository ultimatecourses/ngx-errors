import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { of } from 'rxjs';

import { Product, Item } from '../models/product.interface';

@Injectable()
export class StockInventoryService {
  constructor(
    private http: Http
  ) {}

  getCartItems(): Observable<Item[]> {
    return of([
      { "product_id": 1, "quantity": 10 },
      { "product_id": 3, "quantity": 50 }
    ]);
  }

  getProducts(): Observable<Product[]> {
    return of([
      { "id": 1, "price": 2800, "name": "MacBook Pro" },
      { "id": 2, "price": 50, "name": "USB-C Adaptor" },
      { "id": 3, "price": 400, "name": "iPod" },
      { "id": 4, "price": 900, "name": "iPhone" },
      { "id": 5, "price": 600, "name": "Apple Watch" }
    ]);
  }

  checkBranchId(id: string): Observable<boolean> {
    return of(true);
  }
}