import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'personal-info',
    loadComponent: () =>
      import('./personal-info/personal-info.page').then(
        (m) => m.PersonalInfoPage
      ),
  },
];
