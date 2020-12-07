<template>
  <products-container
    header-class="s-container"
    footer-class="s-container"
    :loading="loading"
    class="category-all-products"
  >
    <span v-html="categoryTitle" slot="title" v-if="categoryTitle" />
    <products-sorting :keepProducts="keepProducts" data-cy-component="products-sorting" :data-cy-route="$route.path" slot="control" ref="productsSorting" />
    <template v-if="infoTitle || infoText">
      <div>
        <products-list class="s-container" :products="firstPart" :loading="loading" />
        <div class="category-description">
          <div class="category-description__content s-container">
            <div class="grid">
              <div class="category-description__inner col-desk-8 col-desk-shift-2 col-mob-4 col-mob-shift-0">
                <h2 v-html="infoTitle"></h2>
                <div class="text-body" v-html="infoText"></div>
              </div>
            </div>
          </div>
        </div>

        <products-list class="s-container" :products="secondPart" :loading="loading" />
      </div>
    </template>
    <template v-else>
      <products-list class="s-container" :products="products" :loading="loading" />
    </template>
    <s-button
      @click="nextPage"
      :disabled="loading"
      slot="footer"
      size="lg"
      icon="icon-update"
      class="show-more-products"
      outline
      v-if="hasNextPage"
    >Показать еще</s-button>
  </products-container>
</template>

<script>
import { mapState } from 'vuex';
import ProductsList from '../../../components/Products/ProductsList.vue';
import ProductsSorting from './ProductsSorting.vue';
import ProductsContainer from '../../../components/Products/ProductsContainer.vue';

export default {
  name: 'category-products',

  props: {
    keepProducts: Boolean,
    infoTitle: String,
    infoText: String,
  },

  components: {
    ProductsContainer,
    ProductsList,
    ProductsSorting,
  },

  computed: {
    ...mapState({
      products: ({ products }) => products.products,
      pagination: ({ products }) => products.pagination,
      loading: ({ products }) => products.loading.products,
    }),

    firstPart() {
      return this.getProductsSlice(this.$isMobile ? [0, 4] : [0, 8]);
    },

    secondPart() {
      return this.getProductsSlice(this.$isMobile ? [4] : [8]);
    },

    hasNextPage() {
      return this.pagination.page < this.pagination.pages;
    },
    categoryTitle() {
      const { rootcat = null, subcat1 } = this.$route.params;
      if (subcat1) return null;

      if (rootcat) {
        const headingMap = {
          tea: 'Все чаи',
          stuff: 'Вся посуда',
          herbs: 'Все травы',
          mate: 'Весь мате',
          coffee: 'Весь кофе',
          'other-stuff': 'Всякое разное',
        };
        return headingMap[rootcat];
      }
      return null;
    },
  },

  methods: {
    getProductsSlice(args) {
      const [from = 0, to = -1] = args;
      return [...this.products].slice(from, to);
    },

    nextPage() {
      this.$nextTick(() => {
        this.$refs.productsSorting.nextPage();
      });
    },
  },
};
</script>

<style lang="scss">
  .category-description {
    margin: 50px 0;
    background-color: var(--grey-0);

    &__content {
      padding: 82.5px 0;
      background-image: url('../../../assets/png/mounts.png');
      background-repeat: no-repeat;
      background-position: 50px 100%;
      background-size: 330px 280px;

      h1, h2, h3, h4, h5, h6, p {
        margin: 10px 0;
      }

      a {
        text-decoration: underline;
        color: var(--orange);
      }
    }

    @media (max-width: 992px) {
      &__content {
        padding: 45.5px 0;
      }
      margin: 30px 0;
    }
  }
</style>
