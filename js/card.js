'use strict';
(function () {
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var KEYCODE_ESC = 27;

  window.card = {
    onCloseCard: function (evt) {
      if (evt.keyCode === KEYCODE_ESC) {
        window.card.closeCardHandler();
      }
    },

    openCardHandler: function (evt) {
      if (document.querySelector('.map__card')) {
        document.querySelector('.map__card').remove();
      }
      var id = evt.target.dataset.id;
      window.card.renderCard(window.map.offers[id]);
      document.addEventListener('keydown', window.card.onCloseCard);
      document.querySelector('.popup__close').addEventListener('click', window.card.closeCardHandler);
    },

    closeCardHandler: function () {
      document.querySelector('.map__card').remove();
      document.removeEventListener('keydown', window.card.onCloseCard);
    },

    renderCard: function (random) {
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
