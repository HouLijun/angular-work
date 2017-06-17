angular.module("work.note",["ngRoute"])
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider.when("/note",{
            templateUrl:"/pages/note/note.html",
            controller:"NoteCtrl"
        })
    }])
    .service('noteService',[function () {     //提供数据的增删改查服务
        this.getAllData=function(){		//方法
            if(localStorage.array){
                return JSON.parse(localStorage.array);
            }else{
                return [];
            }
        };
        this.saveAllDataToLacal= function (notes) {
            localStorage.array=JSON.stringify(notes);
        }
    }])
    .controller("NoteCtrl",["$scope","noteService", function ($scope,noteService) {
        //读取
        $scope.zIndex=[0];
        $scope.list=noteService.getAllData();
        //存储
        $scope.$watch("list",function (newVal,oldVal) {
            $scope.zIndex=[];
            //localStorage.array=JSON.stringify(newVal);
            noteService.saveAllDataToLacal(newVal);
            newVal.forEach(function(v,i){
                $scope.zIndex.push(v.index);
            })
            $scope.zIndex.sort(function (x,y) {
                return y-x;
            })
        },true);
        $scope.add= function (e) {
            if($scope.list.length==0){
                $scope.zIndex=[0];
            }else{
                $scope.zIndex=[];
                $scope.list.forEach(function(v,i){
                    $scope.zIndex.push(v.index);
                })
                $scope.zIndex.sort(function (x,y) {
                    return y-x;
                })
            }

            var index=0;
            var length=$scope.list.length;
            var num=1;
            if(length !== 0){
                num=$scope.list[length-1].id + 1;
            }
            var colors = ['primary', 'info', 'success', 'warning', 'danger'];
            var color = colors[Math.floor(Math.random() * 5)];
            var newData={id:num,title:"题目",content:"内容",theme:color ,position:{top: e.clientY - 70, left: e.clientX - 130},index:$scope.zIndex[0]+1};
            $scope.list.push(newData);
        }
        $scope.del= function (i) {
            $scope.list.splice(i, 1);
        }
    }])
    .directive("memo",[function(){
        return {
            restrict:"AE",
            replace:true,
            scope:{
                data:"=",
                position:"=",
                remove:"&",
                z:"="
            },
            templateUrl:"/pages/note/memo.html",
            controller: function ($scope,$element) {
                $scope.up= function () {
                    $scope.data.index=$scope.z[0] + 1;
                    //$scope.data.index=$scope.indexData[0]+1;
                }
            },
            link: function (scope,element,attr) {
                element.on("dblclick","input",function (e) {
                    $(this).removeAttr("disabled");
                    e.stopPropagation();
                })
                element.on("blur","input", function () {
                    $(this).attr("disabled","disabled");
                })
                var width=$(window).width();
                var height=$(window).height()-50;
                var note=element.children(".panel-heading");
                var flag;
                note.on("mousedown",function(e){
                    var ev=e||window.event;//解决兼容问题
                    var ox=ev.offsetX;//距事件源的距离
                    var oy=ev.offsetY;
                    if($(this).closest(".panel").find("input[disabled]").length !== 0){
                        $(document).on("mousemove",function(e){//如果对象是note，移动太快会脱落；
                            var ev=e||window.event;
                            var cx=ev.clientX;//距浏览器窗口的距离
                            var cy=ev.clientY;
                            var left=cx-ox;//盒子距浏览器窗口的距离
                            var top=cy-oy-50;
                            if(left<=0){//最小到达0
                                left=0;
                            }
                            if(top<=0){
                                top=0;
                            }
                            if(left>=width-element.innerWidth()){//最大到达的距离
                                left=width-element.innerWidth();
                            }
                            if(top>=height-element.innerHeight()){
                                top=height-element.innerHeight();
                            }
                            //$(that).css({left:l+"px",top:t+"px"})
                            scope.$apply(function () {
                                scope.position.left=left;
                                scope.position.top=top;
                            })
                        })
                        $(document).on("mouseup",function(){
                            $(document).off("mousemove");//鼠标弹起时移动事件移除；
                        })
                    }
                })
            }
        }
    }])

