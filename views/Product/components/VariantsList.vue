<template>
  <div class="variants-list">
    <template v-for="(item, key) of variants">
      <span :key="key" class="variants-list__item">
        <input :key="`input${key}`" type="radio" :id="getId(key)" :value="item.value" v-model="variant" />
        <label :key="`label${key}`" class="text-muted" :for="getId(key)">
          <span>{{item.name}}</span>&nbsp;-&nbsp;{{ item.price.amount }}&nbsp;₽
        </label>
      </span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'variants-list',

  props: {
    variants: Array,
    value: [Number, String],
  },

  computed: {
    variant: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },

  methods: {
    getId(key) {
      return `product__variant-${key}`;
    },
  },
};
</script>

<style lang="scss">
  .variants-list {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(2, auto);

    &__item {
      display: block;
      width: 100%;
      padding: 0;
      text-align: center;
    }

    input[type="radio"] {
      width: 0;
      height: 0;
      padding: 0;
      opacity: 0;
    }

    input[type="radio"] {
      position: absolute;
      & + label {
        display: inline-block;
        font-size: 14px;
        line-height: 28px;
        width: 100%;
        max-width: 100%;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        justify-content: center;
        padding: 0 5px;
        border: 1px solid var(--grey-4);
        border-radius: 8px;
        color: var(--grey-5);
        text-align: center;
        cursor: pointer;
        i {
          font-size: 14px;
          line-height: 28px;
        }
        &:last-child {
          margin-right: 0;
        }
      }

      &:checked + label {
        border-color: var(--orange);
        span {
          font-weight: 600;
          color: var(--dark-1);
        }
      }
    }

    @media (max-width: 992px) {
      grid-gap: 5px;

      input[type="radio"] {
        & + label {
          font-size: 12px;
          height: 25px;
          line-height: 23px;
          padding: 0 15px;
        }
      }
    }
  }
</style>
