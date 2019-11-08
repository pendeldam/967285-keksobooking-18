'use strict';
(function () {
  var timeout = null;
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

  var prepItem = function (item) {
    var result = {};

    result.type = item.offer.type;
    result.price = convertPrice(item.offer.price);
    result.rooms = item.offer.rooms;
    result.guests = item.offer.guests;

    if (item.offer.features.length > 0) {
      item.offer.features.forEach(function (feature) {
        result[feature] = true;
      });
    }
    return result;
  };

  var check = function (filters, item) {
    for (var value in filters) {
      if (filters[value] !== item[value]) {
        return false;
      }
    }
    return true;
  };

  var filter = function (offers) {
    document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
      pin.remove();
    });

    if (document.querySelector('.map__card')) {
      document.querySelector('.map__card').remove();
      document.removeEventListener('keydown', window.card.onCloseCard);
    }

    var filtered = offers.filter(function (item) {
      return check(filters, prepItem(item));
    });

    if (timeout) {
      clearTimeout(timeout);
    }
      timeout = setTimeout(function () {
        window.rendering.renderAds(filtered);
      }, 500);
  };

  window.filtering = {
    add: function (evt) {
      if (event.target.name === 'features') {
        filters[evt.target.value] = true;
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
    }
  };
})();
