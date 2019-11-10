'use strict';
(function () {
  var avatarChoose = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  avatarChoose.addEventListener('change', function () {
    var file = avatarChoose.files[0];
    var filename = file.name.toLowerCase();

    var match = FILE_TYPES.some(function (type) {
      return filename.endsWith(type);
    });

    if (match) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });
})();
