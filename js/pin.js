'use strict';
(function () {
  var KEYCODE_ENTER = 13;
  var COORD_MIN_Y = 130;
  var COORD_MAX_Y = 630;
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var address = document.querySelector('#address');

  var checkPinCoords = function (startX, startY, shiftX, shiftY) {
    if (startX < mapPins.offsetParent.offsetLeft) {
      mapPinMain.style.left = mapPins.offsetParent.offsetLeft - mapPins.offsetParent.offsetLeft - mapPinMain.offsetWidth / 2 + 'px';
    } else if (startX > map.offsetWidth + map.offsetLeft) {
      mapPinMain.style.left = map.offsetWidth - mapPinMain.offsetWidth / 2 + 'px';
    } else {
      mapPinMain.style.left = (mapPinMain.offsetLeft - shiftX) + 'px';
    }
    if (startY < COORD_MIN_Y - mapPinMain.offsetHeight) {
      mapPinMain.style.top = COORD_MIN_Y - mapPinMain.offsetHeight + 'px';
    } else if (startY > COORD_MAX_Y + mapPinMain.offsetHeight) {
      mapPinMain.style.top = COORD_MAX_Y + 'px';
    } else {
      mapPinMain.style.top = (mapPinMain.offsetTop - shiftY) + 'px';
    }
  };

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (evtMove) {
      evtMove.preventDefault();

      var shift = {
        x: startCoords.x - evtMove.clientX,
        y: startCoords.y - evtMove.clientY
      };

      startCoords.x = evtMove.clientX;
      startCoords.y = evtMove.clientY;
      address.value = Math.ceil(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + Math.ceil(mapPinMain.offsetTop + mapPinMain.offsetHeight);
      checkPinCoords(startCoords.x, startCoords.y, shift.x, shift.y);
    };

    var onMouseUp = function (evtUp) {
      evtUp.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      address.value = Math.ceil(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + Math.ceil(mapPinMain.offsetTop + mapPinMain.offsetHeight);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  mapPinMain.addEventListener('click', window.map.enablePage);
  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KEYCODE_ENTER) {
      window.map.enablePage();
    }
  });
})();
