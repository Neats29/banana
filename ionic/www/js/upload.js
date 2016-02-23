angular.module('upload', [])
  .directive('image', function($q) {
    'use strict';
    var URL = window.URL || window.webkitURL;
    var base64Encoded;
    var createImage = function(url, callback) {
      var image = new Image();
      image.onload = function() {
        callback(image);
      };
      image.src = url;
    };
    
    var fileToDataURL = function (file) {
      console.log(file);
      var deferred = $q.defer();
      var reader = new FileReader();
      reader.onload = function (event) {
          deferred.resolve(event.target.result);
          base64Encoded = event.currentTarget.result;
        console.log(base64Encoded);
      };
      reader.readAsDataURL(file);
      return deferred.promise;
    };

    return {
      link: function postLink(scope, element) {
          var applyScope = function(imageResult) {
            scope.$apply(function() {
              scope.image = imageResult;
            });
          };

          element.bind('change', function (event) {
            var files = event.target.files;
            var imageResult = {
              file: files[0],
              url: URL.createObjectURL(files[0])
            };

            fileToDataURL(files[0]).then(function (dataURL) {
                imageResult.dataURL = dataURL;
            });
            applyScope(imageResult);
          });
        }
    };
})
