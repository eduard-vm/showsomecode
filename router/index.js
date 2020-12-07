/* eslint-disable no-underscore-dangle */
import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes/index';

Vue.use(Router);

// Эти маршруты будут определены в роутере
export const topbar = [
  {
    title: 'Доставка и оплата',
    link: '/delivery',
  },
  {
    title: 'О нас',
    link: '/about',
  },
  {
    title: 'FAQ',
    link: '/faq',
  },
  {
    title: 'Отзывы',
    link: '/reviews',
  },
  {
    title: 'Контакты',
    link: '/contacts',
  },
];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    /**
     * @description
     * Когда пагинация в категории или
     * когда фильтруются категории по тегам
     * надо сохранять позицию прокрутки
     */
    if (to.name === from.name && to.name === 'Shop' && to.query && to.query.page) {
      return savedPosition;
    }

    if ((from.hash && to.hash) || (to.hash && to.name === 'Shop')) {
      return savedPosition;
    }

    if (window.innerWidth < 992) {
      document.getElementById('app').scrollTop = 0;
    }

    return { x: 0, y: 0 };
  },
});

router.onError((error) => {
  if (/loading chunk .* failed/i.test(error.message)) {
    // eslint-disable-next-line no-alert
    if (window.confirm('Ошибка загрузки необходимых скриптов. Необходимо перезагрузить страницу.')) {
      const { id, enabled } = __config.yametric;
      if (enabled && ym) {
        ym(id, 'reachGoal', 'loading_chunk_failed');
      }
      window.location.reload(true);
    }
  }
});

router.beforeEach((to, from, next) => {
  const app = document.body.querySelector('#app');
  app.removeAttribute('render');
  next();
});

router.afterEach((to, from) => {
  const isToShopRoute = to.name === 'Shop';

  const app = document.body.querySelector('#app');
  if (to.meta.setIsReadyOnMount) {
    Vue.nextTick(() => {
      app.setAttribute('render', 'ready');
    });
  }
  const { id, enabled } = __config.yametric;
  if (enabled) {
    if (window.ym) {
      window.ym(id, 'hit', to.path, {
        referer: from.path,
      });
    }
    if (window.VK && window.VK.Retargeting) {
      delete window.VK._pData;
      window.VK.Retargeting.Hit(window.location);
    }
  }

  if (window.innerWidth < 992) {
    if (app && !isToShopRoute) {
      app.scrollTop = 0;
    }
  }
});

export default router;
