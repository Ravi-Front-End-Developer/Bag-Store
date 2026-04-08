import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { personalInfoInterface } from 'src/app/shared/interfaces/personalInfo.interface';
import { SHARED_MODULES } from 'src/app/shared/shared';
import {
  email,
  form,
  maxLength,
  minLength,
  readonly,
  required,
} from '@angular/forms/signals';
import { PersonalInfoService } from 'src/app/core/services/personalInfo.service';
import { ToastService } from 'src/app/core/services/toastService.service';
import { format, parseISO } from 'date-fns';
import { FormErrorComponent } from 'src/app/shared/components/form-error/form-error.component';
import { LocationService } from 'src/app/core/services/location.service';
import { ImageService } from 'src/app/core/services/image.service';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
import { CommonService } from 'src/app/core/services/commonService.service';
@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
  standalone: true,
  imports: [...SHARED_MODULES, FormErrorComponent],
})
export class PersonalInfoPage implements OnInit {
  unformattedDOB: any;
  // Array to hold the base64 or object URLs for the 5 slots
  uploadedImages: string = '';

  addresslabels: any[] = ['Home', 'Work', 'Other'];
  // Create a computed signal to show the age number
  ageDisplay = computed(() => {
    const birthDate = this.personalInfoForm.dateOfBirth().value();
    if (!birthDate) return '';

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    return `(${age} Years Old)`;
  });

  maxDate = new Date().toISOString();

  countriesList = signal<any[]>([]);
  statesList = signal<any[]>([]);
  citiesList = signal<any[]>([]);

  genders = signal<any[]>(['Female', 'Male', 'Other']);

  personalInfoModel = signal<personalInfoInterface>({
    firstName: '',
    lastName: '',
    mobileNo: '',
    email: '',
    gender: '',
    profilePic: new Blob(),
    addressLine: '',
    dateOfBirth: '',
    city: '',
    state: '',
    zipCode: 123456,
    country: '',
    label: '',
    otherLabel: '',
    isDefault: true,
  });
  personalInfoForm = form(this.personalInfoModel, (fields) => {
    required(fields.firstName, {
      message: 'Please enter a first name',
    });
    required(fields.lastName, {
      message: 'Please enter a last name',
    });
    required(fields.mobileNo, {
      message: 'Please enter a mobile number',
    });
    minLength(fields.mobileNo, 10, {
      message: 'Please enter a valid mobile number',
    });
    maxLength(fields.mobileNo, 10, {
      message: 'Please enter a valid mobile number',
    });

    // Apply email validation
    required(fields.email, { message: 'Please enter a email address' });
    email(fields.email, { message: 'Please enter a valid email address' }); // here, email is inbuilt fx. provide email validation to email field (fields.email)

    required(fields.gender, { message: 'Please select a gender' });
    required(fields.dateOfBirth, { message: 'Please enter a date of birth' });
    readonly(fields.dateOfBirth);
    // required(fields.profilePic, { message: 'Please upload a profile picture' });
    required(fields.addressLine, { message: 'Please enter an address line' });
    required(fields.city, { message: 'Please select a city' });
    required(fields.state, { message: 'Please select a state' });
    required(fields.zipCode, { message: 'Please enter a zip code' });
    required(fields.country, { message: 'Please select a country' });
    required(fields.label, { message: 'Please select a label' });
    required(fields.otherLabel, {
      // Only binds the 'required' error if 'isDelivery' is true
      when: ({ valueOf }) => valueOf(fields.label) === 'Other',
      message: 'Other field is required',
    });
  });

  savedData: any;

  constructor(
    private personalInfoService: PersonalInfoService,
    private toastService: ToastService,
    private locationService: LocationService,
    private imageService: ImageService,
    private commonService: CommonService
  ) {
    addIcons({ cameraOutline });
    this.getCountries();

    effect(() => {
      this.callGetStateAPI();
    });

    effect(() => {
      this.callGetCityAPI();
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.savedData = this.commonService.getProfileData();
      if (this.savedData) {
        console.log(this.savedData);
        this.personalInfoModel.set(this.savedData.profile);
        console.log(this.personalInfoModel());
      }
    }, 0);
  }

  callGetStateAPI() {
    const selectedCountry = this.personalInfoForm.country().value();
    if (selectedCountry) {
      this.personalInfoForm.state().value.set('');
      this.getStates(selectedCountry);
    }
  }

  callGetCityAPI() {
    const selectedState = this.personalInfoForm.state().value();
    if (selectedState) {
      this.personalInfoForm.city().value.set('');
      this.getCities(selectedState);
    }
  }

  /**
   * submit
   */
  onSubmit() {
    // Call the form as a signal to get the root state
    const errors = this.personalInfoForm().errorSummary();
    console.log('All Form Errors:', errors);
    console.log(this.personalInfoForm().value());
    if (this.personalInfoForm().invalid()) {
      return;
    }
    console.log('Submitted:', this.personalInfoModel());
    this.personalInfoService
      .postPersonalInfo(this.personalInfoForm().value())
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.toastService.presentToast(res['message'], 'bottom');
        },
        error: (err) => {
          console.log(err);
          this.toastService.presentToast(
            err.error?.message || err.error?.error?.message,
            'bottom'
          );
        },
      });
  }

  /**
   * GET COUNTRY
   */
  getCountries() {
    this.locationService.getCountries().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res) {
          this.countriesList.set(res);
        }
        this.toastService.presentToast(res['message'], 'bottom');
      },
      error: (err) => {
        console.log(err);
        this.toastService.presentToast(err.error.message, 'bottom');
      },
    });
  }

  /**
   * GET STATE
   */
  getStates(country: string) {
    this.locationService.getStates(country).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res) {
          this.statesList.set(res);
          if (this.savedData) {
            this.personalInfoModel.update((state) => ({
              ...state,
              state: this.savedData.profile.state,
            }));
          }
        }
        // this.toastService.presentToast(res['message'], 'bottom');
      },
      error: (err) => {
        console.log(err);
        this.toastService.presentToast(err.error.message, 'bottom');
      },
    });
  }

  /**
   * GET CITY
   */
  getCities(state: string) {
    this.locationService
      .getCities(this.personalInfoForm.country().value(), state)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          if (res) {
            this.citiesList.set(res);
            if (this.savedData) {
              this.personalInfoModel.update((state) => ({
                ...state,
                city: this.savedData.profile.city,
              }));
            }
          }
          // this.toastService.presentToast(res['message'], 'bottom');
        },
        error: (err) => {
          console.log(err);
          this.toastService.presentToast(err.error.message, 'bottom');
        },
      });
  }

  /**
   * onDateChange
   * @param event
   */
  onDateChange(event: any) {
    if (event.detail.value) {
      this.unformattedDOB = event.detail.value;
      const selectedDate = event.detail.value;
      // Update your signal model
      this.personalInfoModel.update((state) => ({
        ...state,
        dateOfBirth: format(parseISO(selectedDate), 'MMM d, yyyy'),
      }));
    }
  }

  /**
   * SELECT LABEL
   */
  selectLabel(label: string) {
    console.log(label);
    this.personalInfoModel.update((state) => ({
      ...state,
      label,
    }));
    if (label === 'Other') {
      this.personalInfoModel.update((state) => ({
        ...state,
        otherLabel: '',
      }));
      this.personalInfoForm.otherLabel().required();
    } else {
      this.personalInfoForm.otherLabel().errors();
    }
  }

  /**
   * Triggered when user selects files via the hidden input
   */
  onFilesSelected(event: any) {
    this.imageService.selectAndUpload('profilePic').then((res: any) => {
      this.uploadedImages = res.imageUrl;
      this.personalInfoModel.update((state) => ({
        ...state,
        profilePic: res.selectedBlob,
      }));
    });
  }
}
