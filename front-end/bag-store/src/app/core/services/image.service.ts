import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';

// Inside your class

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  imageUrl: string | undefined; // For previewing in HTML
  selectedBlob: Blob | undefined; // For uploading to MongoDB
  constructor(private http: HttpClient) {}
  async selectAndUpload() {
    // 1. Take or Pick a photo
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri, // Returns a path like blob:http://localhost...
        source: CameraSource.Photos, // Asks user: "Camera or Photos?"
      });

      // 1. Show the preview in your UI
      this.imageUrl = image.webPath;

      // 2. Convert the webPath to a Blob (Binary Large Object)
      const response = await fetch(image.webPath!);
      this.selectedBlob = await response.blob();

      //   const result = await this.uploadImage();
      //   if (result!) {
      //     return this.imageUrl || null;
      //   }

      return this.imageUrl || null;
    } catch (error) {
      console.error('User cancelled or camera failed', error);
      return null;
    }
  }

  uploadImage(
    dataObj: any,
    isEditMode: boolean,
    productId: any,
    imagePath: any
  ) {
    if (isEditMode) {
      if (!imagePath && !this.selectedBlob) {
        return throwError(() => ({
          error: {
            status: 400,
            message: 'Please select an image',
          },
        }));
      }
    } else {
      if (!this.selectedBlob) {
        return throwError(() => ({
          error: {
            status: 400,
            message: 'Please select an image',
          },
        }));
      }
    }

    console.log(dataObj);
    const formData = new FormData();
    if (this.selectedBlob) {
      formData.append('image', this.selectedBlob, `profile_${Date.now()}.jpg`);
    }

    formData.append('name', dataObj.productName);
    formData.append('price', dataObj.price);
    formData.append('discountPrice', dataObj.discountPrice);
    formData.append('category', dataObj.category);
    formData.append('description', dataObj.description);
    formData.append('editMode', String(isEditMode));
    if (isEditMode) {
      formData.append('prodCurrentId', productId);
    }
    // return true;
    if (isEditMode) {
      return this.http.put(
        `http://localhost:3000/api/products/update/${productId}`,
        formData
      );
    } else {
      return this.http.post(
        'http://localhost:3000/api/products/create',
        formData
      );
    }
  }
}
