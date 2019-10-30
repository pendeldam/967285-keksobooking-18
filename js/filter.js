'use strict';
(function () {
  window.filter = {
    filterType: function(evt) {
      document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
        pin.remove();
      });

      if (document.querySelector('.map__card')) {
        window.card.closeCardHandler();
      }

      var filtered = window.map.offers.slice().filter(function (item) {
        return item.offer.type === evt.target.value;
      });

      window.render.pin(filtered);
    }
  };
})();
