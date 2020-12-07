<template>
  <div class="product-status">
    <!-- <span>{{ stockStatusMap[status] ? stockStatusMap[status].text : ' - ' }}</span> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { stockStatusMap } from '../static';

export default {
  name: 'product-status',

  props: {
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
  @import '~@/assets/scss/mixins/_index.scss';

  .product-status {
    width: 100%;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 20px;
    color: var(--grey-5);
    margin-top: 10px;

    &.in_stock {
      &:before {
        vertical-align: middle;
        background-image: url('/svg/icon-check.svg');
        content: '';
        width: 14px;
        height: 14px;
        background-repeat: no-repeat;
        background-size: 100%;
        display: inline-block;
        margin-right: 5px;
        flex-shrink: 0;
      }
    }

    &.out_of_stock {
      font-size: 32px;
      line-height: 40px;
      margin-top: 10px;
      font-weight: 500;
      font-family: var(--font-family-alt);
    }
  }

  @media (max-width: 992px) {
    .product-status {
      width: auto;
      font-size: 12px;
      line-height: 15px;
      &.out_of_stock {
        font-size: 12px;
        line-height: 15px;
        &:before {
          // background-image: url('/svg/icon-close-red.svg');
          vertical-align: middle;
          content: '';
          width: 14px;
          height: 14px;
          display: inline-block;
          margin-right: 5px;
          flex-shrink: 0;
        }
      }
    }
  }
</style>
