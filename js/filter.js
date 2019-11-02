'use strict';
(function () {
  var filters = [];
  var mapping = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests',
  };

  var convertPrice = function (item) {
    if (item.offer.price < 10000) {
      return 'low';
    } else if (item.offer.price > 10000 && item.offer.price < 50000) {
        return 'middle';
    } else if (item.offer.price > 50000) {
        return 'high';
    }
  };

  var check = function (filters, item) {
    for (var i = 0; i < filters.length; i++) {
      console.log(filters[i].value, item.offer[filters[i].type]);
      if (filters[i].value !== item.offer[filters[i].type]) {
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

    window.filtering.filtered = offers.filter(function (item) {
      console.log('check:', check(filters, item));
      return check(filters, item);
    });

    console.log(window.filtering.filtered);
  };

  var remove = function (evt, filters) {

  };

  window.filtering = {
    add: function(evt) {
      if (event.target.name === 'features') {
        filters.push({type: evt.target.value, value: true});
        if (!evt.target.checked) {
          //delete filters[evt.target.value];
        }
      } else if (event.target.name === 'housing-rooms' || event.target.name === 'housing-guests') {
          console.log(mapping[evt.target.name], evt.target.value);
          filters.push({type: mapping[evt.target.name], value: +evt.target.value});
      } else {
          filters.push({type: mapping[evt.target.name], value: evt.target.value});
      }
      /*
      if (evt.target.value === 'any') {
        delete filters[mapping[evt.target.name]];
      }
      */
      filter(window.map.offers);
      console.log(filters);
      window.render.pin(window.filtering.filtered);
    }
  };
})();
