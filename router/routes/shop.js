export default [
  // TEA-455: REDIRECT
  {
    path: '/shop/tea/herbs/*',
    redirect: ({ path }) => path.replace('/tea/', '/'),
  },
  {
    path: '/shop/tea/mate/*',
    redirect: ({ path }) => path.replace('/tea/', '/'),
  },
  {
    path: '/shop/:rootcat/:subcat1?/:subcat2?/:cat3?/:cat4?/:cat5?/:cat6?/:cat7?',
    name: 'Shop',
    component: () => import('../../views/Categories/Index.vue'),
  },
];
