export default {
  path: '/delivery',
  meta: {
    title: 'Доставка и оплата',
  },
  component: () => import('../../views/Delivery/Index.vue'),
  children: [
    {
      path: '/',
      name: 'Delivery',
      meta: {
        title: 'Доставка',
        setIsReadyOnMount: true,
      },
      component: () => import('../../views/Delivery/Delivery.vue'),
    },
    {
      path: 'payment',
      name: 'Payment',
      meta: {
        title: 'Оплата',
        setIsReadyOnMount: true,
      },
      component: () => import('../../views/Delivery/Payment.vue'),
    },
    {
      path: 'return',
      name: 'Return',
      meta: {
        title: 'Возврат',
        setIsReadyOnMount: true,
      },
      component: () => import('../../views/Delivery/Return.vue'),
    },
    {
      path: 'privacy',
      name: 'Privacy',
      meta: {
        title: 'Оферта',
        setIsReadyOnMount: true,
      },
      component: () => import('../../views/Delivery/Privacy.vue'),
    },
    {
      path: '*',
      name: '404Delivery',
      redirect: { name: 'Delivery' },
    },
  ],
};
