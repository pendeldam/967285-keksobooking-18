'use strict';
(function () {
  window.filtering = {
    check: function(filters) {
      document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
        pin.remove();
      });

      if (document.querySelector('.map__card')) {
        window.card.closeCardHandler();
      }

      var filtered = window.map.offers.filter(function (item) {
        for (var filter in filters) {
            return item.offer[filter] === filters[filter];
        }
      });
      console.log(filtered);
      window.render.pin(filtered);
    }
  };
})();
