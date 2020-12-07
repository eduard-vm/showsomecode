/* eslint-disable no-param-reassign */
export default {
  name: 'TransitionExpand',

  functional: true,

  render(createElement, context) {
    const data = {
      props: {
        name: 'expand',
      },
      on: {
        afterEnter(element) {
          element.style.height = 'auto';
        },

        enter(element) {
          const { width } = getComputedStyle(element);
          element.style.width = width;
          element.style.position = 'absolute';
          element.style.visibility = 'hidden';
          element.style.height = 'auto';

          const { height } = getComputedStyle(element);

          element.style.width = null;
          element.style.position = null;
          element.style.visibility = null;
          element.style.height = 0;

          // Force repaint to make sure the
          // animation is triggered correctly.
          // eslint-disable-next-line no-unused-expressions
          getComputedStyle(element).height;

          requestAnimationFrame(() => {
            element.style.height = height;
          });
        },

        leave(element) {
          const { height } = getComputedStyle(element);
          element.style.height = height;
          // Force repaint to make sure the
          // animation is triggered correctly.
          // eslint-disable-next-line no-unused-expressions
          getComputedStyle(element).height;

          requestAnimationFrame(() => {
            element.style.height = 0;
          });
        },
      },
    };

    return createElement('transition', data, context.children);
  },
};
