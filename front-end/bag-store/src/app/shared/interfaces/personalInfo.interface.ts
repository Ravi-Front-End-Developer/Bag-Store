export interface personalInfoInterface {
  // Personal Info
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  gender: string;
  profilePic: Blob;
  dateOfBirth: string;
  // Address table
  addressLine: string;
  city: string;
  state: string;
  zipCode: number | null;
  country: string;
  label: string;
  otherLabel: string;
  isDefault: boolean;
}
