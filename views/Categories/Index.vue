<template>
  <keep-alive>
    <s-page v-if="pageIsReady && code" class="page-categories" :breadcrumb="breadcrumbs" :title="title" :loading="true">
      <div style="display: none" itemscope itemtype="http://schema.org/Product">
        <p itemprop="name">{{ title }}</p>
        <!-- <div itemtype="http://schema.org/AggregateOffer" itemscope="" itemprop="offers">
          <meta :content="offerCount" itemprop="offerCount">
          <meta :content="highPrice" itemprop="highPrice">
          <meta :content="lowPrice" itemprop="lowPrice">
          <meta content="RUB" itemprop="priceCurrency">
        </div> -->
      </div>
      <div class="s-container s-container--m-flat">
        <category-tags class="page-categories__tags" :tags="availableTags" :loading="tagsIsPending" />
      </div>
      <div class="s-container" >
        <categories-list class="page-categories__categories" v-if="categories.length" :loading="categoryIsPending" :categories="categories" />
      </div>
      <category-products
        :infoText="category.informBlockText"
        :infoTitle="category.informBlockTitle"
        :keep-products="keepProducts"
        class="page-categories__category-products" id="productsSection"
      />
      <div class="s-container" >
        <recently-watched class="page-categories__recently-watched" />
      </div>
      <subscription-banner class="page-categories__banner" />
      <category-description class="page-categories__description" v-if="description" :loading="categoryIsPending" :description="description" />
    </s-page>
    <div v-else-if="!pageIsReady" class="s-container flex-row justify-center align-center page-loader">
      <app-spiner />
    </div>
    <error-page v-else-if="pageIsReady && !code" :code="errStatusCode" />
  </keep-alive>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { get as _get } from '../../utils';
import { routesNamesAssocMap } from './static';
import { categoryHelpers, metaHelpers } from '../../helpers';
import CategoryTags from './components/CategoryTags.vue';
import CategoriesList from '../../components/Categories/CategoriesList.vue';
import RecentlyWatched from '../../components/Products/RecentlyWatched.vue';
import CategoryProducts from './components/CategoryProducts.vue';
import SubscriptionBanner from '../../components/ShopBanners/SubscriptionBanner.vue';
import CategoryDescription from './components/CategoryDescription.vue';
import ErrorPage from '../ErrorPage.vue';

let scrollPositionKey = null;

const setY = (y) => setTimeout(() => {
  if (window.innerWidth < 992) {
    document.getElementById('app').scrollTop = y;
  } else {
    window.scrollTo(0, y);
  }
}, 30);

const getY = () => (window.innerWidth < 992
  ? document.getElementById('app').scrollTop
  : window.scrollY);

const templateTitle = '%%title%% купить в Москве';
/**
 * у нас есть категории
 * у нас есть теги
 * теги это такие псевдокатегории,
 * при нажатии на который должна поменяться урла страницы,
 * отобразиться категории и теги КАТЕГОРИИ,
 * и отобразить товары этого тега
 */
export default {
  name: 'page-categories',

  components: {
    CategoryProducts,
    SubscriptionBanner,
    CategoryDescription,
    RecentlyWatched,
    CategoryTags,
    CategoriesList,
    ErrorPage,
  },

  data() {
    return {
      breadcrumbs: [
        { text: 'Главная', link: '/' },
      ],
      path: [],
      pageIsReady: false,
      errStatusCode: null,
      code: null,
      keepProducts: false,
    };
  },

  computed: {
    ...mapGetters({
      isMobile: 'dom/isMobile',
      getRootCategory: 'categories/getRootCategoryByCode',
    }),

    ...mapState({
      categoryIsPending: ({ categories }) => categories.loading.category,
      tagsIsPending: ({ categories }) => categories.loading.tags,
      tagInfoLoading: ({ categories }) => categories.loading.tagInfo,
      productsIsPending: ({ products }) => products.loading.products,
      category: ({ categories }) => categories.category,
      products: ({ products }) => products.products,
      tags: ({ categories }) => categories.tags,
      tag: ({ categories }) => categories.tag,
      tagInfo: ({ categories }) => categories.tagInfo,
    }),

    offerCount() {
      return 0;
    },

    highPrice() {
      return 0;
    },

    lowPrice() {
      return 0;
    },

    isNestedCategory() {
      return Boolean(this.$route.params.subcat1);
    },

    showTitle() {
      if (!this.isNestedCategory && !this.categories.length) {
        return false;
      }
      return Boolean(this.category);
    },

    availableTags() {
      if (this.category) {
        const categories = this.categories.map(({ code }) => code);
        return this.tags.filter((tag) => !categories.includes(tag.code.replace('_tag', '')));
      }
      return [];
    },

    loading() {
      return this.categoryIsPending;
    },

    title() {
      if (this.tag && this.tag.name) {
        return this.tag.name;
      }

      if (this.category) {
        if (routesNamesAssocMap[this.category.code]) {
          return routesNamesAssocMap[this.category.code].title || null;
        }

        return this.category.name;
      }

      return null;
    },

    categories() {
      if (this.category) {
        return this.category.children;
      }
      return [];
    },

    metaTitle() {
      if (this.tagInfo && this.tagInfo.metaTitle) {
        return this.tagInfo.metaTitle;
      }

      if (this.tag && this.tag.name) {
        return templateTitle.replace(/%%title%%/g, this.tag.name);
      }

      if (this.category && this.category.metaTitle) {
        return this.category.metaTitle;
      }

      return null;
    },

    metaDescription() {
      if (this.tagInfo && this.tagInfo.metaDescription) {
        return this.tagInfo.metaDescription;
      }
      if (this.category && this.category.metaDescription) {
        return this.category.metaDescription;
      }

      return null;
    },

    metaKeywords() {
      if (this.tagInfo && this.tagInfo.metaKeywords) {
        return this.tagInfo.metaKeywords;
      }
      if (this.category && this.category.metaKeywords) {
        return this.category.metaKeywords;
      }

      return null;
    },

    shortDescription() {
      if (this.tagInfo && this.tagInfo.shortDescription) {
        return this.tagInfo.shortDescription;
      }

      if (this.category) {
        return this.category.shortDescription;
      }

      return null;
    },

    canonicalUrl() {
      const prop = 'canonicalUrl';
      const tagCanonical = _get(this.tagInfo, prop);
      if (tagCanonical) {
        return tagCanonical;
      }
      return _get(this.category, prop, null);
    },

    description() {
      if (this.tagInfo && this.tagInfo.description) {
        return this.tagInfo.description;
      }

      if (this.tag && this.tag.description) {
        return this.tag.description;
      }

      if (this.tag && this.tag.shortDescription) {
        return this.tag.shortDescription;
      }

      if (this.category) {
        return this.category.description || '';
      }
      return '';
    },

    isPending() {
      return ![this.tagsIsPending, this.categoryIsPending, this.tagInfoLoading, this.productsIsPending].every((i) => !i);
    },
  },

  watch: {
    $route: 'setData',

    isPending(isPending) {
      const app = document.body.querySelector('#app');
      if (!isPending) {
        this.$meta().resume();
      }
      const renderState = isPending ? 'wait' : 'ready';
      app.setAttribute('render', renderState);
    },
  },

  methods: {
    ...mapActions({
      getCategories: 'categories/getAllCategories',

      unsetCategory: 'categories/unsetCategory',
      getCategory: 'categories/getCategory',
      getCategoryTags: 'categories/getCategoryTags',
      getTagInfo: 'categories/getTagInfo',
      unsetTagInfo: 'categories/unsetTagInfo',
      setTag: 'categories/setTag',
    }),

    async setData() {
      const { params } = this.$route;
      let tagCode = null;
      let catCode = null;
      this.setTag();

      /** Получаю параметры адреса */
      const path = Object.values(params).filter(Boolean);
      /**
       * Если есть параметр по имени tag
       * значит последний элемент яв-ся
       * кодом для тега, код категории будет
       * третьим с конца, иначе код категории
       * всегда последний элемент
       */
      if (path.includes('tag')) {
        tagCode = path[path.length - 1];
        catCode = path[path.length - 3];
      } else {
        catCode = path[path.length - 1];
        this.unsetTagInfo();
      }

      /**
       * Если код категории осталася прежний
       * то обновлю только тег, если он установлен
       */
      if (this.code === catCode && tagCode && this.tags && this.tags.length) {
        const tag = this.tags.find(({ code }) => tagCode === code);
        if (tag) {
          this.setTag(tag);
          if (tag) {
            await this.getTagInfo(tagCode);
          }
        }
        /**
         * Не делаю запрос если код категории
         * совпадает с текущим, после отключния тега
         * продукты будут доступны из уже загруженой
         * категории
         */
      } else if (this.code !== catCode) {
        try {
          const tags = await this.getCategoryTags(catCode) || [];

          if (tagCode && tags && tags.length) {
            const tag = tags.find(({ code }) => tagCode === code);
            if (tag) {
              this.setTag(tag);
              this.getTagInfo(tagCode);
            }
          }

          await this.getCategory(catCode);
          this.setBreadcrumbs(path);
          this.code = catCode;
        } catch (err) {
          console.warn('error ', err);
          if (err === 'GET_TAGS_404') {
            console.error('Теги не найдены');
          } else if (err.status) {
            console.error('STATUS 500');
            this.errStatusCode = parseInt(err.status, 10);
            this.code = null;
          }
        } finally {
          this.pageIsReady = true;
        }
      }
    },

    getPath() {
      let path = Object.values(this.$route.params).filter(Boolean);
      if (path.includes('tag')) {
        path = [...path].reverse().slice(2);
        path = path.reverse();
      }
      return path;
    },

    setBreadcrumbs() {
      const path = this.getPath();
      const tree = categoryHelpers.getCategoriesTree(this.getRootCategory(path[0]), path[path.length - 1]);
      const breadcrumbs = [
        { text: 'Главная', link: '/' },
      ];

      if (tree) {
        let fullPath = '/shop';
        tree.forEach((item) => {
          fullPath += `/${item.code}`;
          breadcrumbs.push({
            text: item.name,
            link: fullPath,
          });
        });
      }
      this.breadcrumbs = breadcrumbs;
    },
  },

  metaInfo() {
    let title = 'Китайский чай купить в Москве — Магазин китайского чая';
    let description = 'Купить китайский чай в Москве в интернет-магазине Чайная Мастерская. ✅ Большой выбор сортов чая из Китая. ✅Отличное качество продукции. ✅ Доставка по всей России.';

    if (this.metaKeywords) {
      title = metaHelpers.parseMetaTemplate(this.metaKeywords, {
        title: this.title,
        shortDescription: this.shortDescription,
      });
    }

    if (this.metaDescription) {
      description = metaHelpers.parseMetaTemplate(this.metaDescription, {
        title: this.title,
        shortDescription: this.shortDescription,
      });
    }

    if (this.metaTitle) {
      title = this.metaTitle;
    }

    const link = [];

    if (this.canonicalUrl) {
      link.push(
        { rel: 'canonical', href: `/shop${this.canonicalUrl}` },
      );
    }

    const metaInfo = {
      title,
      meta: [
        {
          name: 'description',
          content: description,
        },
        // {
        //   property: 'url',
        //   content: window.location,
        // },
      ],
    };

    const ogMeta = {
      'og:locale': 'ru_RU',
      'og:type': 'category',
      'og:image': 'https://teaworkshop.ru/img/icons/mstile-150x150.png',
      'og:site_name': 'Чайная мастерская — интернет-магазин Teaworkshop',
      'og:title': title,
      'og:description': description,
      'og:url': window.location.href,
      'og:image:width': '150',
      'og:image:height': '150',
    };

    Object.keys(ogMeta).forEach((key) => {
      metaInfo.meta.push({
        property: key,
        content: ogMeta[key],
      });
    });

    if (link.length) {
      metaInfo.link = link;
    }

    return metaInfo;
  },

  beforeRouteUpdate(to, from, next) {
    this.keepProducts = false;
    if (to.path !== from.path) {
      this.$nextTick(() => setY(0));
    }
    next();
  },

  beforeRouteEnter(to, from, next) {
    const q = to.query && to.query.page ? `__page=${to.query.page}` : '';
    scrollPositionKey = `${from.path}__${to.path}${q}`;

    next((self) => {
      if (window[scrollPositionKey]) {
        // eslint-disable-next-line no-param-reassign
        self.keepProducts = true;
        const unwatch = self.$watch('isPending', (isPending) => {
          if (!isPending) {
            self.$nextTick(() => {
              setY(window[scrollPositionKey]);
              delete window[scrollPositionKey];
              scrollPositionKey = null;
              // eslint-disable-next-line no-param-reassign
            });
            unwatch();
          }
        });
      } else {
        // eslint-disable-next-line no-param-reassign
        self.keepProducts = false;
      }
    });
  },

  beforeRouteLeave(to, from, next) {
    if (to.name === 'ProductCard') {
      const q = from.query && from.query.page ? `__page=${from.query.page}` : '';
      window[`${to.path}__${from.path}${q}`] = getY();
    }
    next();
  },

  created() {
    if (scrollPositionKey && window[scrollPositionKey]) {
      this.keepProducts = true;
    }
    this.metaLink = document.location.href;
    if (this.isMobile) {
      this.getCategories();
    }
    this.setData();
  },

  destroyed() {
    this.unsetCategory();
    this.unsetTagInfo();
  },
};
</script>

<style lang="scss">
  .page-categories {
    &__tags {
      margin: 15px 0 20px;
    }

    &__category-products {
      /* margin-top: 75px; 15px */
    }

    &__recently-watched {
      margin-top: 105px;
    }

    &__categories {
      margin-top: 20px;
      margin-bottom: 60px;
    }

    &__banner {
      margin: 100px 0 0;
    }

    &__description {
      margin-top: 60px;
      margin-bottom: -40px;
    }

    @media (max-width: 992px) {
      &__description {
        margin-top: 30px;
        margin-bottom: -20px;
      }

      &__recently-watched {
        padding: 0;
        max-width: 100%;
        margin-top: 50px;
      }

      &__banner {
        margin: 40px 0 0;
      }

      &__category-products {
        margin-top: 40px;
      }

      &__categories {
        margin-bottom: 40px;
      }
    }
  }
</style>
