angular.module("work.contact",["ngRoute"])
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider.when("/contact",{
            templateUrl:"/pages/contact/contact.html",
            controller:"ContactCtrl"
        })
    }])
    .service("contactService", ["$http", function ($http) {  //http请求  get post put delete依赖注入
        this.getList = function () {
            return $http.get("/contact");
        };
    }])
    .controller("ContactCtrl",["$scope","contactService",function($scope,contactService){
        $scope.list=[];
        contactService.getList().then(function (result) {
            var arr=[];
            var dict={};
            result.data.forEach(function (v,i) {
                var I = v.pinyin[0].toUpperCase();
                if(!dict[I]){
                    var o={
                        index:I,
                        peoples:[]
                    };
                    o.peoples.push(v);
                    arr.push(o);
                    dict[I]=true;
                }else{
                    arr.forEach(function (d) {
                        if(d.index==I){
                            d.peoples.push(v)
                        }
                    })
                }
            })
            arr.sort(function(a,b){
                return a.index > b.index;
            })
            $scope.list =arr;
        });
        $scope.letter=[];
        for(var i=65;i<91;i++){
            $scope.letter.push(String.fromCharCode(i));
        }
    }])
$(".indicators .letter").on("click", function () {
    
})