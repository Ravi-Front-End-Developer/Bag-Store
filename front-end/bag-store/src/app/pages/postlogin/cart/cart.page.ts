import { Component, effect, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SHARED_MODULES } from 'src/app/shared/shared';
import {
  removeOutline,
  addOutline,
  closeOutline,
  cartOutline,
} from 'ionicons/icons'; // 3. Import specific icons
import { addIcons } from 'ionicons';
import { ProductsService } from 'src/app/core/services/productsService.service';
import { CartItem, Product } from 'src/app/shared/interfaces/product.interface';
import { debounceTime } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { ToastService } from 'src/app/core/services/toastService.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ...SHARED_MODULES, HeaderComponent],
})
export class CartPage implements OnInit {
  cartItems = signal<CartItem[]>([]);
  totalAmt: number = 0;
  subTotalAmt: number = 0;
  discountAmt: number = 0;
  deliveryFee: number = 20;

  private syncTrigger = signal<CartItem | null>(null);

  constructor(
    public productService: ProductsService,
    private toastService: ToastService
  ) {
    // Register the icons used in the UI
    addIcons({
      removeOutline,
      addOutline,
      closeOutline,
      cartOutline,
    });
    this.getCartItems();

    // Handle debounced cart update
    toObservable(this.syncTrigger)
      .pipe(debounceTime(500))
      .subscribe((update: any) => {
        if (update) this.updateCart(update);
      });

    // OPTION A: The "Reactive" way (Automatic)
    // This watches the Service's signal and updates the Page's signal
    effect(() => {
      const serviceData = this.productService.cartItemSignal();
      this.cartItems.set(serviceData);
    });
  }

  ngOnInit() {}

  getCartItems() {
    this.cartItems.set(this.productService.cartItemSignal());
    // .subscribe({
    //   next: (res: CartItem[]) => {
    //     console.log(res);
    //     if(res && res.length == 0)
    //     {
    //       this.deliveryFee = 0
    //     }
    //     this.cartItems.set(res);
    //     this.getTotalAmt();
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //     this.toastService.presentToast(err.error.message, 'bottom');
    //   },
    // });
  }

  async increase(item: any) {
    item.quantity++;
    await this.getTotalAmt();
    this.syncTrigger.set(item);
  }

  async decrease(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      if (item.quantity == 1) {
        console.log('item quantity is 1');
      }
      await this.getTotalAmt();
      this.syncTrigger.set(item);
    } else {
      // if (item.quantity == 1) {
      //   item.quantity--;
      // }
      console.log(item.quantity);
      this.removeFromCart(item);
    }
  }

  getTotalAmt() {
    const totals = this.cartItems().reduce(
      (acc, item) => {
        acc.subTotal += item.productId.price * item.quantity;
        acc.discount += item.productId.discount * item.quantity;
        return acc;
      },
      { subTotal: 0, discount: 0 }
    );

    this.subTotalAmt = totals.subTotal;
    this.discountAmt = totals.discount;
    this.totalAmt = this.subTotalAmt + this.deliveryFee - this.discountAmt;
  }

  checkout() {}

  updateCart(product: any) {
    console.log(product);
    this.productService.updateCart(product).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: any) => {
        console.log(err);
        this.toastService.presentToast(err.error.message, 'bottom');
      },
    });
  }

  removeFromCart(product: any) {
    console.log(product);
    this.productService.removeFromCart(product);
  }
}
