<template>
  <div class="s-container">
    <div class="category-description">
      <content-area :content="description" class="category-description__body" />
    </div>
  </div>
</template>
<script>
import ContentArea from '../../../components/Content/ContentArea.vue';

export default {
  name: 'related-posts',
  components: {
    ContentArea,
  },
  props: {
    description: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
  .related-links {
    padding: 0;
    margin: 0;
    margin-top: 15px;
    // padding-left: 1rem;
    list-style-image: url('/svg/bullet.svg');
    li {
      margin-bottom: 1rem;
      font-size: 20px;
      line-height: 30px;
    }

    a {
      text-decoration: underline;
    }
  }

  .category-description {
    box-sizing: border-box;
    border: 3px solid var(--grey-3);
    border-radius: 25px;
    padding: 50px 0;
    &__body {
      max-width: 770px;
      margin: 0 auto;
    }

    @media (max-width: 992px) {
      padding: 30px 0;
      border: none;
      &__body {
        max-width: auto;
      }
    }
  }

</style>
