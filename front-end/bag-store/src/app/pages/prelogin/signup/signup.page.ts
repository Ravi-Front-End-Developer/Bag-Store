import { Component, NgZone, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { addIcons } from 'ionicons'; // 2. Import the helper
import { logoApple, logoGoogle } from 'ionicons/icons'; // 3. Import specific icons
import { SHARED_MODULES } from 'src/app/shared/shared';
import { AuthService } from 'src/app/core/services/authService.service';
import { ToastService } from 'src/app/core/services/toastService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...SHARED_MODULES,
    LottieComponent,
  ],
})
export class SignupPage implements OnInit {
  private animationItem: any; // Store the Lottie instance
  isSplashScreenActive: boolean = true;
  options: AnimationOptions = {
    path: '/assets/splash.json', // Ensure your file is in src/assets/
    loop: false, // MUST be false
    autoplay: false,
    rendererSettings: {
      // 'xMidYMid meet' = Shows the whole animation, adds letterboxing if needed.
      // 'xMidYMid slice' = Fills the screen (like background-size: cover).
      preserveAspectRatio: 'xMidYMid meet',
      progressiveLoad: true, // Better for low-end mobile devices
      hideOnTransparent: true,
    },
  };

  signupForm!: FormGroup;
  loginForm!: FormGroup;
  selectedSegment = signal<string>('login');

  // This fires automatically when the JSON animation reaches its last frame
  onAnimationComplete() {
    // A tiny 200ms pause so the user can "see" the final frame
    this.ngZone.run(() => {
      setTimeout(() => {
        this.isSplashScreenActive = false;
      }, 200);
    });
  }

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone
  ) {
    addIcons({
      logoGoogle,
      logoApple,
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const type = params['type'];
      if (type == 'login' || type == 'signup') {
        this.selectedSegment.set(type);
      } else {
        this.selectedSegment.set('login');
      }
    });
    this.initSignUpForm();
    this.initLoginForm();
  }

  animationCreated(animationItem: any): void {
    this.animationItem = animationItem;

    // The animation is "ready" but paused because autoplay is false
    setTimeout(() => {
      this.animationItem.setSpeed(0.8); // Slow it down for a smooth look
      this.animationItem.play(); // START the animation now
    }, 1000);
  }
  initSignUpForm() {
    this.signupForm = new FormGroup({
      fullname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      role: new FormControl(false),
    });
  }

  initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  signUp() {
    if (this.signupForm.invalid) {
      this.toastService.presentToast('Please fill all the fields*', 'bottom');
      return;
    }

    if (this.signupForm.value.role == true) {
      this.signupForm.value.role = 'admin';
    } else {
      this.signupForm.value.role = 'user';
    }
    this.authService.signUp(this.signupForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.selectedSegment.set('login');
        this.signupForm.reset();
        this.toastService.presentToast(res.message, 'bottom');
      },
      error: (err: any) => {
        console.log(err);
        if (err.error.message.toLowerCase() == 'user already exists') {
          this.toastService.presentToast(err.error.message, 'bottom');
        }
      },
    });
    console.log(this.signupForm.value);
  }

  login() {
    if (this.loginForm.invalid) {
      this.toastService.presentToast('Please fill all the fields*', 'bottom');
      return;
    }
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.authService.saveToken(res.token);
        this.toastService.presentToast(res.message, 'bottom');
        this.authService.updateRole(res.role.toLowerCase());
        res.role.toLowerCase() == 'user'
          ? this.router.navigate(['/productslist'])
          : this.router.navigate(['/admin/adminpanel']);
      },
      error: (err: any) => {
        console.log(err);
        if (err.error.status == 401) {
          this.toastService.presentToast(err.error.message, 'bottom');
        } else {
          this.toastService.presentToast('Something went wrong', 'bottom');
        }
      },
    });
    console.log(this.signupForm.value);
  }

  getSelectedSegment(event: any) {
    this.selectedSegment.set(event.detail.value);
    this.signupForm.reset();
    this.loginForm.reset();
  }

  isAdminTicket(event: any) {
    console.log(event);
    // if (event.detail.checked) {
    //   this.signupForm.value.role = 'admin';
    // } else {
    //   this.signupForm.value.role = 'user';
    // }
    console.log(this.signupForm.value);
  }
}
