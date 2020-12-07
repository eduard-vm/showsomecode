<template>
  <e-nav>
    <e-nav-item
      v-for="method of sortMethods"
      :key="method.code"
      :data-cy-name="method.name"
      :id="`sortMethod__${method.code}`"
      :disabled="method.disabled"
      @click="setSortMethodCode(method.code)"
    >
      <h4>{{ method.name }}</h4>
    </e-nav-item>
  </e-nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { ENav, ENavItem } from '@/components/elements';

const createPaginationParams = () => ({
  page: 1,
  limit: 40,
});

export default {
  name: 'products-sorting',

  components: { ENav, ENavItem },

  props: {
    defaultSortMethod: {
      type: String,
      defautl: 'popular',
    },
    keepProducts: Boolean,
  },

  data() {
    return {
      params: createPaginationParams(),

      sortMethodCode: 'popular',

      sortMethods: [
        {
          name: 'популярные',
          code: 'popular',
          disabled: false,
          method: 'getPopular',
        },
        {
          name: 'новые',
          code: 'latest',
          method: 'getLatest',
        },
        {
          name: 'цена: сначала дешёвые',
          code: 'cheapest',
          method: 'getCheapest',
        },
        {
          name: 'цена: сначала дорогие',
          code: 'most_expensive',
          disabled: false,
          method: 'getMostExpensive',
        },
      ],

      category: null,
    };
  },

  computed: {
    ...mapState({
      pagination: ({ products }) => products.pagination,
      products: ({ products }) => products.products,
      loading: ({ products }) => products.loading.products,
    }),
  },

  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler(route, prevRoute) {
        if (!prevRoute || (route.path !== prevRoute.path)) {
          if (!this.keepProducts) {
            this.resetProducts();
          }
        }
        this.parseRoute();
      },
    },
  },

  methods: {
    ...mapActions({
      getPopular: 'products/getPopular',
      resetProducts: 'products/resetProducts',
      getLatest: 'products/getProducts',
      getCheapest: 'products/getCheapest',
      getMostExpensive: 'products/getProductsMostExpensive',
    }),

    parseRoute() {
      const route = this.$route;
      const path = Object
        .values(route.params)
        .filter(Boolean)
        .filter((p) => p !== 'tag');
      const [category] = path.reverse();
      const { page = 1 } = route.query;
      this.params.page = Number(page);

      this.category = category;
      if (this.category === category && this.params.page === this.pagination.page) {
        return;
      }
      if (this.params.page > this.pagination.page) {
        if (!this.keepProducts) {
          this.getProducts();
        }
      }
    },

    getSortMethod(code) {
      const sortMethod = this.sortMethods.find((method) => method.code === code);
      if (sortMethod) {
        return sortMethod.method;
      }
      return null;
    },

    setSortMethodCode(code) {
      this.sortMethodCode = code;
      this.params = createPaginationParams();
      this.$nextTick(() => {
        this.getProducts();
      });
    },

    nextPage() {
      if (this.params.page < this.pagination.pages) {
        this.params.page += 1;
        this.getProducts();
      }
    },

    async getProducts() {
      const method = this.getSortMethod(this.sortMethodCode);
      if (method) {
        await this[method]({
          params: this.params,
          code: this.category || null,
        });
      }
    },
  },
};
</script>
