<template>
  <div class="product-description">
    <content-area :content="description" />
  </div>
</template>
<script>
import ContentArea from '../../../components/Content/ContentArea.vue';

export default {
  name: 'product-description',
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
