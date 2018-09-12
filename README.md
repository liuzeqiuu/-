# 预售商城

### 知识库

- 👉[产品原型](https://ha06bb.axshare.com)
- 👉[UI pc端](https://lanhuapp.com/url/oT7tc)
- 👉[UI 手机端](https://lanhuapp.com/url/DEdqW) 
- 👉[项目管理](https://jira.33.cn/projects/PRESALE/summary)
- 👉[项目文档空间](https://confluence.33.cn/pages/viewpage.action?pageId=5964099)
- [pc测试用例](https://www.icloud.com/numbers/0c8aYYnEW_Op7W76fKuMSnLKQ) [其它测试用例](https://www.icloud.com/numbers/04kmWJQZKUjbyPcIcrQSiO8zg) 密码 fzm
- [阿里云图片服务](https://confluence.33.cn/pages/viewpage.action?pageId=5966418)

### 目录说明

```bash
|- webapp 源代码
|- presell.sql 数据库设计
|- deploy2TestServer.sh 部署到测试服的脚本
```

### 部署相关


* 推荐开发使用[yarn](https://yarnpkg.com/en/docs/install#windows-stable),npm部署也是可以的

安装依赖

```bash
cd webapp && yarn install
```

* cypress 是一个e2e测试工具，打生产包非必需

请在webapp下开始打包

```bash
cd webapp && yarn build
```

##### 部署目标👇

```bash
mall.bityuan.com
|- index.html
|- static
|- ...一些静态页面
|- mp
	|- index.html
	|- static
	|- ... 一些静态页面
```

- 首页 mall.bityuan.com
- 管理后台 mall.bityuan.com/mp

联系我们页面中的百度地图的密钥为个人申请，且创建的应用中的Referer白名单未配置，ak可能会泄露，仅供上线前的测试使用
