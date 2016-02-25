angular.module('upload', [])
    .directive('image', function ($q) {
        'use strict';
        var URL = window.URL || window.webkitURL;
        var base64Encoded;
        var createImage = function (url, callback) {
            var image = new Image();
            image.src = url;
            3

            image.onload = function () {
                callback(image);
            };
        };

        var fileToDataURL = function (file) {
            var deferred = $q.defer();
            var reader = new FileReader();


            reader.readAsDataURL(file);

            reader.onload = function (event) {
                deferred.resolve(event.target.result);
                base64Encoded = event.currentTarget.result;
                console.log(base64Encoded);
            };
            return deferred.promise;
        };

        return {
            link: function postLink(scope, element) {
                var applyScope = function (imageResult) {
                    scope.$apply(function () {
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
                        saveImageToFile(dataURL);
                    });
                    applyScope(imageResult);
                });
            }
        };
    })