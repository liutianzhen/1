# GitHub Pages 部署指南

本文档提供在GitHub Pages上部署图片压缩工具的详细步骤。

## 部署步骤

### 1. 确认仓库结构

确保您的仓库结构如下：

```
1/
├── index.html
├── _config.yml
├── css/
│   └── style.css
└── js/
    └── app.js
```

### 2. 配置GitHub Pages

1. 登录您的GitHub账号
2. 进入"1"仓库
3. 点击"Settings"（设置）选项卡
4. 在左侧导航栏中，找到并点击"Pages"
5. 在"Source"（源）部分，选择您的分支（通常是"main"或"master"）
6. 点击"Save"（保存）按钮

### 3. 等待部署

GitHub Pages可能需要几分钟来构建和部署您的网站。部署完成后，您应该会看到一条消息，显示您的网站URL，通常是：
```
https://liutianzhen.github.io/1/
```

### 4. 访问应用

完整的访问URL应该是：
```
https://liutianzhen.github.io/1/
```

### 5. 自定义域名（可选）

如果您想使用自己的域名：

1. 在GitHub Pages设置中，输入您的自定义域名
2. 在您的DNS提供商处，添加一个CNAME记录，指向`liutianzhen.github.io`
3. 等待DNS传播（通常需要24-48小时）

### 排错指南

如果网站不能正确显示：

1. **404错误**：确认您的仓库名称和URL路径是否正确
2. **资源加载失败**：检查网页控制台，看是否有路径错误
3. **样式丢失**：确认CSS文件路径是否正确
4. **功能异常**：检查JavaScript文件路径是否正确

## 本地测试

在推送到GitHub之前，您可以通过以下方法在本地测试：

```bash
# 使用Python的简易HTTP服务器
cd 1
python -m http.server

# 然后在浏览器中访问
# http://localhost:8000/
```

## 更新网站

每次您推送更改到GitHub仓库，GitHub Pages将自动重新构建和部署您的网站。无需手动操作。 