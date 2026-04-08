import { Component, OnInit } from '@angular/core';

import { SHARED_COMPONENTS, SHARED_MODULES } from 'src/app/shared/shared';
import { addIcons } from 'ionicons';
import {
  removeOutline,
  addOutline,
  heart,
  cartOutline,
  personCircleSharp,
  create,
} from 'ionicons/icons';
import { ProductsService } from 'src/app/core/services/productsService.service';
import { Router } from '@angular/router';
import { Product } from '../../../shared/interfaces/product.interface';
import { ToastService } from 'src/app/core/services/toastService.service';
import { AuthService } from 'src/app/core/services/authService.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.page.html',
  styleUrls: ['./products-list.page.scss'],
  standalone: true,
  imports: [...SHARED_MODULES, HeaderComponent],
})
export class ProductsListPage implements OnInit {
  cartCount: any;
  isAdmin: boolean = false;
  // Define your array using the Interface
  public products: Product[] = [];
  constructor(
    public productService: ProductsService,
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.isAdmin = this.authService.isAdmin();
    console.log(this.isAdmin);
    // Register the icons used in the UI
    addIcons({
      heart,
      removeOutline,
      addOutline,
      cartOutline,
      personCircleSharp,
      create,
    });
    this.getProducts();
  }

  ngOnInit() {}

  getProducts() {
    this.productService.getProducts().subscribe({
      next: (res: Product[]) => {
        this.products = res;
      },
      error: (err) => {
        console.error(err);
        if (
          err &&
          err.status == 401 &&
          err.error.toLowerCase() == 'you are not logged in'
        ) {
          this.router.navigate(['/auth/signup']);
          return;
        }
        this.toastService.presentToast(err.error.message, 'bottom');
      },
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  addToCart(product: any) {
    this.productService.addToCart(product).subscribe({
      next: (res: any) => {
        console.log(res);
        this.productService.getCartItems();
        this.toastService.presentToast(res.message, 'bottom');
      },
      error: (err: any) => {
        console.log(err);
        this.toastService.presentToast(err.error.message, 'bottom');
      },
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToDetails(item: any) {
    this.router.navigate(['/productdetails', item._id]);
  }

  goToEditPage(item: any) {
    this.router.navigate(['/admin/editproduct', item._id]);
  }
}
