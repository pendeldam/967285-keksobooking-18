'use strict';
(function () {
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var KEYCODE_ENTER = 13;

  var renderPin = function (pin) {
    var offerElement = mapPinTemplate.cloneNode(true);

    if (pin.offers === null) {
      offerElement.style.display = 'none';
    }
    offerElement.style.left = pin.location.x - mapPinTemplate.firstElementChild.width / 2 + 'px';
    offerElement.style.top = pin.location.y - mapPinTemplate.firstElementChild.height + 'px';
    offerElement.firstElementChild.src = pin.author.avatar;
    offerElement.firstElementChild.alt = pin.offer.title;
    offerElement.firstElementChild.dataset.id = window.map.offers.indexOf(pin);
    offerElement.dataset.id = window.map.offers.indexOf(pin);
    offerElement.addEventListener('mousedown', window.card.openCardHandler);
    offerElement.addEventListener('keydown', function (evt) {
        if (evt.keyCode === KEYCODE_ENTER) {
          window.card.openCardHandler(evt);
        }
      });
    return offerElement;
  }
  window.render = {
    pin: function (data) {
      var fragment = document.createDocumentFragment();
      var number = data.length > 5 ? 5 : data.length;

      for (var i = 0; i < number; i++) {
        fragment.appendChild(renderPin(data[i]));
      }
      mapPins.appendChild(fragment);
    },
    card: function (ad, identifier) {
      var fragment = document.createDocumentFragment();
      var card = cardTemplate.cloneNode(true);
      var photos = card.querySelector('.popup__photos');
      var features = card.querySelector('.popup__features');
      var id = identifier;
      card.dataset.id = id;

      var props = {
        'title': '.popup__title',
        'address': '.popup__text--address',
        'type': '.popup__type',
        'description': '.popup__description',
        'avatar': '.popup__avatar',
        'price': '.popup__text--price'
      };

      if (!ad.offer.photos.length) {
        photos.style.display = 'none';
      } else {
        photos.innerHTML = '';
        ad.offer.photos.forEach(function (photo) {
          var element = document.createElement('img');
          element.className = 'popup__photo';
          element.src = photo;
          element.width = 45;
          element.height = 40;
          element.alt = 'offer image';
          photos.appendChild(element);
        });
      }

      if (!ad.offer.features.length) {
        features.style.display = 'none';
      } else {
        features.innerHTML = '';
        ad.offer.features.forEach(function (feature) {
          var element = document.createElement('li');
          element.className = 'popup__feature popup__feature--' + feature;
          features.appendChild(element);
        });
      }

      for (var value in props) {
        var element = card.querySelector(props[value]);
        if (ad.offer[value] !== null) {
          if (value === 'avatar') {
            element.src = ad.author[value];
          } else if (value === 'price') {
            element.innerHTML = ad.offer[value] + ' &#x20bd;<span>/ночь</span>';
          } else {
              element.textContent = ad.offer[value];
          }
        } else {
            element.style.display = 'none';
        }
      }

      if (!ad.offer.rooms || !ad.offer.guests) {
        card.querySelector('.popup__text--capacity').style.display = 'none';
      } else {
          card.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
      }

      if (!ad.offer.checkin || !ad.offer.checkout) {
        card.querySelector('.popup__text--time').style.display = 'none';
      } else {
          card.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + '. Выезд до ' + ad.offer.checkout;
      }

      fragment.appendChild(card);
      map.insertBefore(fragment, mapPins.nextSibling);
    }
  };
})();
