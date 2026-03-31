import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SHARED_MODULES } from 'src/app/shared/shared';
import { addIcons } from 'ionicons';
import {
  personOutline,
  cubeOutline,
  cardOutline,
  headsetOutline,
  personAddOutline,
  logOutOutline,
} from 'ionicons/icons';
import { AuthService } from 'src/app/core/services/authService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ...SHARED_MODULES],
})
export class ProfilePage implements OnInit {
  constructor(private authService: AuthService, private router: Router) {
    addIcons({
      personOutline,
      cubeOutline,
      cardOutline,
      personAddOutline,
      headsetOutline,
      logOutOutline,
    });
  }

  ngOnInit() {}

  logout() {
    this.authService.logout().then((res) => {
      console.log(res);
      this.router.navigate(['/auth/signup']);
    });
  }

  goToLink() {
    this.router.navigate(['/personal-info']);
  }
}
