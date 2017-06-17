//前端路由
angular.module('work',['ngRoute','work.note','work.todo','work.contact','work.contact.admin'])
    //依赖于外部模块
    .config(['$routeProvider', function ($routeProvider) {
        //未定义时的导向（默认页面）
        $routeProvider.otherwise({redirectTo:"/note"});
    }])
    .controller("mainCtrl",["$scope", function ($scope) {
        $scope.urls=[
            {name:"Note",url:"#!/note"},
            {name:"Todo",url:"#!/todo"},
            {name:"Contact",url:"#!/contact"}
        ]
    }])

