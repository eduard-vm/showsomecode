<template>
  <definitions-list title="Характеристики" :list="features" />
</template>

<script>
import DefinitionsList from '../../../components/DefinitionsList.vue';

export default {
  name: 'features-list',

  props: {
    features: Array,
  },

  components: {
    DefinitionsList,
  },
};
</script>
