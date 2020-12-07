export default {
  path: '/blog',
  component: () => import('../../views/Blog/Index.vue'),
  meta: {
    breadcrumb: 'Главная',
    tab: 'Чайная мастерская — интернет-магазин teaworkshop в Москве',
  },
  children: [
    {
      path: '/',
      name: 'Blog',
      component: () => import('../../views/Blog/BlogList.vue'),
      meta: {
        breadcrumb: 'Блог',
        tab: 'Чайная мастерская — интернет-магазин teaworkshop в Москве',
      },
    },
    {
      path: ':code',
      name: 'BlogPost',
      component: () => import('../../views/Blog/BlogPost.vue'),
      meta: {
        breadcrumb: 'Блог',
        tab: 'Чайная мастерская — интернет-магазин teaworkshop в Москве',
      },
    },
    {
      path: 'to/:category',
      name: 'Category',
      component: () => import('../../views/Blog/BlogList.vue'),
      meta: {
        breadcrumb: 'Блог',
        tab: 'Чайная мастерская — интернет-магазин teaworkshop в Москве',
      },
    },
  ],
};
