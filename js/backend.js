(function () {
  window.backend = {
    load: function (onLoad, onError) {
      var url = 'https://js.dump.academy/keksobooking/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response)
        } else {
          onError(xhr.status);
        }
      });
      xhr.timeout = 10000;
      xhr.open('get', url);
      xhr.send();
    }
  };
})();
