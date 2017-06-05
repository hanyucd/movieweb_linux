var express = require('express');
var config = require('./config/index');
// process：（全局对象）  Node所处的当前进程
var port = process.env.PORT || config.build.port;
var ip = '45.78.60.34';

// 创建 express 实例
var app = express();
// 创建 路由器实例
var router = express.Router();

router.get('/', function (req, res, next) {
	req.url = '/index.html';
	next();
});
// 注册中间件
app.use(router);
// 导入当前路径的 data.json
var appData = require('./data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;
// 创建 路由器实例
var apiRoutes = express.Router();

apiRoutes.get('/seller', function (req, res) {
	// 返回一个 JSON 数据对象
	res.json({
		errno: 0,
		data: seller
	});
});

apiRoutes.get('/goods', function (req, res) {
	res.json({
		errno: 0,
		data: goods
	});
});

apiRoutes.get('/ratings', function (req, res) {
	res.json({
		errno: 0,
		data: ratings
	});
});
// 注册中间件
app.use('/api', apiRoutes);

// 注册 静态文件中间件
app.use(express.static('./dist'));

module.exports = app.listen(port, ip, function (err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('Listening at http://' + ip + ':' + port + '\n');
});
