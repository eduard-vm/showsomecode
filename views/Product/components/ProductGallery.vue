<template>
  <div class="product-gallery">
    <div class="product-gallery__image-wrapper">
      <div class="product-gallery__image"
      :class="{
        'out-of-stock': !inStock
      }">
        <transition name="product-image">
          <img itemprop="image" :src="image" alt="" v-if="image" ref="productImage" @click="showLightbox = !showLightbox">
        </transition>
      </div>
    </div>
    <div class="gallery-thumbs">
      <div class="gallery-thumbs__control" v-show="showControl">
        <s-button type="icon" icon-size="18" icon="icon-arrow-left-slider" @click="prev" id="productGallery__prev"/>
        <s-button type="icon" icon-size="18" icon="icon-arrow-right-slider" @click="next" id="productGallery__next"/>
      </div>
      <div class="gallery-thumbs__container hide-scrollbar"
        :class="{
          'out-of-stock': !inStock
        }"
        ref="thumbsContainer"
      >
        <ul class="gallery-thumbs__list" ref="thumbsList">
          <li v-for="(item, index) of thumbs" :key="index" class="gallery-thumbs__item" :class="{active: slideIndex === index}" @click="slideIndex = index">
            <img :src="item" :title="title" :alt="title" >
          </li>
        </ul>
      </div>
    </div>
    <vue-easy-lightbox
      :visible="showLightbox"
      :imgs="thumbs"
      :moveDisabled="true"
      @hide="showLightbox = false"
    ></vue-easy-lightbox>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VueEasyLightbox from 'vue-easy-lightbox';
import anime from 'animejs';

export default {
  name: 'product-gallery',

  props: {
    inStock: Boolean,
    images: Array,
    title: String,
  },

  components: {
    VueEasyLightbox,
  },

  data() {
    return {
      slideIndex: 0,
      image: null,
      showLightbox: false,
    };
  },

  computed: {
    ...mapGetters({
      isMobile: 'dom/isMobile',
    }),

    thumbs() {
      return this.images.map((image) => image.cachedPath).filter(Boolean);
    },

    showControl() {
      return (!this.isMobile && this.thumbs.length > 5);
    },
  },

  watch: {
    slideIndex: {
      immediate: true,
      handler: 'setImage',
    },
  },

  methods: {
    imageClickHandler() {
      if (!this.isMobile) {
        this.$modal.show('lightbox-modal', {
          images: this.thumbs,
        });
      }
    },

    setImage(i) {
      this.image = null;
      this.$nextTick(() => {
        if (this.thumbs[i]) {
          this.image = this.thumbs[i];
        }
      });
    },

    prev() {
      if ((this.slideIndex - 1) >= 0) {
        this.slideIndex -= 1;
      } else {
        this.slideIndex = this.thumbs.length - 1;
      }
      this.scrollTo();
    },

    next() {
      if ((this.slideIndex + 1) < this.thumbs.length) {
        this.slideIndex += 1;
      } else {
        this.slideIndex = 0;
      }
      this.scrollTo();
    },

    scrollTo() {
      this.$nextTick(() => {
        anime({
          targets: this.$refs.thumbsContainer,
          scrollLeft: 70 * this.slideIndex,
          duration: 400,
          easing: 'easeInOutCubic',
        });
      });
    },
  },

  mounted() {
    this.slideIndex = 0;
  },
};
</script>

<style lang="scss">
  @import '~@/assets/scss/mixins/_index.scss';

  .product-gallery {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    box-sizing: border-box;

    &__image-wrapper {
      display: flex;
      width: 100%;
      height: 330px;
      justify-content: center;
    }

    &__image {
      width: 100%;
      height: 100%;
      display: flex;
      overflow: hidden;
      transform: translate3d(0, 0, 0);
      border-radius: var(--border-radius);
      align-items: center;
      img {
        width: 100%;
        object-fit: cover;
      }
      &.out-of-stock {
        img {
          filter: grayscale(100%);
        }
      }
    }

    @media (max-width: 992px) {
      padding: 0;

      &__image-wrapper {
        padding: 0 10px;
        height: auto;
        &:before {
          padding-top: 100%;
          content: '';
          height: 0;
          width: 0;
        }
      }
    }
    /** iPhone 5 */
    @media (max-width: 320px) {
      flex-direction: column;
      &__image-wrapper {
        width: 320px;
      }
    }
  }

  .gallery-thumbs {
    margin-top: 20px;
    min-height: 50px;
    position: relative;

    &__container {
      overflow-x: auto;
      display: flex;
      border-radius: 8px;
      &.out-of-stock {
        img {
          filter: grayscale(100%);
        }
      }
    }

    &__list {
      display: flex;
      flex-wrap: nowrap;
      position: relative;
      user-select: none;
    }

    &__control {
      position: absolute;
      width: 100%;
      z-index: 3;
      button {
        position: absolute;
        top: 14px;
        width: 18px;
        height: 18px;
        cursor: pointer;

        &:nth-child(1) {
          left: -24px;
        }
        &:nth-child(2) {
          right: -24px;
        }

        &:active {
          opacity: .7;
        }
      }
    }

    &__item {
      width: 50px;
      height: 50px;
      box-sizing: border-box;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      position: relative;
      transform: translate3d(0, 0, 0);
      margin-right: 20px;
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      &:after {
        content: '';
        border: 2px solid transparent;
        @include absolute;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        opacity: 0;
        transition: opacity 240ms ease-out;
      }

      img {
        appearance: none;
        width: 100%;
        height: 100%;
        object-fit: cover;
        will-change: transform;
        transition: transform 240ms;
      }

      &.active {
        &:after {
          opacity: 1;
          border-color: var(--orange);
        }
      }
    }

    @media (max-width: 992px) {
      &__item {
        /* width: 70px;
        height: 70px; */
        margin-right: 0;
        margin-left: 15px;
        &:first-child {
          margin-left: 10px;
        }

        transition: transform 120ms;
        &:active {
          transform: scale(.8);
        }
      }

      &__list {
        padding-right: 10px;
      }
    }
        /** iPhone 5 */
    @media (max-width: 320px) {
      &__container {
        width: 320px;
      }
    }
  }

  .product-image-enter-active, .product-image-leave-active {
    transition: opacity 300ms, transform 300ms;
  }

  .product-image-enter, .product-image-leave-to {
    opacity: 0;
    transform: scale(1.1);
  }
</style>
