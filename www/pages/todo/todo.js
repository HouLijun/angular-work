angular.module('work.todo', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/todo', {
            templateUrl: '/pages/todo/todo.html',
            controller: 'TodoCtrl'
        });
    }])
    .controller('TodoCtrl', ['$scope',function($scope) {
        if(localStorage.arr){
            $scope.list = JSON.parse(localStorage.arr)
        }else{
            $scope.list = [];
        }
        $scope.save= function () {
            localStorage.arr=JSON.stringify($scope.list);
        }
        $scope.add = function () {
            var key=$scope.key;
            if(key){
                $scope.list.push({'title':key,'isDone':false});
            }
            $scope.key="";
        }
        $scope.remove = function (i) {
            $scope.list.splice(i,1);
        }
        $scope.state=0;
        $scope.fn1= function (v) {
            return v.isDone;
        }
        $scope.fn2= function (v) {
            return !v.isDone;
        }
        $scope.fn3= function (v) {
            if($scope.state==0){
                return true;
            }else if($scope.state==1){
                return v.isDone;
            }else if($scope.state==2){
                return !v.isDone;
            }
        }
    }]);