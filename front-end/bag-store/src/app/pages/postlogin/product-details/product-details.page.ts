import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SHARED_COMPONENTS, SHARED_MODULES } from 'src/app/shared/shared';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  cartOutline,
  ellipsisHorizontal,
  personOutline,
  star,
} from 'ionicons/icons';
import { NavController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/core/services/productsService.service';
import { Product } from 'src/app/shared/interfaces/product.interface';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ...SHARED_MODULES],
})
export class ProductDetailsPage implements OnInit {
  productId: string = '';
  productDetails: Product = {};
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private productService: ProductsService
  ) {
    this.productId = this.route.snapshot.params['id'];
    console.log(this.productId);
    if (this.productId) {
      this.getProductDetails();
    }
    addIcons({
      ellipsisHorizontal,
      arrowBackOutline,
      star,
      personOutline,
      cartOutline,
    });
  }

  ngOnInit() {}

  getProductDetails() {
    this.productService.getProductsById(this.productId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.productDetails = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}
