<template>
  <div class="variant-price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
    <meta v-if="inStock" itemprop="availability" href="http://schema.org/InStock" />
    <meta v-else itemprop="availability" href="http://schema.org/OutOfStock" />
    <span class="h2"><span itemprop="price">{{ priceValue }}</span> ₽</span>
    <span v-show="priceOriginal" class="variant-price__original text-muted">{{ priceOriginal }}</span>
    <span style="display: none;" itemprop="priceCurrency">RUB</span>
  </div>
</template>

<script>
export default {
  name: 'VariantPrice',

  props: {
    variation: String,
    priceOriginal: String,
    priceCurrent: String,
    inStock: Boolean,
  },

  computed: {
    priceValue() {
      if (this.priceCurrent) {
        return parseInt(this.priceCurrent, 10);
      }
      return 0;
    },
  },
};
</script>

<style lang="scss">
  .variant-price {
    margin-top: 15px;
    &__original {
      vertical-align: top;
      margin-left: 10px;
      text-decoration: line-through;
    }

    @media (max-width: 992px) {
      margin-top: 0;

      &__original {
        vertical-align: baseline;
        text-decoration: line-through;
        font-size: 16px;
        line-height: 20px;
      }
    }
  }
</style>
