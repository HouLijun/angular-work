angular.module("work.common",[])
    .service(["ssss","$http", function ($http) {
        this.get= function () {
            return $http.get("/contact")
        }
    }])
/*可以链式调用，小型项目的服务全部放到一个文件中，在其他页面使用时只需要注入某个service*/
/*放公共控制器，服务*/