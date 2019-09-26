var map = document.querySelector('.map');
map.classList.remove('map--faded');
var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
var offers = [];
var times = document.querySelector('#timein').options;
var types = document.querySelector('#housing-type').children;
var features = ['Wi-Fi', 'Посудомоечная машина', 'Парковка', 'Стиральная машина', 'Лифт', 'Кондиционер'];
var photos = [
  "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
];

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getRandomArray = function (array) {
  var result = [];
  var index = getRandomNumber(0, array.length);
  for (var i = index; i < array.length; i++) {
    result.push(array[i]);
  }
  return result;
};

var getAvatar = function (number) {
  return 'img/avatars/user0' + number + '.png';
};

var getRandomOffer = function (number) {
  var randomOffer = {
    author: {
      avatar: getAvatar(number)
    },
    offer: {
      title: 'offer title',
      price: getRandomNumber(1, 10000),
      type: types[getRandomNumber(1, types.length)].value,
      rooms: getRandomNumber(1, 4),
      guests: getRandomNumber(1, 4),
      checkin: times[getRandomNumber(0, times.length)].value,
      checkout: times[getRandomNumber(0, times.length)].value,
      features: getRandomArray(features),
      description: 'offer description',
      photos: getRandomArray(photos)
    },
    location: {
      x: getRandomNumber(10, map.offsetWidth),
      y: getRandomNumber(130, (630 - 130) + 130)
    }
  };
  return randomOffer;
};

var renderOffer = function (some) {
  var offerElement = mapPinTemplate.cloneNode(true);
  mapPinTemplate.style.left = some.location.x - mapPinTemplate.firstElementChild.width / 2 + 'px';
  mapPinTemplate.style.top = some.location.y - mapPinTemplate.firstElementChild.height + 'px';
  mapPinTemplate.firstElementChild.src = some.author.avatar;
  mapPinTemplate.firstElementChild.alt = some.offer.title;
  return offerElement;
};

for (var i = 1; i < 9; i++) {
  var randomOffer = getRandomOffer(i);
  randomOffer.offer.address = randomOffer.location.x + ', ' + randomOffer.location.y;
  offers.push(randomOffer);
  fragment.appendChild(renderOffer(randomOffer));
}

mapPins.appendChild(fragment);
console.log(offers);
