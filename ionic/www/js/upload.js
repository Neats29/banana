angular.module('upload', [])
  .directive('image', function($q) {
    'use strict';
    var URL = window.URL || window.webkitURL;
    var createImage = function(url, callback) {
      var image = new Image();
      image.onload = function() {
        callback(image);
      };
      image.src = url;
    };

    var fileToDataURL = function (file) {
      var deferred = $q.defer();
      var reader = new FileReader();
      reader.onload = function (e) {
          deferred.resolve(e.target.result);
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
});