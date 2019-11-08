'use strict';
(function () {
  var KEYCODE_ESC = 27;
  var pins = document.querySelector('.map__pins');
  window.card = {
    onCloseCard: function (evt) {
      var id = document.querySelector('.map__card').dataset.id;
      pins.querySelector('.map__pin[data-id="' + id + '"]').classList.remove('map__pin--active');
      if (evt.keyCode === KEYCODE_ESC) {
        window.card.closeCardHandler();
      }
    },

    openCardHandler: function (evt) {
      if (document.querySelector('.map__card')) {
        var cardID = document.querySelector('.map__card').dataset.id;
        pins.querySelector('.map__pin[data-id="' + cardID + '"]').classList.remove('map__pin--active');
        document.querySelector('.map__card').remove();
      }
      var id = evt.target.dataset.id;
      pins.querySelector('.map__pin[data-id="' + id + '"]').classList.add('map__pin--active');
      window.rendering.renderCard(window.map.offers[id], id);
      document.addEventListener('keydown', window.card.onCloseCard);
      document.querySelector('.popup__close').addEventListener('click', window.card.closeCardHandler);
    },

    closeCardHandler: function () {
      var cardID = document.querySelector('.map__card').dataset.id;
      pins.querySelector('.map__pin[data-id="' + cardID + '"]').classList.remove('map__pin--active');
      document.querySelector('.map__card').remove();
      document.removeEventListener('keydown', window.card.onCloseCard);
    }
  };
})();
