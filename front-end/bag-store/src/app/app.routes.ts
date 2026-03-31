import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth/:type',
    loadComponent: () =>
      import('./pages/prelogin/signup/signup.page').then((m) => m.SignupPage),
  },
  {
    path: 'admin/addproduct',
    loadComponent: () =>
      import('./pages/postlogin/admin/add-product/add-product.page').then(
        (m) => m.AddProductPage
      ),
  },
  {
    path: 'admin/editproduct/:id',
    loadComponent: () =>
      import('./pages/postlogin/admin/add-product/add-product.page').then(
        (m) => m.AddProductPage
      ),
  },
  {
    path: 'admin/adminpanel',
    loadComponent: () =>
      import('./pages/postlogin/admin/admin-panel/admin-panel.page').then(
        (m) => m.AdminPanelPage
      ),
  },
  {
    path: 'productslist',
    loadComponent: () =>
      import('./pages/postlogin/products-list/products-list.page').then(
        (m) => m.ProductsListPage
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/postlogin/cart/cart.page').then((m) => m.CartPage),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/postlogin/profile/profile.routes').then(
        (m) => m.profileRoutes
      ),
    // loadComponent: () =>
    //   import('./pages/postlogin/profile/profile.page').then(
    //     (m) => m.ProfilePage
    //   ),
  },
  {
    path: 'productdetails/:id',
    loadComponent: () =>
      import('./pages/postlogin/product-details/product-details.page').then(
        (m) => m.ProductDetailsPage
      ),
  },
  {
    path: 'personal-info',
    loadComponent: () =>
      import('./pages/postlogin/profile/personal-info/personal-info.page').then(
        (m) => m.PersonalInfoPage
      ),
  },
];
