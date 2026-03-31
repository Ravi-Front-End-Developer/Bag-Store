import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem, Product } from 'src/app/shared/interfaces/product.interface';
import { ToastService } from './toastService.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  cartItemSignal = signal<CartItem[]>([]);

  // Expose the signal as "read-only" to components
  cartItems = this.cartItemSignal.asReadonly();

  // Computed signal for the badge count (Shared everywhere)
  cartCount = computed(() => {
    return this.cartItemSignal().length;
  });

  constructor(private http: HttpClient, private toastService: ToastService) 
  {
    this.getCartItems();
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:3000/api/products');
  }

  getProductsById(id: string): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:3000/api/products/'+id);
  }

  addToCart(product: any) {
    return this.http.post(
      `http://localhost:3000/api/carts/addToCart/${product._id}`,
      product,
    );
  }

  updateCart(product: any): Observable<CartItem[]> {
    return this.http.put<CartItem[]>(
      `http://localhost:3000/api/carts/updateCart/${product.productId._id}`,
      product,
    );
  }

  removeFromCart(product: any) {
    this.http.delete(
      `http://localhost:3000/api/carts/removeFromCart/${product.productId._id}`,
    ).subscribe({
      next: (res: any) => {
        console.log(res);
        this.getCartItems();
      },
      error: (err: any) => {
        console.log(err);
        this.toastService.presentToast(err.error.message, 'bottom');
      },
    });;
  }

  getCartItemCount(product: any) {
    return this.http.get('http://localhost:3000/api/carts', product);
  }

  getCartItems() {
    this.http.get<CartItem[]>('http://localhost:3000/api/carts').subscribe({
      next: (res: CartItem[]) => {
        console.log(res);
        this.cartItemSignal.set(res);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
