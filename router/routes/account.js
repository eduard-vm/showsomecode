export default {
  path: '/account',
  meta: {
    title: 'Кабинет',
  },
  component: () => import('../../views/Account/Index.vue'),
  children: [
    {
      path: 'profile',
      name: 'Profile',
      meta: {
        title: 'Профиль',
      },
      component: () => import('../../views/Account/Profile.vue'),
    },
    {
      path: 'orders',
      name: 'Orders',
      meta: {
        title: 'Заказы',
      },
      component: () => import('../../views/Account/Orders/Index.vue'),
    },
    {
      path: 'favorites',
      name: 'Favorites',
      meta: {
        title: 'Избранное',
      },
      component: () => import('../../views/Account/Favorites.vue'),
    },
    {
      path: 'bonuses',
      name: 'Bonuses',
      meta: {
        title: 'Бонусы',
      },
      component: () => import('../../views/Account/Bonuses/Index.vue'),
    },
    {
      path: '*',
      name: 'AllAccount',
      redirect: { name: 'Profile' },
    },
  ],
};
