/*代码不会发到浏览器运行,在命令行运行node server.js 操作系统*/
var express=require('express');//引入别的js，用express服务器
var app=express();
var mysql=require('mysql');         //引入mysql
//运行npm install body-parser 用于接收Post数据
var bodyParser = require('body-parser');
var pinyin = require("pinyin");
app.listen(3000);//端口号（监听）默认80
////////////打开界面///////////////////////////////
app.use(express.static(__dirname+"/www"));
app.get('/', function (request,response) {
    response.sendFile(__dirname+'/www/index.html');
});
////////////连接数据库/////////////////
var pool  = mysql.createPool({       //创建pool，连接数据库
    connectionLimit : 100,
    host             : 'localhost',
    user             : 'root',
    password        : '',
    database        : 'work'
})
//查询数据
app.get('/contact', function (request,response) {
    pool.getConnection(function(err, connection) {      //无错就连接
        var sql = 'select * from contact';
        connection.query(sql, function (error, results, fields) {
            response.json(results);         //回复
        });
    });
});
////////////////////处理post请求///////////////////
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
/////////增加数据////////////////////////////////////////
app.post('/contact', function (request,response) {
    pool.getConnection(function(err, connection) {
        var sql = 'insert into contact (name) values(?)';
        connection.query(sql,[request.body.name] ,function (error, results, fields) {
            response.json(results.insertId);         //返回id
        });
    });
})
/////////修改数据/////////////////////
app.put('/contact', function (request,response) {
    pool.getConnection(function(err, connection) {
        if(request.body.key == "name"){
            var py=pinyin(request.body.value,{
                style:pinyin.STYLE_NORMAL,
                heteronym: true
            }).join(" ");
            var sql = 'update contact set name = ?,pinyin=? where id=? ';//键用?? 值用?
            connection.query(sql,[request.body.value,py,request.body.id] ,function (error, results, fields) {
                response.json("ok");
            });
        }else if(request.body.key == "phone"){
            var sql = 'update contact set phone = ? where id=? ';//键用?? 值用?
            connection.query(sql,[request.body.value,request.body.id] ,function (error, results, fields) {
                response.json("ok");
            });
        }
    });
})
//////////批量删除////////////////////////
app.post('/deleteContact', function (request,response) {
    var ids=JSON.parse(request.body.ids).join(',');
    pool.getConnection(function(err, connection) {
        var sql = `delete from contact where id in (${ids})`
        connection.query(sql ,function (error, results, fields) {
            response.json("ok");
        });
    });
})