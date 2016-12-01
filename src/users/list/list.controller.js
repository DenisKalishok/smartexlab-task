angular
    .module('users')
    .controller('UserListController', [
        'RequestService',

        UserListController
    ]);

function UserListController(RequestService) {
    this.list = null;

    RequestService
        .getUsers()
        .then(function (data) {
            console.log(data);
        });
}
