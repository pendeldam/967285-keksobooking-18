'use strict';
(function () {
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var KEYCODE_ENTER = 13;
  var PHOTOS_WIDTH = 45;
  var PHOTOS_HEIGHT = 40;
  var mapping = {
    'title': '.popup__title',
    'address': '.popup__text--address',
    'type': '.popup__type',
    'description': '.popup__description',
    'avatar': '.popup__avatar',
    'price': '.popup__text--price',
    'rooms': '.popup__text--capacity',
    'guests': '.popup__text--capacity',
    'checkin': '.popup__text--time',
    'checkout': '.popup__text--time',
    'features': '.popup__features',
    'photos': '.popup__photos'
  };

  var getItemPropArray = function (array) {
    if (array) {
      if (array.length > 0) {
        var result = [];
        array.forEach(function (item) {
          result.push(item);
        });
      }
    } else {
      result = 0;
    }
    return result;
  };

  var prepItem = function (item) {
    var result = {};
    result.title = item.offer.title;
    result.address = item.offer.address;
    result.type = item.offer.type;
    result.description = item.offer.description;
    result.avatar = item.author.avatar;
    result.price = item.offer.price;
    result.rooms = item.offer.rooms.toString();
    result.guests = item.offer.guests.toString();
    result.checkin = item.offer.checkin;
    result.checkout = item.offer.checkout;
    result.features = getItemPropArray(item.offer.features);
    result.photos = getItemPropArray(item.offer.photos);
    return result;
  };

  var checkProps = function (props, item, id) {
    var card = cardTemplate.cloneNode(true);
    card.dataset.id = id;

    for (var value in props) {
      if (Object.prototype.hasOwnProperty.call(props, value)) {
        var element = card.querySelector(props[value]);

        if (item[value]) {
          if (value === 'avatar') {
            element.src = item[value];
          } else if (value === 'price') {
            element.innerHTML = item[value] + ' &#x20bd;<span>/ночь</span>';
          } else if (value === 'rooms') {
            element.textContent = item[value] + ' комнаты для ';
          } else if (value === 'guests') {
            element.textContent += item[value] + ' гостей';
          } else if (value === 'checkin') {
            element.textContent = 'Заезд после ' + item[value];
          } else if (value === 'checkout') {
            element.textContent += '. Выезд до ' + item[value];
          } else if (value === 'features' && item[value].length > 0) {
            element.innerHTML = '';
            item[value].forEach(function (feature) {
              var li = document.createElement('li');
              li.className = 'popup__feature popup__feature--' + feature;
              element.appendChild(li);
            });
          } else if (value === 'photos' && item[value].length > 0) {
            element.innerHTML = '';
            item[value].forEach(function (photo) {
              var li = document.createElement('img');
              li.className = 'popup__photo';
              li.src = photo;
              li.width = PHOTOS_WIDTH;
              li.height = PHOTOS_HEIGHT;
              li.alt = 'offer image';
              element.appendChild(li);
            });
          } else {
            element.textContent = item[value];
          }
        } else {
          element.style.display = 'none';
        }
      }
    }
    return card;
  };

  var renderPin = function (ad) {
    var pin = mapPinTemplate.cloneNode(true);

    pin.style.left = ad.location.x - mapPinTemplate.firstElementChild.width / 2 + 'px';
    pin.style.top = ad.location.y - mapPinTemplate.firstElementChild.height + 'px';
    pin.firstElementChild.src = ad.author.avatar;
    pin.firstElementChild.alt = ad.offer.title;
    pin.firstElementChild.dataset.id = window.map.offers.indexOf(ad);
    pin.dataset.id = window.map.offers.indexOf(ad);
    pin.addEventListener('mousedown', window.card.openCardHandler);
    pin.addEventListener('keydown', function (evt) {
      if (evt.keyCode === KEYCODE_ENTER) {
        window.card.openCardHandler(evt);
      }
    });
    return pin;
  };

  window.rendering = {
    renderPins: function (data) {
      var fragment = document.createDocumentFragment();
      var number = data.length > 5 ? 5 : data.length;

      data.slice().splice(0, number).forEach(function (pin) {
        fragment.appendChild(renderPin(pin));
      });
      mapPins.appendChild(fragment);
    },
    renderCard: function (ad, id) {
      var fragment = document.createDocumentFragment();
      fragment.appendChild(checkProps(mapping, prepItem(ad), id));
      map.insertBefore(fragment, mapPins.nextSibling);
    }
  };
})();
