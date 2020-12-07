<template>
  <transition name="fade" v-if="product">
    <s-page class="product-page" itemscope itemtype="http://schema.org/Product" :breadcrumb="breadcrumbs">
      <meta itemprop="description" :content="product.shortDescription || ''" />
      <meta itemprop="url" :content="`https://teaworkshop.ru/product/${product.code}`" />
      <div class="s-container s-container--m-flat" v-if="product">
        <div class="product-page__inner">
          <h1 itemprop="name" ref="productName" class="product__header" v-html="seoTitle ? seoTitle : product.name" v-if="product" slot="title" />
          <div class="product-misc">
            <div class="product-misc__inner">
              <favorite-toggle :size="favoriteSize" :disabled="favoriteIsLoading" :value="isFavorite" @change="setFavorite" />
              <product-attributes :inline="!isMobile" :size="attributesSize" :attributes="attributes" @click="onClickAttribute" />
            </div>
          </div>
          <div class="product__gallery">
            <product-gallery :in-stock="inStock" ref="productGallery" :title="product.name" :images="product.images" />
          </div>
          <div class="product__packaging">
            <product-packaging
              ref="productPackaging"
              @variant-chosen="variantChosen"
              @on-set-stock="onSetStock"
              @add-product="onAddProduct"
              :variationCode="variationCode"
              :product="product"
              :breadcrumbs="breadcrumbs"
            />
          </div>
          <div class="product__sidebar">
            <benefits-list class="product__benefits" />
            <div v-if="features.length" class="product__features">
              <features-list :features="features" />
            </div>
            <hr color="#dadada" size="1" :style="isMobile ? 'margin: 0 10px 5px' : ' margin: 0 0 5px 0'" v-if="recipe.length && features.length"/>
            <div v-if="recipe.length" class="product__recipe">
              <product-recipe :recipe="recipe" />
            </div>
          </div>
          <div class="product__recommended">
            <!-- <button @click="showRecommended = !showRecommended">showRecommended</button> -->
            <recommended-products
              id="recommendedProductsBlock"
              :code="product.taxons.main"
              :product="product" ref="recommended" @show="showRecommended = true" @hide="showRecommended = false" />
          </div>
          <article class="product__content" v-if="product.description">
            <content-area :content="product.description" />
          </article>
          <div class="product__reviews">
            <customer-reviews
              title="Пробовали? Расскажите о впечатлениях!"
              description="Так вы поможете другим выбрать чай, а сами получите бонус ;)"
              :loading="reviewAddLoading"
              :reviews="reviews"
              @submit="submitReview"
              ref="customerReviews"
              v-if="product"
            />
            <!-- <product-reviews :product="product" :reviews="reviews" v-if="product" /> -->
          </div>
        </div>
        <recently-watched class="product-page__recently-watched" />
        <div class="s-container s-container--flat product-page__tea-block">
          <new-products title="И снова чай" />
        </div>
      </div>
    </s-page>
  </transition>
  <div v-else-if="loading && !product" class="s-container flex-row justify-center align-center page-loader">
    <app-spiner />
  </div>
  <ErrorPage :code="errStatusCode" v-else-if="!loading && !product"></ErrorPage>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import ProductMixins from '../../mixins/Product';
import { categoryHelpers, metaHelpers } from '../../helpers';
import NewProducts from '../../components/Products/NewProducts.vue';
import RecommendedProducts from '../../components/Products/RecommendedProducts.vue';
import CustomerReviews from '../../components/CustomerReviews/Index.vue';
import BenefitsList from './components/BenefitsList.vue';
import ProductPackaging from './components/ProductPackaging.vue';
import ProductGallery from './components/ProductGallery.vue';
import FeaturesList from './components/FeaturesList.vue';
import ProductRecipe from './components/ProductRecipe.vue';
import FavoriteToggle from '../../components/Products/FavoriteToggle.vue';
import ProductAttributes from '../../components/Products/ProductAttributes.vue';
import ContentArea from '../../components/Content/ContentArea.vue';
import ErrorPage from '../ErrorPage.vue';
import RecentlyWatched from '../../components/Products/RecentlyWatched.vue';
import Noty from '../../plugins/noty';
// import clamp from '../../plugins/clamp.min.js';
import animatedScrollTo from '../animatedScrollTo';

const SCROLL_AREA_ITEM = '.v-scroll-area__item';
const SCROLL_AREA_ITEM_TAIL = 'v-scroll-area__item--tail';
const PRODUCT_IMAGE = '.product-image';
const H_SCROLL_AREA_ITEM = '.h-scroll-area__item';

const Selectors = {
  SCROLL_AREA_ITEM,
  SCROLL_AREA_ITEM_TAIL,
  PRODUCT_IMAGE,
  H_SCROLL_AREA_ITEM,
};

export default {
  name: 'product',

  mixins: [
    ProductMixins.ProductAttributesMixin,
    ProductMixins.ProductFavoriteMixin,
  ],

  components: {
    NewProducts,
    RecommendedProducts,
    CustomerReviews,
    BenefitsList,
    ProductPackaging,
    ProductGallery,
    FeaturesList,
    RecentlyWatched,
    ProductRecipe,
    ContentArea,
    FavoriteToggle,
    ProductAttributes,
    ErrorPage,
  },

  data() {
    return {
      showRecommended: false,
      recommended: [],
      product: null,
      metaDescription: null,
      metaLink: null,
      inStock: true,
      currentVariant: null,
      variationCode: null,
      errStatusCode: null,
    };
  },

  computed: {
    ...mapGetters({
      isMobile: 'dom/isMobile',
      isAuth: 'account/isAuth',
    }),

    ...mapState({
      reviewAddLoading: ({ products }) => products.loading.review,
      userProfile: ({ account }) => account.profile,
      currentProduct: ({ products }) => products.product,
      loading: ({ products }) => products.loading.product,
      reviewsIsPending: ({ products }) => products.loading.reviews,
      reviews: ({ products }) => products.reviews,
      rootCategories: ({ categories }) => categories.root,
      cart: ({ cart }) => cart.cart,
    }),

    productHasReady() {
      return false;
    },

    hasVariant() {
      if (this.currentProduct && this.currentProduct.variants && typeof this.currentProduct.variants === 'object') {
        const variants = Object.values(this.currentProduct.variants);
        return variants.length > 0;
      }
      return true;
    },

    attributesSize() {
      return this.isMobile ? 'lg' : 'md';
    },

    favoriteSize() {
      return this.isMobile ? 'xl' : 'md';
    },

    breadcrumbs() {
      const breadcrumbs = [
        {
          text: 'Главная',
          link: '/',
        },
      ];

      if (this.product && this.product.taxons) {
        const mainCode = this.product.taxons.main;
        let path = null;

        Object.values(this.rootCategories).forEach((category) => {
          if (!path) {
            path = categoryHelpers.getCategoriesTree(category, mainCode);
          }
        });

        if (path) {
          let navTo = '/shop';
          path.forEach((item) => {
            navTo = `${navTo}/${item.code}`;
            breadcrumbs.push({
              text: item.name.trim(),
              link: navTo,
            });
          });
          breadcrumbs.push({
            text: this.product.name.trim(),
            link: `/product/${this.product.code}`,
          });
        }
      }

      return breadcrumbs;
    },

    isPending() {
      return ![this.loading, this.reviewsIsPending].every((i) => !i);
    },

    seoTitle() {
      if (this.currentVariant && this.variationCode) {
        return `${metaHelpers.replaceEntities(this.currentVariant.name)}`;
      }
      return null;
    },
  },

  watch: {
    isPending(isPending) {
      this.$nextTick(() => {
        const app = document.body.querySelector('#app');
        if (!isPending) {
          this.$meta().resume();
        }
        const renderState = isPending ? 'wait' : 'ready';
        app.setAttribute('render', renderState);
      });
    },

    $route: {
      immediate: true,
      deep: true,
      async handler(route) {
        const { code = null } = route.params;
        const { variation = null } = route.query;

        if (this.product) {
          if (this.product.code !== code) {
            this.product = null;
            this.unsetProduct();
          } else {
            return;
          }
        }

        if (code) {
          try {
            await this.getProduct(code);
            await this.getProductReviews(code);

            if (variation) {
              const variantsKeys = Object.keys(this.product.variants);
              const variantsArr = variantsKeys.map((variant) => this.product.variants[variant]);
              const variant = variantsArr.find((item) => item.axis[0] === variation);
              if (variant) {
                this.variationCode = variant.code;
              }
            }
          } catch (err) {
            if (err.status) {
              this.errStatusCode = parseInt(err.status, 10);
            }
            this.variationCode = null;
          }
        }
      },
    },

    currentProduct(data) {
      if (data) {
        this.product = JSON.parse(JSON.stringify(data));
        this.addToRecently(this.product);
      }
    },
  },

  methods: {
    ...mapActions({
      getCategories: 'categories/getAllCategories',

      addReview: 'products/addProductReviewByCode',
      getProduct: 'products/getProduct',
      unsetProduct: 'products/unsetProduct',
      addToRecently: 'products/addToRecently',
      getProductReviews: 'products/getProductReviews',
    }),

    onAddProduct() {
      this.$refs.recommended.expand();
    },

    onSetStock(value) {
      this.inStock = value;
    },

    variantChosen(e) {
      if (this.variationCode && e !== this.variationCode) {
        this.$router.push({
          path: this.$route.path,
        });
        this.variationCode = null;
      }
      if (this.hasVariant) {
        this.currentVariant = this.currentProduct.variants[e];
      }
    },

    async submitReview(html) {
      const notyOptions = {
        layout: 'bottomCenter',
        text: 'Ваш комментарий отправлен. Как только он пройдет премодерацию, то сразу появится на сайте и вы получите 20 баллов.',
        timeout: 10000,
        closeWith: ['click', 'button'],
        theme: 'tea',
      };

      if (this.isAuth) {
        try {
          await this.addReview({
            data: {
              rating: 5,
              title: 'Заголовок',
              comment: html,
              email: this.userProfile.email,
            },
            code: this.product.code,
          });
          this.$refs.customerReviews.resetForm();
        } catch (err) {
          notyOptions.text = 'Ошибка при создании комментария.';
          notyOptions.type = 'error';
        } finally {
          new Noty(notyOptions).show();
        }
      } else {
        this.$modal.show('auth-modal');
      }
    },
  },

  metaInfo() {
    let title = '«Чайная мастерская» – интернет-магазин TeaWorkshop в Москве';
    let description = 'Интернет-магазин китайского чая «Чайная мастерская» предлагает большой выбор сортов чая, превосходное его качество и бесплатную доставку по Москве!';

    if (this.product) {
      if (this.product.metaKeywords) {
        title = metaHelpers.parseMetaTemplate(this.product.metaKeywords, {
          title: this.product.name,
          shortDescription: this.product.shortDescription,
        });

        if (this.currentVariant && this.variationCode) {
          title = `Купить ${metaHelpers.replaceEntities(this.currentVariant.name)}`;
        }
      }

      if (this.product.metaDescription) {
        description = metaHelpers.parseMetaTemplate(this.product.metaDescription, {
          title: this.product.name,
          shortDescription: this.product.shortDescription,
        });
      }
    }

    this.metaDescription = description;

    const metaInfo = {
      title,
      meta: [
        {
          name: 'description',
          content: description,
        },
      ],
    };

    let imageUrl = 'https://teaworkshop.ru/img/icons/mstile-150x150.png';

    if (this.product && Array.isArray(this.product.images)) {
      if (this.product.images.length) {
        imageUrl = this.product.images[0].cachedPath;
      }
    }

    const ogMeta = {
      'og:locale': 'ru_RU',
      'og:type': 'product',
      'og:site_name': 'Чайная мастерская — интернет-магазин Teaworkshop',
      'og:title': title,
      'og:description': description,
      'og:url': window.location.href,
      'og:image': imageUrl,
      'og:image:secure_url': imageUrl,
      'og:image:width': '600',
      'og:image:height': '600',
    };

    const [imgName] = imageUrl.split('/').reverse();
    const [imgExt] = imgName.split('.').reverse();
    if (imgExt) {
      ogMeta['og:image:type'] = `image/${imgExt}`;
    }
    Object.keys(ogMeta).forEach((key) => {
      if (ogMeta[key]) {
        metaInfo.meta.push({
          property: key,
          content: ogMeta[key],
        });
      }
    });

    return metaInfo;
  },

  created() {
    this.metaLink = document.location.href;
    if (this.isMobile) {
      this.getCategories();
    }
  },

  mounted() {
    if (window.Cypress) {
      window.Product = this;
      window.Selectors = Selectors;
    }
  },

  destroyed() {
    this.unsetProduct();
    this.product = null;
  },
};
</script>
<style lang="scss">
  @import '~@/assets/scss/mixins/_index.scss';

  .product-page {
    hr.devider {
      margin: 0 10px;
      color: #dadada;
    }

    &__recently-watched {
      padding: 0;
    }

    &__recently-watched,
    &__tea-block {
      margin-top: 60px;
    }

    &__inner {
      position: relative;
      display: grid;
      grid-gap: 0px 30px;
      justify-content: center;
      align-items: flex-start;
      grid-template-columns: 370px 370px 1fr;
      grid-template-areas:
        "header header header"
        "misc misc misc"
        "gallery packaging sidebar"
        "recommended recommended sidebar"
        "content content sidebar"
        "reviews reviews sidebar";

      .attributes {
        position: relative;
        top: -20px;
        @media (max-width: 992px) {
          top: -5px;
          right: 3px;
        }
      }

      .favorite-toggle {
        position: relative;
        top: -20px;
        @media (max-width: 992px) {
          left: 20px;
          top: 10px;
        }
      }
    }

    @media (max-width: 992px) {
      &__recently-watched,
      &__tea-block.s-container.s-container--flat {
        margin-top: 40px;
        padding: 0 10px;
      }
      &__inner {
        margin: 0 0 15px;
        grid-template-columns: 100%;
        grid-gap: 0;
        // grid-auto-rows: min-content;
        align-items: center;
        grid-auto-flow: column;
        grid-template-areas:
          "header" "misc" "gallery" "packaging" "recommended" "sidebar" "content" "reviews";
      }
    }
  }

  .product {
    &__header {
      grid-area: header;
      margin-bottom: 25px;
      width: 100%;
    }

    &__gallery {
      grid-area: gallery;
    }

    &__packaging {
      grid-area: packaging;
    }

    &__sidebar {
      grid-area: sidebar;
      width: 270px;
      justify-self: end;
    }
    &__content {
      grid-area: content;
      /* max-width: 740px; */
      padding: 0;
      margin-top: 50px;
      .content-area {
        .content-row {
          width: 100%;
          margin: 0;
        }
      }
    }
    &__reviews {
      grid-area: reviews;
      margin-top: 20px;
    }
    &__features {
      margin-top: 25px;
    }
    &__recommended {
      /* width: 740px; */
      /* max-width: 770px; */
      /* padding: 50px 0; */
      margin-top: 50px;
      margin-bottom: 15px;
      /* background-color: red; */
      grid-area: recommended;
    }
    @media (max-width: 992px) {
      &__reviews,
      &__header {
        padding: 0 10px;
      }

      &__header {
        margin-bottom: 15px;
        padding: 0 10px;
      }
      &__misc {
        justify-self: start;
        width: 100%;
      }

      &__sidebar {
        justify-self: start;
        width: 100%;
        margin-top: 25px;
      }

      &__packaging,
      &__recipe,
      &__content,
      &__features{
        padding: 0 10px;
      }
      &__content {
        margin-top: 5px;
      }

      &__packaging {
        margin-top: 10px;
      }

      &__features {
        margin-top: 15px;
      }

      &__recommended {
        margin-top: 30px;
      }
    }
  }

  .product-misc {
    background: var(--green);
    z-index: 2;
    height: 0;
    width: 100%;
    max-width: 370px;
    display: flex;
    justify-content: flex-end;
    @include absolute(-25, 0);
    grid-area: misc;

    &__inner {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: row-reverse;
    }

    @media (max-width: 992px) {
      max-width: 100%;
      &__inner {
        flex-direction: row;
        max-width: 100%;
        width: 100%;
      }
    }
  }
</style>
