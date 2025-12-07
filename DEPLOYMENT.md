# 🚀 GitHub Pages 部署指南

本文档详细说明如何将苏格兰文学地图部署到 GitHub Pages，以便创建可分享的在线链接。

---

## 📋 部署前准备

### 1. 必需文件清单 ✅

确保以下文件存在于项目目录中：

#### 核心文件（必需）
- ✅ `literary-map.html` - 主页面
- ✅ `literary-styles.css` - 样式文件
- ✅ `literary-app.js` - JavaScript 逻辑

#### 数据文件（必需）
- ✅ `documents_genre.csv` (113 KB)
- ✅ `locations.csv` (85 KB)
- ✅ `locationmentions.csv` (1.6 MB)
- ⚠️ `sentences.csv` (21 MB) - 可选，但文件较大

#### 文档文件（推荐）
- ✅ `README-GITHUB.md` - GitHub 说明文档
- ✅ `LITERARY_MAP_GUIDE.md` - 使用指南
- ✅ `DATA_SOURCES.md` - 数据说明
- ✅ `.gitignore` - Git 忽略文件

### 2. 不需要上传的文件

以下文件仅用于本地开发，不需要上传：
- ❌ `启动服务器.bat`
- ❌ `启动说明.html`
- ❌ `如何运行.md`
- ❌ `解决CORS错误.md`
- ❌ `index-advanced.html` (其他版本)
- ❌ `test-data.html` (测试文件)

---

## 🔧 步骤 1: 初始化 Git 仓库

### 1.1 如果还没有 Git 仓库

```bash
# 进入项目目录
cd "c:\Users\suxin\Desktop\Litlong"

# 初始化 Git
git init

# 添加所有必需文件
git add literary-map.html literary-styles.css literary-app.js
git add documents_genre.csv locations.csv locationmentions.csv
git add README-GITHUB.md LITERARY_MAP_GUIDE.md DATA_SOURCES.md
git add .gitignore

# 创建初始提交
git commit -m "Initial commit: Scottish Literary Map v3.0"
```

### 1.2 如果已有 Git 仓库

```bash
# 确保在项目目录
cd "c:\Users\suxin\Desktop\Litlong"

# 查看状态
git status

# 添加更改
git add .
git commit -m "Update literary map for GitHub Pages"
```

---

## 🌐 步骤 2: 创建 GitHub 仓库

### 2.1 在 GitHub 网站创建新仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 `+` → `New repository`
3. 填写仓库信息：
   - **Repository name**: `scottish-literary-map` (或其他名称)
   - **Description**: `Interactive map of 19th century Scottish literature locations`
   - **Public** (选择 Public 以使用 GitHub Pages)
   - ⚠️ **不要**勾选 "Add a README file"（我们已经有了）
4. 点击 `Create repository`

### 2.2 连接本地仓库到 GitHub

GitHub 会显示命令，复制并在命令行中执行：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/scottish-literary-map.git

# 推送代码
git branch -M main
git push -u origin main
```

---

## 📤 步骤 3: 推送代码到 GitHub

```bash
# 确保所有文件已提交
git status

# 如有未提交的更改
git add .
git commit -m "Prepare for GitHub Pages deployment"

# 推送到 GitHub
git push origin main
```

---

## 🎯 步骤 4: 启用 GitHub Pages

### 4.1 配置 GitHub Pages

1. 在 GitHub 仓库页面，点击 **Settings** (设置)
2. 在左侧菜单找到 **Pages**
3. 在 **Source** 下方：
   - **Branch**: 选择 `main`
   - **Folder**: 选择 `/ (root)`
4. 点击 **Save**

### 4.2 等待部署

- GitHub 会自动部署，通常需要 **1-3 分钟**
- 页面顶部会显示：
  ```
  ✅ Your site is published at https://YOUR_USERNAME.github.io/REPO_NAME/
  ```

---

## 🔗 步骤 5: 访问您的网站

### 5.1 GitHub Pages 链接

您的网站地址格式为：
```
https://YOUR_USERNAME.github.io/REPO_NAME/literary-map.html
```

例如：
```
https://suxin.github.io/scottish-literary-map/literary-map.html
```

### 5.2 测试网站

1. 复制上面的链接
2. 在浏览器中打开
3. 检查：
   - ✅ 页面正常显示
   - ✅ 地图可以加载
   - ✅ 数据可以正常显示
   - ✅ 没有 CORS 错误

---

## 📝 步骤 6: 更新 README

### 6.1 替换占位符

在 `README-GITHUB.md` 中，将以下占位符替换为实际值：

- `YOUR_USERNAME` → 您的 GitHub 用户名
- `YOUR_REPO_NAME` → 您的仓库名称

### 6.2 重命名 README

```bash
# 将 README-GITHUB.md 重命名为 README.md（覆盖旧的）
mv README-GITHUB.md README.md

# 提交更改
git add README.md
git commit -m "Update README with GitHub Pages link"
git push origin main
```

---

## 🎨 可选：自定义设置

### 创建自定义首页

如果希望访问根目录就能看到地图，创建 `index.html`：

```bash
# 复制 literary-map.html 为 index.html
cp literary-map.html index.html

# 提交
git add index.html
git commit -m "Add index.html as default page"
git push origin main
```

现在可以直接访问：
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

### 添加自定义域名

1. 在仓库根目录创建 `CNAME` 文件：
```bash
echo "your-domain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push origin main
```

2. 在域名注册商处添加 DNS 记录：
   - 类型: `CNAME`
   - 名称: `www` 或 `@`
   - 值: `YOUR_USERNAME.github.io`

---

## ⚠️ 常见问题

### Q1: 页面显示 404 错误

**原因**: GitHub Pages 可能还在部署中

**解决**:
- 等待 3-5 分钟
- 检查 Settings → Pages 是否显示"已发布"
- 确保访问的 URL 正确

### Q2: 页面显示但数据不加载

**原因**: CSV 文件路径问题或文件未上传

**解决**:
```bash
# 检查 CSV 文件是否存在
git ls-files | grep csv

# 如果没有，重新添加
git add *.csv
git commit -m "Add CSV data files"
git push origin main
```

### Q3: 地图不显示

**原因**: Leaflet.js 或其他 CDN 资源加载失败

**解决**:
- 检查网络连接
- 打开浏览器开发者工具（F12）查看错误
- 确认 `literary-map.html` 中的 CDN 链接正确

### Q4: sentences.csv 文件太大无法上传

**原因**: GitHub 单文件限制 100MB，Git 推荐 50MB 以下

**解决方案 A**: 使用 Git LFS（大文件存储）
```bash
# 安装 Git LFS
git lfs install

# 追踪大文件
git lfs track "sentences.csv"
git add .gitattributes
git add sentences.csv
git commit -m "Add sentences.csv with LFS"
git push origin main
```

**解决方案 B**: 不上传 sentences.csv
- 在 `.gitignore` 中添加 `sentences.csv`
- 应用会继续工作，只是没有完整句子预览

---

## 📊 部署检查清单

部署完成后，检查以下项目：

- [ ] GitHub Pages 显示"已发布"状态
- [ ] 网站可以正常访问
- [ ] 首页显示两个功能卡片
- [ ] 地图可以加载并显示标记
- [ ] 点击标记显示弹窗
- [ ] 书架可以正常显示
- [ ] 点击书籍可以打开阅读器
- [ ] 游客/学者模式可以切换
- [ ] 浏览器控制台（F12）无错误

---

## 🔄 后续更新

### 更新内容

```bash
# 修改文件后
git add .
git commit -m "Update: description of changes"
git push origin main
```

### 查看部署状态

在 GitHub 仓库页面：
- 点击 **Actions** 标签
- 查看最新的 "pages build and deployment" 工作流
- 绿色勾号 ✅ = 部署成功

---

## 📱 分享链接

### 完整链接

```
https://YOUR_USERNAME.github.io/REPO_NAME/literary-map.html
```

### 短链接（可选）

使用服务如 [bit.ly](https://bitly.com/) 或 [tinyurl.com](https://tinyurl.com/) 创建短链接。

### 社交媒体分享

在 `literary-map.html` 的 `<head>` 部分添加 Open Graph 标签（可选）：

```html
<!-- Open Graph / 社交媒体分享 -->
<meta property="og:title" content="苏格兰文学地图" />
<meta property="og:description" content="探索19世纪苏格兰文学作品中的地理世界" />
<meta property="og:image" content="https://YOUR_USERNAME.github.io/REPO_NAME/preview.png" />
<meta property="og:url" content="https://YOUR_USERNAME.github.io/REPO_NAME/" />
```

---

## 🎉 完成！

您的苏格兰文学地图现已成功部署到 GitHub Pages！

**分享链接**:
```
https://YOUR_USERNAME.github.io/REPO_NAME/literary-map.html
```

---

## 📞 获取帮助

如遇问题：
1. 检查本文档的"常见问题"部分
2. 查看 GitHub Pages 官方文档: https://pages.github.com/
3. 在仓库中提交 Issue

---

**部署日期**: 2025-12-07
**版本**: 3.0 (Literary Edition)
**状态**: ✅ 准备就绪
