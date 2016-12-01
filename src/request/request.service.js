angular
    .module('request')
    .service('RequestService', [
        '$http',

        RequestService
    ]);

function RequestService($http) {
    const TYPECODE_API = 'http://jsonplaceholder.typicode.com';

    this.getUsers = function () {
        return get('users');
    };

    this.getUser = function (userId) {
        return get('users/' + userId);
    };

    function get(path) {
        return new Promise(function (resolve, reject) {
            $http
                .get(TYPECODE_API + '/' + path)
                .then(function (data) {
                    resolve(data.data);
                })
                .catch(reject);
        });
    }
}
