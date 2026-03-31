import { Component, OnInit, signal } from '@angular/core';
import { personalInfoInterface } from 'src/app/shared/interfaces/personalinfo.interface';
import { SHARED_MODULES } from 'src/app/shared/shared';
// import { form } from '@angular/forms/';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
  standalone: true,
  imports: [...SHARED_MODULES],
})
export class PersonalInfoPage implements OnInit {
  personalInfoModel = signal<personalInfoInterface>({
    firstName: '',
    lastName: '',
    mobileNo: '',
    email: '',
    gender: '',
    mobile: '',
    profilePic: '',
    addressLine: '',
    city: '',
    state: '',
    zipCode: 0,
    country: '',
    label: '',
    isDefault: false,
  });
  // personalInfoForm = form(this.personalInfoModel);
  constructor() {
    // personalInfoModel;
  }

  ngOnInit() {}
}
