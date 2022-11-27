import HomeView from '../views/pages/home.view';

const routes = {
  '/': HomeView,
  '/signin': import(/* webpackChunkName: "signin-view" */ '../views/pages/auth/signin.view')
    .then((view) => view.default),
  '/signup': import(/* webpackChunkName: "signup-view" */ '../views/pages/auth/signup.view')
    .then((view) => view.default),
  '/maps': import(/* webpackChunkName: "maps-view" */ '../views/pages/maps.view')
    .then((view) => view.default),
  '/transactions': import(/* webpackChunkName: "transactions-view" */ '../views/pages/transaction/lists.view')
    .then((view) => view.default),
  '/transactions/:id': import(/* webpackChunkName: "transactions-detail-view" */ '../views/pages/transaction/detail.view')
    .then((view) => view.default),
  '/profile': import(/* webpackChunkName: "profile-view" */ '../views/pages/profile.view')
    .then((view) => view.default),
  '/product': import(/* webpackChunkName: "new-product-view" */ '../views/pages/product/new.view')
    .then((view) => view.default),
  '/product/:id': import(/* webpackChunkName: "product-detail-view" */ '../views/pages/product/detail.view')
    .then((view) => view.default),
};

export default routes;
