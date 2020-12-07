<template>
  <div class="product-status"
       :class="{
        'product-status--in-stock': inStock,
        'product-status--out-of-stock': !inStock,
       }">{{ inStock ? stockStatusMap[status].text : 'Временно нет в наличии' }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { stockStatusMap } from '../static';
import ProductVariantsMixin from '../../../mixins/Product/ProductVariantsMixin.js';

export default {
  name: 'product-status',

  mixins: [
    ProductVariantsMixin,
  ],

  props: {
    inStock: Boolean,
    status: {
      type: String,
      default: 'in_stock',
    },
  },

  data() {
    return {
      stockStatusMap,
    };
  },

  computed: {
    ...mapGetters({
      isMobile: 'dom/isMobile',
    }),
  },

  methods: {
    getClass() {
      return stockStatusMap[this.status];
    },
  },
};
</script>

<style lang="scss">
  .product-status {
    width: 100%;
    font-size: 16px;
    color: var(--grey-5);
    margin-top: 10px;
    position: relative;

    &--in-stock {
      &:before {
        background-image: url('/svg/icon-check.svg');
        content: '';
        width: 14px;
        height: 14px;
        background-repeat: no-repeat;
        background-size: 14px 14px;
        background-position: center;
        display: inline-block;
        top: 2px;
        position: relative;
        margin-right: 5px;
      }
    }

    &--out-of-stock {
      font-size: 28px;
      line-height: 40px;
      margin-top: 10px;
      font-weight: 500;
      font-family: var(--font-family-alternate);
    }
    @media (max-width: 992px) {
      margin-top: 0;
      width: auto;
      font-size: 12px;
      line-height: 15px;
      &--in-stock {
        &:before {
          width: 15px;
          height: 15px;
        }
      }
    }
  }

</style>
