import HomeView from '../views/pages/home.view';

const routes = {
  '/': () => HomeView,
  '/signin': () => import(/* webpackChunkName: "signin-view" */ '../views/pages/auth/signin.view'),
  '/signup': () => import(/* webpackChunkName: "signup-view" */ '../views/pages/auth/signup.view'),
  '/forgot-password': () => import(/* webpackChunkName: "forgot-password-view" */ '../views/pages/auth/forgot-password.view'),
  '/reset-password': () => import(/* webpackChunkName: "reset-password-view" */ '../views/pages/auth/reset-password.view'),
  '/maps': () => import(/* webpackChunkName: "maps-view" */ '../views/pages/maps.view'),
  '/transactions': () => import(/* webpackChunkName: "transactions-view" */ '../views/pages/transaction/lists.view'),
  '/transactions/:id': () => import(/* webpackChunkName: "transactions-detail-view" */ '../views/pages/transaction/detail.view'),
  '/request/:id': () => import(/* webpackChunkName: "transactions-detail-view" */ '../views/pages/transaction/detail.view'),
  '/profile': () => import(/* webpackChunkName: "profile-view" */ '../views/pages/profile.view'),
  '/profile/:id': () => import(/* webpackChunkName: "profile-detail-view" */ '../views/pages/user/detail.view'),
  '/profile-edit': () => import(/* webpackChunkName: "profile-edit-view" */ '../views/pages/profile.edit.view'),
  '/location': () => import(/* webpackChunkName: "location-update-view" */ '../views/pages/location.view'),
  '/product': () => import(/* webpackChunkName: "new-product-view" */ '../views/pages/product/new.view'),
  '/product-edit/:id': () => import(/* webpackChunkName: "edit-product-view" */ '../views/pages/product/edit.view'),
  '/product/:id': () => import(/* webpackChunkName: "product-detail-view" */ '../views/pages/product/detail.view'),
};

export default routes;
