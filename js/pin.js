'use strict';
(function () {
  var KEYCODE_ENTER = 13;
  var COORD_MIN_Y = 130;
  var COORD_MAX_Y = 630;
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var address = document.querySelector('#address');

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

      var coordX = mapPinMain.offsetLeft - shift.x;
      var coordY = mapPinMain.offsetTop - shift.y;

      coordX = coordX < -mapPinMain.offsetWidth / 2 ? -mapPinMain.offsetWidth / 2 : coordX;
      coordX = coordX > mapPins.offsetWidth - mapPinMain.offsetWidth / 2 ? mapPins.offsetWidth - mapPinMain.offsetWidth / 2 : coordX;
      coordY = coordY < COORD_MIN_Y - mapPinMain.offsetHeight + mapPinMain.offsetHeight ? COORD_MIN_Y - mapPinMain.offsetHeight + mapPinMain.offsetHeight : coordY;
      coordY = coordY > COORD_MAX_Y - mapPinMain.offsetHeight ? COORD_MAX_Y - mapPinMain.offsetHeight : coordY;

      mapPinMain.style.left = coordX + 'px';
      mapPinMain.style.top = coordY + 'px';

      address.value = Math.ceil(coordX + mapPinMain.offsetWidth / 2) + ', ' + Math.ceil(coordY + mapPinMain.offsetHeight);
    };

    var onMouseUp = function (evtUp) {
      evtUp.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
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
