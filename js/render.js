'use strict';
(function () {
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var KEYCODE_ENTER = 13;

  var renderPin = function (pin) {
    var offerElement = mapPinTemplate.cloneNode(true);
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
    card: function (random) {
      var fragment = document.createDocumentFragment();
      var card = cardTemplate.cloneNode(true);

      var photos = card.querySelector('.popup__photos');
      photos.innerHTML = '';
      random.offer.photos.forEach(function (photo) {
        var element = document.createElement('img');
        element.className = 'popup__photo';
        element.src = photo;
        element.width = 45;
        element.height = 40;
        element.alt = 'offer image';
        photos.appendChild(element);
      });

      var features = card.querySelector('.popup__features');
      features.innerHTML = '';
      random.offer.features.forEach(function (feature) {
        var element = document.createElement('li');
        element.className = 'popup__feature popup__feature--' + feature;
        features.appendChild(element);
      });

      card.querySelector('.popup__title').textContent = random.offer.title;
      card.querySelector('.popup__text--address').textContent = random.offer.address;
      card.querySelector('.popup__text--price').innerHTML = random.offer.price + ' &#x20bd;<span>/ночь</span>';
      card.querySelector('.popup__type').textContent = random.offer.type;
      card.querySelector('.popup__text--capacity').textContent = random.offer.rooms + ' комнаты для ' + random.offer.guests + ' гостей';
      card.querySelector('.popup__text--time').textContent = 'Заезд после ' + random.offer.checkin + '. Выезд до ' + random.offer.checkout;
      card.querySelector('.popup__description').textContent = random.offer.description;
      card.querySelector('.popup__avatar').src = random.author.avatar;
      fragment.appendChild(card);
      map.insertBefore(fragment, mapPins.nextSibling);
    }
  };
})();
