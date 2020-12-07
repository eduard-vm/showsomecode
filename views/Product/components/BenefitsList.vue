<template>
  <div class="benefits">
    <s-accordion :contents.sync="items" />
  </div>
</template>

<script>
import SAccordion from '../../../components/SAccordion.vue';

export default {
  name: 'benefits',

  components: {
    SAccordion,
  },

  data() {
    return {
      items: Object.freeze([
        {
          id: 'delivery',
          active: false,
          title: 'Доставка',
          text: 'Бесплатная доставка при заказе от 3900 рублей. Курьером до двери или до одного из 1700+ пунктов выдачи.',
          icon: 'icon-delivery',
        },
        {
          id: 'payment',
          active: false,
          title: 'Оплата',
          text: 'Оплата наличными при получении и ещё более 11 вариантов оплаты через Яндекс.Кассу.',
          icon: 'icon-payment',
        },
        {
          id: 'quality',
          active: false,
          title: 'Качество',
          text: 'Оригинальный чай от фермеров и уникальная посуда. Лично отбираем весь ассортимент. Семь лет на рынке чая.',
          icon: 'icon-quality',
        },
        {
          id: 'instruction',
          active: false,
          title: 'Как заказать',
          text: 'Вы можете изучить пошаговую инструкцию по оформлению заказа на <a href="/kak-zakazat/" class="link" rel=""> отдельной странице</a>.',
          icon: 'icon-cart-question',
        },
      ]),

      activeIndex: null,
    };
  },

  methods: {
    isActive(idx) {
      return this.activeIndex === idx;
    },

    setIndex(idx) {
      this.activeIndex = this.activeIndex === idx ? null : idx;
    },
  },
};
</script>
