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
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var address = adForm.querySelector('#address');
  address.value = mapPinMain.offsetTop + ', ' + mapPinMain.offsetLeft;

  window.map = {
    offers: [],
    renderPin: function (pin) {
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
    },
    loadSuccess: function (data) {
      var fragment = document.createDocumentFragment();
      data.forEach(function (item) {
        window.map.offers.push(item);
        fragment.appendChild(window.map.renderPin(item));
      });
      mapPins.appendChild(fragment);
    },
    loadError: function (msg) {
      var errorElement = errorTemplate.cloneNode(true);
      errorElement.firstElementChild.textContent = 'Ошибка загрузки объявления ' + '(код: ' + msg + ')';
      document.body.insertAdjacentElement('afterbegin', errorElement);
    },
    checkPinCoords: function (startX, startY, shiftX, shiftY) {
      if (startX < mapPins.offsetParent.offsetLeft) {
        mapPinMain.style.left = mapPins.offsetParent.offsetLeft - mapPins.offsetParent.offsetLeft - mapPinMain.offsetWidth / 2 + 'px';
      } else if (startX > map.offsetWidth + map.offsetLeft) {
        mapPinMain.style.left = map.offsetWidth - mapPinMain.offsetWidth / 2 + 'px';
      } else {
        mapPinMain.style.left = (mapPinMain.offsetLeft - shiftX) + 'px';
      }
      if (startY < 130 - mapPinMain.offsetHeight) {
        mapPinMain.style.top = 130 - mapPinMain.offsetHeight + 'px';
      } else if (startY > 630 + mapPinMain.offsetHeight) {
        mapPinMain.style.top = 630 + 'px';
      } else {
        mapPinMain.style.top = (mapPinMain.offsetTop - shiftY) + 'px';
      }
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
      window.backend.load(window.map.loadSuccess, window.map.loadError);
      window.form.checkOfferPrice();
      address.value = Math.ceil(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + Math.ceil(mapPinMain.offsetTop + mapPinMain.offsetHeight);
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

  mapPinMain.addEventListener('click', window.map.enablePage);
  mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEYCODE_ENTER) {
    window.map.enablePage();
  }
  });

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (evt) {
      evt.preventDefault();

      var shift = {
        x: startCoords.x - evt.clientX,
        y: startCoords.y - evt.clientY
      };

      startCoords.x = evt.clientX;
      startCoords.y = evt.clientY;
      address.value = Math.ceil(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + Math.ceil(mapPinMain.offsetTop + mapPinMain.offsetHeight);
      window.map.checkPinCoords(startCoords.x, startCoords.y, shift.x, shift.y);
    };

    var onMouseUp = function (evt) {
      evt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      address.value = Math.ceil(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + Math.ceil(mapPinMain.offsetTop + mapPinMain.offsetHeight);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
  window.map.disablePage();
})();
