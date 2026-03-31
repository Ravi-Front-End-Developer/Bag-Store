import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {} from '@ionic/angular/standalone';
import {
  cloudUploadOutline,
  closeCircle,
  imageOutline,
  chevronForwardOutline,
} from 'ionicons/icons'; // 3. Import specific icons
import { addIcons } from 'ionicons';
import { SHARED_MODULES } from 'src/app/shared/shared';
import { ImageService } from 'src/app/core/services/image.service';
import { ToastService } from 'src/app/core/services/toastService.service';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/core/services/productsService.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...SHARED_MODULES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ImageService],
})
export class AddProductPage implements OnInit {
  addProductForm!: FormGroup;
  bagCategory: string[] = [
    'Handbags',
    'Backpacks',
    'Wallets',
    'Totes',
    'Clutches',
    'Crossbody',
    'Satchels',
    'Duffel Bags',
    'Messenger Bags',
    'Travel Bags',
  ];
  // Array to hold the base64 or object URLs for the 5 slots
  uploadedImages: string = '';

  // Helper array to always render 5 slots in the HTML
  imageSlots = new Array(5);
  isEditMode: boolean = false;
  productId: any;
  constructor(
    private imageService: ImageService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private productService: ProductsService
  ) {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.getProductById(this.productId);
    }
    // Register the icons used in the UI
    addIcons({
      'cloud-upload-outline': cloudUploadOutline,
      'image-outline': imageOutline,
      'close-circle': closeCircle,
      'chevron-forward-outline': chevronForwardOutline,
    });
  }

  ngOnInit() {
    this.initAddProductForm();
  }

  initAddProductForm() {
    this.addProductForm = new FormGroup({
      productName: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      discountPrice: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  /**
   * Triggered when user selects files via the hidden input
   */
  onFilesSelected(event: any) {
    this.imageService.selectAndUpload().then((res: any) => {
      this.uploadedImages = res;
    });
  }

  /**
   * Final submission logic
   */
  addProduct() {
    if (this.addProductForm.invalid) return;

    // if (this.isEditMode && !this.uploadedImages) {
    //   this.toastService.presentToast('Please select an image', 'bottom');
    //   return;
    // }

    this.imageService
      .uploadImage(
        this.addProductForm.value,
        this.isEditMode,
        this.productId,
        this.uploadedImages
      )
      ?.subscribe({
        next: (res: any) => {
          console.log(res);
          if (res?.status == 200) {
            this.addProductForm.reset();
            this.uploadedImages = '';
            this.imageService.selectedBlob = undefined;
            this.imageService.imageUrl = undefined;
            this.toastService.presentToast(res?.message, 'bottom');
          }
        },
        error: (err: any) => {
          console.log(err);
          this.toastService.presentToast(err?.error?.message, 'bottom');
        },
      });
    console.log(this.addProductForm.value);
  }

  /**
   * Get product details by id
   */
  getProductById(productId: any) {
    this.productService.getProductsById(productId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.addProductForm.patchValue({
          productName: res.name,
          price: res.price,
          discountPrice: res.discount,
          category: res.category,
          description: res.description,
        });
        this.uploadedImages = res.image;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
