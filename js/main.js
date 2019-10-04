var KEYCODE_ENTER = 13;
var KEYCODE_ESC = 27;
var map = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var mapFilters = map.querySelector('.map__filters');
var mapPin = map.querySelector('.map__pin');
var mapPins = map.querySelector('.map__pins');
var mapPinMain = map.querySelector('.map__pin--main');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var offers = [];
var times = document.querySelector('#timein').options;
var types = document.querySelector('#housing-type').children;
var titles = ['шикарный пентхаус с видом на море', 'настоящая дыра в трущобах', 'уютная квартирка для двоих'];
var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photosList = [
  "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
];

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getRandomArray = function (array) {
  var result = [];
  array.forEach(function (item) {
    if (getRandomNumber(0, 2)) {
      result.push(item)
    }
  });
  return result;
};

var getID = function (number) {
  return number;
};

var getAvatar = function (number) {
  return 'img/avatars/user0' + (number + 1) + '.png';
};

var getRandomOffer = function (number) {
  var randomOffer = {
    author: {
      avatar: getAvatar(number)
    },
    offer: {
      id: getID(number),
      title: titles[getRandomNumber(0, titles.length)],
      price: getRandomNumber(1, 10000),
      type: types[getRandomNumber(1, types.length)].textContent,
      rooms: getRandomNumber(1, 4),
      guests: getRandomNumber(1, 4),
      checkin: times[getRandomNumber(0, times.length)].value,
      checkout: times[getRandomNumber(0, times.length)].value,
      features: getRandomArray(featuresList),
      description: 'offer description',
      photos: getRandomArray(photosList)
    },
    location: {
      x: getRandomNumber(10, map.offsetWidth),
      y: getRandomNumber(130, (630 - 130) + 130)
    }
  };
  return randomOffer;
};

var renderPin = function (pin) {
  var offerElement = mapPinTemplate.cloneNode(true);
  offerElement.style.left = pin.location.x - mapPinTemplate.firstElementChild.width / 2 + 'px';
  offerElement.style.top = pin.location.y - mapPinTemplate.firstElementChild.height + 'px';
  offerElement.firstElementChild.src = pin.author.avatar;
  offerElement.firstElementChild.alt = pin.offer.title;
  offerElement.firstElementChild.dataset.id = pin.offer.id;
  offerElement.dataset.id = pin.offer.id;
  return offerElement;
};

var renderCard = function (random) {
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
};

var renderPins = function (number) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < number; i++) {
    var random = getRandomOffer(i);
    random.offer.address = random.location.x + ', ' + random.location.y;
    offers.push(random);
    fragment.appendChild(renderPin(random));
  }
  mapPins.appendChild(fragment);

  document.querySelectorAll('.map__pin').forEach(function (pin) {
    pin.addEventListener('mousedown', openCardHandler);
    pin.addEventListener('keydown', function (evt) {
      if (evt.keyCode === KEYCODE_ENTER) {
        openCardHandler(evt);
      }
    });
  });
};

var disableForm = function (form, input) {
  form.querySelectorAll(input).forEach(function (item) {
    item.setAttribute('disabled', true);
  })
};

var enableForm = function (form, input) {
  form.querySelectorAll(input).forEach(function (item) {
    item.removeAttribute('disabled');
  })
};

var enablePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  getPinCoordinates();
  enableForm(adForm, 'fieldset');
  enableForm(mapFilters, 'select');
  setOfferPrice('flat');
  mapPinMain.removeEventListener('mousedown', enablePage);
};

var disablePage = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  disableForm(adForm, 'fieldset');
  disableForm(mapFilters, 'select');
  getPinCoordinates();
};

var getPinCoordinates = function () {
  var axisX= mapPin.offsetTop;
  var axisY= mapPin.offsetLeft;

  if (!map.classList.contains('map--faded')) {
    adForm.querySelector('#address').value = Math.ceil(axisX + mapPin.offsetHeight / 2) + ', ' + Math.ceil(axisY + mapPin.offsetWidth / 2);
  } else {
      adForm.querySelector('#address').value = axisX + ', ' + axisY;
  }
};

var setOfferPrice = function () {
  var type = document.querySelector('#type').selectedOptions[0].value;
  var price = document.querySelector('#price');
  switch (type) {
    case 'flat':
      price.min = '1000';
      price.placeholder = '1000';
    break;
    case 'bungalo':
      price.min = '0';
      price.placeholder = '0';
    break;
    case 'house':
      price.min = '5000';
      price.placeholder = '5000';
    break;
    case 'palace':
      price.min = '10000';
      price.placeholder = '10000';
    break;
    default:
      price.min = '1000';
      price.placeholder = '1000';
  }
};

var checkGuestsNumber = function () {
  var guests = +document.querySelector('#capacity').value;
  var rooms = +document.querySelector('#room_number').value;
  if (rooms === 100) {
    document.querySelector('#capacity').setCustomValidity('not for guests');
    document.querySelector('#capacity').style.borderColor = 'red';
  } else if (guests > rooms) {
    document.querySelector('#capacity').setCustomValidity('too much guests');
    document.querySelector('#capacity').style.borderColor = 'red';
  } else {
    document.querySelector('#capacity').setCustomValidity('');
    document.querySelector('#capacity').style.borderColor = '';
  }
};

var onCloseCard = function (evt) {
  if (evt.keyCode === KEYCODE_ESC) {
    closeCardHandler();
  }
};

var openCardHandler = function (evt) {
  var id = evt.target.dataset.id;
  renderCard(offers[id]);
  document.addEventListener('keydown', onCloseCard);
  document.querySelector('.popup__close').addEventListener('click', closeCardHandler);
};

var closeCardHandler = function () {
  document.querySelector('.map__card').remove();
  document.removeEventListener('keydown', onCloseCard);
};

document.querySelector('#room_number').addEventListener('change', checkGuestsNumber);
document.querySelector('#capacity').addEventListener('change', checkGuestsNumber);
document.querySelector('#type').addEventListener('change', setOfferPrice);

mapPinMain.addEventListener('mousedown', enablePage);
mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEYCODE_ENTER) {
    enablePage();
  }
});

document.querySelector('#timein').addEventListener('change', function (evt) {
  document.querySelector('#timeout').value = evt.target.value;
});

document.querySelector('#timeout').addEventListener('change', function (evt) {
  document.querySelector('#timein').value = evt.target.value;
});

disablePage();
renderPins(8);
