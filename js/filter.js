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
    console.log(result);
    return result;
  };

  var check = function (filters, item) {
    for (var value in filters) {
      console.log(value, filters[value], item[value], filters[value] === item[value]);
      if (filters[value] !== item[value]) {
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
      console.log('check:', check(filters, prepItem(item)));
      return check(filters, prepItem(item));
    });
    console.log(filtered);
    window.render.pin(filtered);
  };

  window.filtering = {
    add: function(evt) {
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
      console.log('filters:', filters);
    }
  };
})();
