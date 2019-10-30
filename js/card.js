'use strict';
(function () {
  var KEYCODE_ESC = 27;

  window.card = {
    onCloseCard: function (evt) {
      if (evt.keyCode === KEYCODE_ESC) {
        window.card.closeCardHandler();
      }
    },

    openCardHandler: function (evt) {
      if (document.querySelector('.map__card')) {
        document.querySelector('.map__card').remove();
      }
      var id = evt.target.dataset.id;
      window.render.card(window.map.offers[id]);
      document.addEventListener('keydown', window.card.onCloseCard);
      document.querySelector('.popup__close').addEventListener('click', window.card.closeCardHandler);
    },

    closeCardHandler: function () {
      document.querySelector('.map__card').remove();
      document.removeEventListener('keydown', window.card.onCloseCard);
    }
  };
})();
