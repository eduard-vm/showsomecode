import account from './account';
import delivery from './delivery';
import blog from './blog';
import shop from './shop';
import oauth from './oatuh';
import HomeIndex from '../../views/Home/Index.vue';

const redirectPromoPages = [
  'travadan',
  '2020tea',
  'kak-zakazat',
  'skidka-na-pervyj-zakaz',
  'shop-podarki',
  'chaj-dani',
  'frogdog',
].map((code) => ({
  path: `/${code}`,
  redirect: {
    path: `/pages/${code}`,
  },
}));

export default [
  account,

  blog,

  ...shop,

  ...oauth,

  delivery,

  {
    path: '/product/:code',
    name: 'ProductCard',
    meta: {
      breadcrumb: 'Продукты',
      tab: 'Чайная мастерская — интернет-магазин teaworkshop в Москве',
    },
    component: () => import('../../views/Product/Index.vue'),
  },
  {
    path: '/search',
    name: 'SearchResultPage',
    meta: {
      breadcrumb: 'Результаты поиска',
      tab: 'Чайная мастерская — интернет-магазин teaworkshop в Москве - Результаты поиска',
    },
    props: (route) => ({ query: route.query.q }),
    component: () => import('../../views/SearchResultPage.vue'),
  },
  {
    path: '/',
    name: 'home',
    component: HomeIndex,
    meta: {
      title: 'Главная',
      tab: 'Чайная мастерская — интернет-магазин teaworkshop в Москве',
    },
  },

  {
    path: '/checkout',
    name: 'CheckoutPage',
    meta: {
      title: 'Оформление заказа',
      setIsReadyOnMount: true,
    },
    component: () => import('../../views/Checkout/Index.vue'),
  },
  {
    path: '/checkout/success',
    name: 'CheckoutSuccessPage',
    meta: {
      title: 'Оформление заказа',
      setIsReadyOnMount: true,
    },
    component: () => import('../../views/Checkout/Success.vue'),
  },
  {
    path: '/checkout/error',
    name: 'CheckoutErrorPage',
    meta: {
      title: 'Оформление заказа',
      setIsReadyOnMount: true,
    },
    component: () => import('../../views/Checkout/Error.vue'),
  },
  {
    path: '/faq',
    name: 'FAQ',
    meta: {
      title: 'FAQ',
      setIsReadyOnMount: true,
    },
    component: () => import('../../views/FAQ.vue'),
  },
  {
    path: '/reviews',
    name: 'Reviews',
    meta: {
      title: 'Отзывы',
    },
    component: () => import('../../views/Reviews/Index.vue'),
  },
  {
    path: '/contacts',
    name: 'Contacts',
    meta: {
      title: 'Контакты',
      setIsReadyOnMount: true,
    },
    component: () => import('../../views/Contacts.vue'),
  },
  {
    path: '/about',
    name: 'AboutPage',
    meta: {
      title: 'О нас',
      setIsReadyOnMount: true,
    },
    component: () => import('../../views/About'),
  },
  {
    path: '/recent',
    name: 'RecentPage',
    meta: {
      filterBy: 'latest',
      title: 'Все новинки в Чайной мастерской',
    },
    component: () => import('../../views/RecentProductsPage.vue'),
  },
  {
    path: '/hits_of_all_time',
    name: 'HitsOfAllTimePage',
    meta: {
      filterBy: 'hits_of_all_time',
      title: 'Хиты всех времен',
    },
    component: () => import('../../views/FilteredProducts/Index.vue'),
  },
  {
    path: '/sales',
    meta: {
      filterBy: 'sales',
      title: 'Все скидки в одном месте!',
    },
    component: () => import('../../views/FilteredProducts/Index.vue'),
  },
  {
    path: '/product-tag/:tag',
    meta: {
      title: 'Хиты всех времен',
    },
    component: () => import('../../views/FilteredProducts/Index.vue'),
  },
  {
    path: '/activation',
    meta: {
      title: 'Активация аккаунта',
      setIsReadyOnMount: true,
    },
    component: () => import('../../views/Activation.vue'),
  },
  {
    path: '/password-reset/:token',
    name: 'PasswordReset',
    meta: {
      title: 'Восстановление пароля',
      setIsReadyOnMount: true,
    },
    component: () => import('../../views/ResetPassword.vue'),
  },
  {
    path: '/password-reset-success',
    name: 'PasswordResetSuccess',
    meta: {
      title: 'Восстановление пароля',
      setIsReadyOnMount: true,
    },
    component: () => import('../../views/ResetPasswordSuccess.vue'),
  },

  {
    path: '/card',
    name: 'CardPage',
    meta: {
      title: 'О нас',
      setIsReadyOnMount: true,
    },
    component: () => import('../../views/pages/Card.vue'),
  },
  {
    path: '/pages/:code',
    name: 'PromoPage',
    component: () => import('../../views/PromoPage.vue'),
  },
  ...redirectPromoPages,
  {
    path: '/login-by-jwt-token',
    name: 'LoginByJwtToken',
    component: () => import('../../views/JWTAuth.js'),
  },
  {
    path: '*',
    name: 'Page404',
    meta: {
      title: 'Такой страницы у нас нет…',
      setIsReadyOnMount: true,
    },
    component: () => import('../../views/Page404.vue'),
  },
];
