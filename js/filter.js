'use strict';
(function () {
  var activeFilters = {};
  var mappingFilters = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests',
    'wifi': 'wifi',
    'dishwasher': 'dishwasher',
    'parking': 'parking',
    'washer': 'washer',
    'elevator': 'elevator',
    'conditioner': 'conditioner'
  };

  window.filtering = {
    add: function(evt) {
      if (event.target.name === 'features') {
        activeFilters[mappingFilters[evt.target.value]] = evt.target.value
        if (!evt.target.checked) {
          delete activeFilters[mappingFilters[evt.target.value]];
        }
      } else {
          activeFilters[mappingFilters[evt.target.name]] = evt.target.value;
      }

      if (evt.target.value === 'any') {
        delete activeFilters[mappingFilters[evt.target.name]];
      }

      window.filtering.check(activeFilters);
      console.log(activeFilters);
    },
    check: function(filters) {
      document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
        pin.remove();
      });

      if (document.querySelector('.map__card')) {
        window.card.closeCardHandler();
      }

      window.map.offers.forEach(function (item) {
        item.rank = 0;
        for (var value in filters) {
          if (item.offer[value] === filters[value] && value == 'type') {
            item.rank += 5;
            console.log(value ,item.offer[value], filters[value], item.rank);
          }
          if (item.offer[value] == filters[value] && value == 'rooms') {
            item.rank += 3;
            console.log(value ,item.offer[value], filters[value], item.rank);
          }
          if (item.offer[value] == filters[value] && value == 'guests') {
            item.rank += 2;
            console.log(value ,item.offer[value], filters[value], item.rank);
          }
        }
      });
      
      var sorted = window.map.offers.sort(function (left, right) {
        return right.rank - left.rank;
      });

      var filtered = sorted.filter(function (item) {
        if (window.map.offers[0].rank === 0) {
          return false;
        }
        return item.rank === window.map.offers[0].rank;
      });

      console.log(sorted);
      console.log(filtered);
      window.render.pin(filtered);
    }
  };
})();
