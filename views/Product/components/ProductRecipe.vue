<template>
  <definitions-list title="Как заваривать" :list="recipe" />
</template>

<script>
import DefinitionsList from '../../../components/DefinitionsList.vue';

export default {
  name: 'product-recipe',

  props: {
    recipe: Array,
  },

  components: {
    DefinitionsList,
  },
};
</script>
