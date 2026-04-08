import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}
  profileData: any;
  setProfileData(data: any) {
    this.profileData = data;
  }

  getProfileData() {
    return this.profileData;
  }
}
