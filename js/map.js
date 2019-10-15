'use strict';
(function () {
  var KEYCODE_ENTER = 13;
  var pageIsActive = false;
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var mapFilters = map.querySelector('.map__filters');
  var mapPins = map.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var times = document.querySelector('#timein').options;
  var types = document.querySelector('#housing-type').children;
  var titles = ['шикарный пентхаус с видом на море', 'настоящая дыра в трущобах', 'уютная квартирка для двоих'];
  var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var photosList = [
  "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
  ];

  window.map = {
    offers: [],
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    getRandomArray: function (array) {
      var result = [];
      array.forEach(function (item) {
        if (window.map.getRandomNumber(0, 2)) {
          result.push(item)
        }
      });
      return result;
    },
    getID: function (number) {
      return number;
    },
    getAvatar: function (number) {
      return 'img/avatars/user0' + (number + 1) + '.png';
    },
    getRandomOffer: function (number) {
      var randomOffer = {
        author: {
          avatar: window.map.getAvatar(number)
        },
        offer: {
          id: window.map.getID(number),
          title: titles[window.map.getRandomNumber(0, titles.length)],
          price: window.map.getRandomNumber(1, 10000),
          type: types[window.map.getRandomNumber(1, types.length)].textContent,
          rooms: window.map.getRandomNumber(1, 4),
          guests: window.map.getRandomNumber(1, 4),
          checkin: times[window.map.getRandomNumber(0, times.length)].value,
          checkout: times[window.map.getRandomNumber(0, times.length)].value,
          features: window.map.getRandomArray(featuresList),
          description: 'offer description',
          photos: window.map.getRandomArray(photosList)
        },
        location: {
          x: window.map.getRandomNumber(10, map.offsetWidth),
          y: window.map.getRandomNumber(130, (630 - 130) + 130)
        }
      };
      return randomOffer;
    },
    renderPin: function (pin) {
      var offerElement = mapPinTemplate.cloneNode(true);
      offerElement.style.left = pin.location.x - mapPinTemplate.firstElementChild.width / 2 + 'px';
      offerElement.style.top = pin.location.y - mapPinTemplate.firstElementChild.height + 'px';
      offerElement.firstElementChild.src = pin.author.avatar;
      offerElement.firstElementChild.alt = pin.offer.title;
      offerElement.firstElementChild.dataset.id = pin.offer.id;
      offerElement.dataset.id = pin.offer.id;
      offerElement.addEventListener('mousedown', window.card.openCardHandler);
      offerElement.addEventListener('keydown', function (evt) {
          if (evt.keyCode === KEYCODE_ENTER) {
            window.card.openCardHandler(evt);
          }
        });
      return offerElement;
    },
    renderPins: function (number) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < number; i++) {
        var random = window.map.getRandomOffer(i);
        random.offer.address = random.location.x + ', ' + random.location.y;
        window.map.offers.push(random);
        fragment.appendChild(window.map.renderPin(random));
      }
      mapPins.appendChild(fragment);
    },
    enablePage: function () {
      if (pageIsActive) {
        return
      }
      pageIsActive = true;
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      window.form.enableForm(adForm, 'fieldset');
      window.form.enableForm(mapFilters, 'select');
      window.map.renderPins(8);
      window.form.getPinCoordinates();
      window.form.checkOfferPrice();
    },
    disablePage: function () {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      window.form.disableForm(adForm, 'fieldset');
      window.form.disableForm(mapFilters, 'select');
      document.querySelectorAll('map__pin:not(.map__pin--main)').forEach(function (pin) {
        pin.remove();
      });
    }
  };

  mapPinMain.addEventListener('mousedown', window.map.enablePage);
  mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEYCODE_ENTER) {
    window.map.enablePage();
  }
  });
  window.map.disablePage();
})();