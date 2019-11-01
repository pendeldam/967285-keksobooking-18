'use strict';
(function () {
  window.filtering = {
    add: function (evt) {
      var filter = evt.target.name;

        switch (filter) {
          case 'housing-type':
            window.map.filters.type = evt.target.value;
            if (evt.target.value === 'any') {
              delete window.map.filters.type;
            }
            window.filtering.check(window.map.filters);
            break;
          case 'housing-price':
            window.map.filters.price = evt.target.value;
            if (evt.target.value === 'any') {
              delete window.map.filters.price;
            }
            //window.filtering.check(window.map.filters);
            break;
          case 'housing-rooms':
            window.map.filters.rooms = +evt.target.value;
            if (evt.target.value === 'any') {
              delete window.map.filters.rooms;
            }
            window.filtering.check(window.map.filters);
            break;
          case 'housing-guests':
            window.map.filters.guests = +evt.target.value;
            if (evt.target.value === 'any') {
              delete window.map.filters.guests;
            }
            window.filtering.check(window.map.filters);
            break;
          case 'features':
            switch (evt.target.value) {
              case 'wifi':
                window.map.filters.features.wifi = evt.target.value;
                if (!evt.target.checked) {
                  delete window.map.filters.features.wifi;
                }
                break;
              case 'dishwasher':
                window.map.filters.features.dishwasher = evt.target.value;
                if (!evt.target.checked) {
                  delete window.map.filters.features.dishwasher;
                }
                break;
              case 'parking':
                window.map.filters.features.parking = evt.target.value;
                if (!evt.target.checked) {
                  delete window.map.filters.features.parking;
                }
                break;
              case 'washer':
                window.map.filters.features.washer = evt.target.value;
                if (!evt.target.checked) {
                  delete window.map.filters.features.washer;
                }
                break;
              case 'elevator':
                window.map.filters.features.elevator = evt.target.value;
                if (!evt.target.checked) {
                  delete window.map.filters.features.elevator;
                }
                break;
              case 'conditioner':
                window.map.filters.features.conditioner = evt.target.value;
                if (!evt.target.checked) {
                  delete window.map.filters.features.conditioner;
                }
                break;
            }
        }
        console.log('filters:', window.map.filters);
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
          if (item.offer[value] === filters[value] && value == 'rooms') {
            item.rank += 3;
            console.log(value ,item.offer[value], filters[value], item.rank);
          }
          if (item.offer[value] === filters[value] && value == 'guests') {
            item.rank += 2;
            console.log(value ,item.offer[value], filters[value], item.rank);
          }
          if (item.offer.features[value] === filters[value] && value == 'wifi') {
            item.rank += 1;
            console.log(value ,item.offer[value], filters[value], item.rank);
          }
        }
      });

      var sorted = window.map.offers.sort(function (left, right) {
        return right.rank - left.rank;
      });

      var filtered = sorted.filter(function (item) {
        if (!window.map.offers[0].rank) {
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
