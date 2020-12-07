<template>
  <div class="product-packaging">
    <h3 v-if="variants.length">Фасовка (гр):</h3>
    <variants-list v-model="variant" :variants="variants" class="product-packaging__variants-list" />
    <div :class="{'packaging-variant flex-row justify-between align-center': isMobile}">
      <div class="variant-price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
        <meta itemprop="availability" :content="isInStock ? 'InStock' : 'OutOfStock'">
        <meta itemprop="url" :content="offerUrl">
        <span class="h2"><span itemprop="price">{{ priceValue }}</span><span class="product-price-currency">₽</span></span>
        <span v-show="originalPrice" class="variant-price__original text-muted">{{ originalPrice }}</span>
        <span style="display: none;" itemprop="priceCurrency">RUB</span>
      </div>
      <product-stock-status :in-stock="isInStock" />
    </div>
    <div class="product-packaging__control-block" v-if="isInStock">
      <input-number id="productPage__porductCountInput" v-model="count" />
      <s-button
        size="lg"
        width="50%"
        id="productPage__toCartButton"
        @click="onPutToCart"
        :loading="addToCartDisabled"
        icon="icon-cart-small">
        В корзину
      </s-button>
    </div>
    <div style="margin-top: 15px;" v-else>
      <s-button
              size="lg"
              width="100%"
              id="productPage__toCartButton"
              @click="onRequestReportAdmission"
              :loading="addToCartDisabled"
      >
        <template>Сообщить о поступлении</template>
      </s-button>
    </div>
    <s-button
      v-if="isInStock"
      size="lg"
      width="100%"
      color="gray"
      id="productPage__oneClickOrder"
      class="product-packaging__one-click-order"
      @click="oneClickOrder(product.name)"
    >Заказать в 1 клик</s-button>
    <div class="product-packaging__points h3 text-green text-center" v-if="showPoints">
      {{ points }}
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import VariantsList from './VariantsList.vue';
import ProductStockStatus from './ProductStockStatus.vue';
import ProductMixins from '../../../mixins/Product';
import { declOfNum, formatMoney } from '../../../utils';

export default {
  name: 'packaging',

  mixins: [
    ProductMixins.ProductVariantsMixin,
    ProductMixins.ProductAttributesMixin,
    ProductMixins.ProductPriceMixin,
    ProductMixins.ProductAdmissionMixin,
    ProductMixins.ProductCartMixin,
  ],

  components: {
    VariantsList,
    ProductStockStatus,
  },

  props: {
    product: {
      type: Object,
    },
    variationCode: {
      type: String,
    },

    // Только для yandex commerce, чтобы передать категорию
    breadcrumbs: Array,
  },

  computed: {
    ...mapGetters({
      isMobile: 'dom/isMobile',
    }),

    ...mapState({
      profile: ({ account }) => account.profile,
    }),

    showPoints() {
      const taxons = [this.product.main, ...(this.product.taxons && this.product.taxons.others ? this.product.taxons.others : [])].filter(Boolean);
      const ignore = ['mate', 'kalebasy-i-bombili'].filter((code) => taxons.includes(code)).length > 0;
      if (this.points && this.isInStock && !ignore) {
        return true;
      }
      return false;
    },

    offerUrl() {
      const url = `https://teaworkshop.ru/product/${this.product.code}`;
      if (this.variant) {
        const { axis = [] } = this.product.variants[this.variant];
        if (axis.length) {
          return `${url}?variant=${axis[0]}`;
        }
      }
      return url;
    },

    discount() {
      if (this.profile && this.profile.group) {
        return this.profile.group.code.split('_')[2];
      }
      return 2;
    },

    priceValue() {
      return this.price.amount;
    },

    originalPrice() {
      if (this.price.original && this.price.original.amount) {
        return formatMoney(this.price.original.amount, 'ru-RU', '₽');
      }
      return null;
    },

    points() {
      const points = parseInt(((this.count * +this.price.amount) / 100) * +this.discount, 10);
      return points === 0 ? null : `+${points} ${declOfNum(points, ['балл', 'балла', 'баллов'])}`;
    },
  },

  watch: {
    variantStatus: {
      immediate: true,
      handler(value) {
        this.$emit('stock-status-change', value);
      },
    },
    isInStock: {
      immediate: true,
      handler(value) {
        this.$emit('on-set-stock', value);
      },
    },
    variant: {
      immediate: true,
      handler(value) {
        if (this.variants.length) {
          this.$emit('variant-chosen', value);
        }
      },
    },
    variationCode: {
      immediate: true,
      handler(value) {
        if (value) {
          if (this.variants.length) {
            this.variant = value;
          }
        }
      },
    },
    product: {
      immediate: true,
      handler(product) {
        if (product) {
          const ecItem = {
            name: this.product.name,
            id: this.product.code,
            price: this.priceValue,
          };
          const variant = this.variants.find(({ value }) => value === this.variant);
          if (variant) {
            ecItem.variant = variant.name;
          }
          if (this.breadcrumbs && this.breadcrumbs.length) {
            const breadcrumb = this.breadcrumbs[this.breadcrumbs.length - 2];
            if (breadcrumb && breadcrumb.text) {
              ecItem.category = breadcrumb.text;
            }
          }
          if (window.dataLayer) {
            window.dataLayer.push({
              ecommerce: {
                currencyCode: 'RUB',
                detail: {
                  products: [ecItem],
                },
              },
            });
          }
        }
      },
    },
  },

  methods: {
    ...mapActions({
      requestReportAdmission: 'shop/requestReportAdmission',
    }),

    async onPutToCart() {
      await this.putToCart();
      this.$emit('add-product');
    },

    oneClickOrder(name) {
      this.$modal.show('one-click-order-modal', {
        productsNames: [`${name}(${this.count} шт.)`],
      }, {
        width: 430,
        height: 'auto',
        adaptive: true,
      });
    },
  },
};
</script>

<style lang="scss">
  @import '~@/assets/scss/mixins/_index.scss';

  .product-price-currency {
    font-family: var(--font-family-base) !important;
    font-weight: 400;
    display: inline-block;
    margin-left: 2px;
  }

  .variant-price {
    margin-top: 15px;

    &__original {
      vertical-align: top;
      margin-left: 10px;
      text-decoration: line-through;
    }

    @media (max-width: 992px) {
      margin-top: 0;
      display: flex;

      &__original {
        vertical-align: baseline;
        text-decoration: line-through;
        font-size: 16px;
        line-height: 20px;
      }
    }
  }
  .product-packaging {
    background-color: var(--grey-0);
    box-sizing: border-box;
    border-radius: var(--border-radius);
    padding: 30px 30px 16px;
    flex-shrink: 0;
    width: 100%;
    .points-tooltip {
      width: 14px;
      height: 14px;
      margin-top: -3px;
      display: inline-block;
    }
    &__points,
    &__control-block,
    &__one-click-order {
      margin-top: 15px;
    }
    &__control-block {
      display: flex;
      max-width: 100%;
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
        @media (max-width: 992px) {
          &__amount {
            font-size: 16px;
            line-height: 20px;
          }
        }
      }
      .s-button {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

      @media (max-width: 992px) {
        .s-button {
          .svg-icon {
            margin-right: 5px;
          }
          font-size: 14px;
          &.size-lg {
            height: 40px;
          }
        }
      }
    }
    &__variants-list {
      margin-top: 10px;
    }
    @media (max-width: 992px) {
      &__one-click-order {
        &.s-button.size-lg {
          height: 40px;
        }
      }
      &__points,
      &__control-block {
        margin-top: 20px;
      }
    }
  }

  .packaging-variant {
    @media (max-width: 992px) {
      margin-top: 20px;
    }
  }

  .packaging-points {
    color: var(--green);
    opacity: 0.8;
    width: 100%;
    text-align: center;
    margin-top: 15px;
  }

  .packaging-price {
    color: var(--dark-1);
    font-weight: 500;
    font-family: var(--font-family-alt);
    margin-top: 15px;
    font-size: 32px;
    line-height: 40px;
    height: 40px;

    &.no-variants {
      margin-top: 0;
    }

    h1 {
      margin: 0;
      display: inline-block;
      font-weight: 500;
      font-family: var(--font-family-alt);
    }

    &.disabled {
      color: var(--grey-5);
    }

    &__original-price {
      vertical-align: top;
      font-size: 16px;
      line-height: 40px;
      text-decoration-line: line-through;
      font-weight: 500;
      font-family: var(--font-family-alt);
      color: var(--grey-5);
      margin-left: 12px;
    }
  }

  @media (max-width: 992px) {
    .product-packaging {
      padding: 20px 10px 30px;
    }

    .product-status {
      display: inline-block;
    }

    .packaging-price {
      color: var(--dark-1);
      font-weight: 500;
      font-family: var(--font-family-alt);
      margin-top: 15px;
      font-size: var(--font-md);
      line-height: 25px;
      height: 25px;

      &.no-variants {
        margin-top: 0;
      }

      h1 {
        margin: 0;
        display: inline-block;
        line-height: 25px;
        font-size: var(--font-md);
      }

      &.disabled {
        color: var(--grey-5);
      }

      &__original-price {
        vertical-align: top;
        font-size: 12px;
        line-height: 25px;
        text-decoration-line: line-through;
        font-weight: 500;
        font-family: var(--font-family-alt);
        color: var(--grey-5);
        margin-left: 12px;
      }
    }
  }
</style>
