<template>
  <div class="packaging-control">
    <input-number id="productPage__porductCountInput" v-model="count" />
    <s-button
      size="lg"
      width="50%"
      id="productPage__toCartButton"
      @click="$emit('click')"
      :loading="loading"
      icon="icon-cart-small">В корзину</s-button>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    loading: Boolean,
    count: Number,
  },
};
</script>
<style lang="scss">
  .packaging-control {
    display: flex;
    max-width: 100%;
    margin-top: 14px;
    .input-number {
      background-color: var(--primary);
      width: 50%;
      border-top-left-radius: 30px;
      border-bottom-left-radius: 30px;
      border-right: 1px solid var(--orange);
      &__amount {
        font-family: var(--font-family-alternate);
        font-weight: 500;
        line-height: 25px;
      }
    }
    .s-button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
</style>
