const routes = {
  '/': import(/* webpackChunkName: "home-view" */ '../views/pages/home.view')
    .then((view) => view.default),
};

export default routes;
