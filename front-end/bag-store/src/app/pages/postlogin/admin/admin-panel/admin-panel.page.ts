import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { createSharp, personAddSharp } from 'ionicons/icons';
import { Router } from '@angular/router';
import { SHARED_MODULES } from 'src/app/shared/shared';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ...SHARED_MODULES, HeaderComponent],
})
export class AdminPanelPage implements OnInit {
  constructor(private router: Router) {
    addIcons({
      personAddSharp,
      createSharp,
    });
  }

  ngOnInit() {}

  goToAddProduct() {
    this.router.navigate(['admin/addproduct']);
  }

  goToProductList() {
    this.router.navigate(['/productslist']);
  }
}
