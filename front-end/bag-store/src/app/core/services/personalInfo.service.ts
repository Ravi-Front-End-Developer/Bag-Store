import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { personalInfoInterface } from 'src/app/shared/interfaces/personalInfo.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoService {
  constructor(private http: HttpClient) {}
  profileImageBlob: Blob | undefined; // For uploading to MongoDB

  postPersonalInfo(data: personalInfoInterface) {
    console.log(data);
    // this.profileImageBlob = data.profilePic
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('mobileNo', data.mobileNo);
    formData.append('email', data.email);
    formData.append('gender', data.gender);
    // formData.append('profileImage', data.profilePic);
    formData.append('profileImage', data.profilePic, `profile_${Date.now()}.jpg`);
    formData.append('addressLine', data.addressLine);
    formData.append('dateOfBirth', data.dateOfBirth);
    formData.append('country', data.country);
    formData.append('state', data.state);
    formData.append('city', data.city);
    formData.append('zipCode', data.zipCode ? data.zipCode.toString() : '');
    formData.append('label', data.label);
    formData.append('otherLabel', data.otherLabel);
    formData.append('isDefault', data.isDefault.toString());
    return this.http.post<personalInfoInterface>(
      environment.appBaseUrl + '/profile/savePersonalDetails',
      formData
    );
  }

  getProfile() {
    return this.http.get<personalInfoInterface>(
      environment.appBaseUrl + '/profile'
    );
  }
}
