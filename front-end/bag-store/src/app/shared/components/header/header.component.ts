import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnInit,
} from '@angular/core';
import { addIcons } from 'ionicons';
import {
  removeOutline,
  addOutline,
  heart,
  cartOutline,
  personCircleSharp,
  create,
  arrowBackOutline,
  chevronBackOutline,
} from 'ionicons/icons';
import { ProductsService } from 'src/app/core/services/productsService.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toastService.service';
import { AuthService } from 'src/app/core/services/authService.service';
// 1. IMPORT SPECIFIC STANDALONE COMPONENTS
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonBadge,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  // 2. USE INDIVIDUAL COMPONENTS INSTEAD OF IonicModule
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonBadge,
  ],
})
export class HeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() backBtn: boolean = true;
  @Input() cartBtn: boolean = false;
  @Input() profileBtn: boolean = false;
  @Input() cartCount: number = 0;
  constructor(
    public productService: ProductsService,
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    // Register the icons used in the UI
    addIcons({
      arrowBackOutline,
      chevronBackOutline,
      heart,
      removeOutline,
      addOutline,
      cartOutline,
      personCircleSharp,
      create,
    });
  }

  ngOnInit() {}

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
