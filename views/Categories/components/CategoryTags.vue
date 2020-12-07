<template>
  <div class="tags hide-scrollbar" v-if="tags && tags.length" ref="tagsContainer">
    <ul class="tags__list hide-scrollbar" v-if="!loading" :class="{open: showAll}" ref="tagsList" :style="listStyle">
      <li v-for="tag of sortTags" ref="tag" :key="tag.code">
        <router-link
          :class="{'is-active': isActive(tag.code)}"
          :to="getTagPath(tag.code)"
        >{{ tag.name }}</router-link>
      </li>
      <li v-if="showControl" class="tags__control-item">
        <s-button
          id="showLessTags"
          outline
          role="button"
          width="180px"
          class="tags__control-item"
          @click="showAll = !showAll"
        >
          {{ `Показать ${showAll ? 'меньше' : 'больше'}` }}
        </s-button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'category-tags',

  props: {
    loading: Boolean,
    tags: Array,
  },

  data() {
    return {
      showAll: false,
      active: null,
      maxTagsShow: 0,
      tagsList: [],
      showControl: false,
      listStyle: {
        width: '100%',
      },
    };
  },

  computed: {
    ...mapGetters({
      isMobile: 'dom/isMobile',
    }),

    ...mapState({
      currentTag: ({ categories }) => categories.tag,
    }),

    isCompact() {
      return !this.showAll && (this.tags && this.tags.length > this.maxTagsShow);
    },

    sortTags() {
      /** Активный тег в начало */
      return [...(this.tags || [])].sort(({ code }) => ((code === this.active) ? -1 : 1));
    },
  },

  watch: {
    $route: 'setActiveTag',
    showAll: 'calculateList',
    active: 'calculateList',
    sortTags: 'calculateList',
  },

  methods: {
    getPath() {
      return Object.values(this.$route.params).filter(Boolean);
    },

    getPathLessTag() {
      let path = this.getPath();
      if (path.includes('tag')) {
        path = path.reverse().slice(2);
        return path.reverse();
      }
      return path;
    },

    getTagPath(code) {
      const path = this.getPath();
      /** Если применён тег */
      if (path.includes('tag')) {
        /**
         * Если примененный тег совпадает с кодом тега для
         * удаляю тег из пути
         * */
        if (path[path.length - 1] === code) {
          return ['/shop', ...this.getPathLessTag()].join('/');
        }
        /**
         * Удаляю тег из пути и подставляю код текущего
         * */
        return ['/shop', ...this.getPathLessTag(), 'tag', code].join('/');
      }
      /**
       * Добавляю к текущему пути параметры тега
       * */
      return ['/shop', ...path, 'tag', code].join('/');
    },

    isActive(code) {
      return (this.currentTag && this.currentTag.code === code) || this.active === code;
    },

    setActiveTag() {
      this.active = null;

      const path = this.getPath();
      if (path[path.length - 2] === 'tag') {
        this.active = path[path.length - 1];
      }
    },

    calculateList() {
      if (window.innerWidth > 992) {
        this.$nextTick(() => {
          const nodes = this.$refs.tag;
          if (nodes && nodes.length) {
            const fullWidth = nodes.reduce((result, node) => {
              const nodeWidth = node.getBoundingClientRect().width + 10;
              // eslint-disable-next-line no-param-reassign
              result += nodeWidth;
              if (result > (1170 - 250)) {
                node.classList[this.showAll ? 'remove' : 'add']('hidden');
              }
              return result;
            }, 0);
            this.showControl = fullWidth > 1170;
          }
        });
      }
    },
  },

  mounted() {
    this.setActiveTag();
    this.calculateList();
  },
};
</script>

<style lang="scss">
  .tags {
    min-height: 50px;
    display: flex;

    &__list {
      position: relative;
      display: block;
      padding: 0;
      margin: 0;
      list-style: none;
      width: auto;
      &.open {
        height: auto;
      }
    }

    li {
      margin: 0 10px 10px 0;
      flex-shrink: 0;
      display: inline-block;

      &:last-child {
        margin-right: 0;
      }

      &.hidden {
        visibility: hidden;
        position: absolute;
      }
    }

    a {
      font-size: 16px;
      line-height: 20px;
      text-decoration: none;
      color: #000000;
      background-color: var(--grey-light-color);
      padding: 10px 20px;
      border-radius: 25px;
      transition: opacity 150ms ease-in-out;
      display: inline-block;
      text-align: center;
      transition: background-color 160ms ease-out;
      line-height: 20px;
      text-decoration: none;

      &.is-active {
        background-color: var(--yellow-light-color);
        padding-right: 37px;
        background-image: url('/svg/icon-tag-remove.svg');
        background-repeat: no-repeat;
        background-position: calc(100% - 15px) 50%;
      }

      &.compact {
        display: inline-flex;
      }

      &:hover {
        cursor: pointer;
        color: black;
        text-decoration: none;
        &:not(.is-active) {
          background-color: #e8e6e1;
        }
      }
    }

    &__control-item {
      flex-shrink: 0;
    }
  }

  @media (max-width: 992px) {
    .tags {
      height: auto;
      overflow: auto;
      min-height: auto;
      a {
        font-size: 12px;
        line-height: 30px;
        padding: 0 15px;
        height: 30px;
      }

      li {
        margin: 0 5px 0 0;
        display: inline-flex;
        &:first-child {
          margin-left: 10px;
        }
        &:last-child {
          padding-right: 10px;
        }
      }

      &__list {
        padding-bottom: 0;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-right: 100px;
      }

      &__control-item {
        display: none;
      }
    }
  }
</style>
