#  vue_backstage_system
## 数据库的导入
```
MySQL的数据在vue_api_server/db/mydb.sql，下载最新版的phpStudy，安装好后启动好mysql。然后去导航栏的数据库，点+号的创建数据库，输入数据库名称mydb以及用户名和密码，点确认会创建新的一栏任务，在操作里点导入，等待一会儿等任务里提示完成，这里直接看这个导入的界面就行。然后最重要的一步来了，去素材里的\vue_api_server\config，把default.json里的"user": "root", "password": "root",改成你在phpstudy_por创建数据库的用户名和密码，点保存后去运行一下node ./app.js （记得先npm install 一下）。如果不改密码和用户名，postman是接口测试是失败的。

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
