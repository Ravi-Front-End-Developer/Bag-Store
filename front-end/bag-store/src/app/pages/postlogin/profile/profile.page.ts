import { Component, OnInit } from '@angular/core';

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
import { PersonalInfoService } from 'src/app/core/services/personalInfo.service';
import { ToastService } from 'src/app/core/services/toastService.service';
import { CommonService } from 'src/app/core/services/commonService.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [FormsModule, ...SHARED_MODULES],
})
export class ProfilePage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private personalInfoService: PersonalInfoService,
    private toastService: ToastService,
    private commonService: CommonService
  ) {
    addIcons({
      personOutline,
      cubeOutline,
      cardOutline,
      personAddOutline,
      headsetOutline,
      logOutOutline,
    });
    this.getData();
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

  /**
   * GET DATA
   */
  getData() {
    this.personalInfoService.getProfile().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res) {
          this.commonService.setProfileData(res);
        }
        this.toastService.presentToast(res['message'], 'bottom');
      },
      error: (err) => {
        console.log(err);
        this.toastService.presentToast(err.error.message, 'bottom');
      },
    });
  }
}
