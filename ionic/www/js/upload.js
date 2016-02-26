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
        var extension;

        var fileToDataURL = function (file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            extension = file.name.split('.').pop();
            console.log(extension);
            console.log('file', file);
            reader.readAsDataURL(file);

            reader.onload = function (event) {
                deferred.resolve(event.target.result);
                base64Encoded = event.currentTarget.result;
                console.log(event);
            };
            return deferred.promise;
        };

        return {
            link: function postLink(scope, element) {
                var applyScope = function (imageResult) {
                    scope.$apply(function () {
                        scope.image = imageResult;
                        imageResult.extension = extension
                    });
                };

                element.bind('change', function (event) {
                    var files = event.target.files;
                    var imageResult = {
                        file: files[0],
                        url: URL.createObjectURL(files[0])
                    };

                    fileToDataURL(files[0]).then(function (dataURL) {
                        if (dataURL.indexOf('data:image') == -1) {
                            dataURL = dataURL.replace('data:', 'data:image/' + extension + ';');
                        }
                        imageResult.dataURL = dataURL
                        console.log(dataURL);
                    });
                    applyScope(imageResult);
                });
            }
        };
    })