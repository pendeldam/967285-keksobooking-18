'use strict';
(function () {
  var filters = {};
  var mapping = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests',
  };

  var convertPrice = function (price) {
    if (price < 10000) {
      return 'low';
    } else if (price > 10000 && price < 50000) {
        return 'middle';
    } else if (price > 50000) {
        return 'high';
    }
  };

  var check = function (filters, item) {
    for (var value in filters) {
      if (value === 'price') {
        console.log(value, filters[value], convertPrice(item.offer[value]));
        if (filters[value] !== convertPrice(item.offer[value])) {
          return false;
        }
        return true;
      }

      console.log(value, filters[value], item.offer[value]);
      if (filters[value] !== item.offer[value]) {
        return false;
      }
    }
    return true;
  };

  var filter = function(offers) {
    document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
      pin.remove();
    });

    if (document.querySelector('.map__card')) {
      window.card.closeCardHandler();
    }

    var filtered = offers.filter(function (item) {
      console.log('check:', check(filters, item));
      return check(filters, item);
    });
    console.log(filtered);
    window.render.pin(filtered);
  };

  window.filtering = {
    add: function(evt) {
      if (event.target.name === 'features') {
        filters[evt.target.value] = evt.target.value;
        if (!evt.target.checked) {
          delete filters[evt.target.value];
        }
      } else if (event.target.name === 'housing-rooms' || event.target.name === 'housing-guests') {
          filters[mapping[evt.target.name]] = +evt.target.value;
      } else {
          filters[mapping[evt.target.name]] = evt.target.value;
      }

      if (evt.target.value === 'any') {
        delete filters[mapping[evt.target.name]];
      }

      filter(window.map.offers);
      console.log(filters);
    }
  };
})();
