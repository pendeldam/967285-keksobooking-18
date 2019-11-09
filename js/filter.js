'use strict';
(function () {
  var timeout = null;
  var activeFilters = {};
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
    return false;
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

  var checkFilters = function (activeFilters, item) {
    for (var value in activeFilters) {
      if (activeFilters[value] !== item[value]) {
        return false;
      }
    }
    return true;
  };

  var filterPins = function (offers) {
    document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
      pin.remove();
    });

    if (document.querySelector('.map__card')) {
      document.querySelector('.map__card').remove();
      document.removeEventListener('keydown', window.card.onCloseCard);
    }

    var filtered = offers.filter(function (item) {
      return checkFilters(activeFilters, prepItem(item));
    });

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
      window.rendering.renderPins(filtered);
    }, 500);
  };

  window.filtering = {
    addFilter: function (evt) {
      if (event.target.name === 'features') {
        activeFilters[evt.target.value] = true;
        if (!evt.target.checked) {
          delete activeFilters[evt.target.value];
        }
      } else if (event.target.name === 'housing-rooms' || event.target.name === 'housing-guests') {
        activeFilters[mapping[evt.target.name]] = +evt.target.value;
      } else {
        activeFilters[mapping[evt.target.name]] = evt.target.value;
      }

      if (evt.target.value === 'any') {
        delete activeFilters[mapping[evt.target.name]];
      }

      filterPins(window.map.offers);
    }
  };
})();
