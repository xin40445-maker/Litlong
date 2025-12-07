# ✅ GitHub Pages 部署快速检查清单

## 📦 上传前检查

### 必需文件（✅ 必须上传）

#### HTML/CSS/JS 文件
- [ ] `literary-map.html` (15 KB) - 主页面
- [ ] `literary-styles.css` (24 KB) - 样式文件
- [ ] `literary-app.js` (23 KB) - JavaScript 逻辑

#### 数据文件
- [ ] `documents_genre.csv` (112 KB) - 文学作品数据
- [ ] `locations.csv` (83 KB) - 地点坐标
- [ ] `locationmentions.csv` (1.6 MB) - 地点提及记录
- [ ] `sentences.csv` (21 MB) - ⚠️ **可选**，文件较大

#### 文档文件
- [ ] `README-GITHUB.md` - GitHub 说明（部署后改名为 README.md）
- [ ] `LITERARY_MAP_GUIDE.md` - 使用指南
- [ ] `DATA_SOURCES.md` - 数据说明
- [ ] `DEPLOYMENT.md` - 部署文档
- [ ] `.gitignore` - Git 忽略配置

---

## 🚫 不需要上传的文件

这些文件仅用于本地开发：

- [ ] ❌ `启动服务器.bat`
- [ ] ❌ `启动说明.html`
- [ ] ❌ `如何运行.md`
- [ ] ❌ `解决CORS错误.md`
- [ ] ❌ `问题已解决.md`
- [ ] ❌ `index.html` (基础版)
- [ ] ❌ `index-advanced.html` (高级版)
- [ ] ❌ `index-start.html` (版本选择页)
- [ ] ❌ `test-data.html` (测试页)
- [ ] ❌ `app.js`, `map.js`, `styles.css` (基础版文件)
- [ ] ❌ `styles-advanced.css` (高级版样式)
- [ ] ❌ `START_HERE.md`, `PROJECT_SUMMARY.md`, `SKILLS_GUIDE.md` 等本地文档

---

## 🔧 部署步骤

### Step 1: Git 初始化

```bash
cd "c:\Users\suxin\Desktop\Litlong"
git init
```

### Step 2: 添加文件

```bash
# 添加核心文件
git add literary-map.html literary-styles.css literary-app.js

# 添加数据文件（除 sentences.csv）
git add documents_genre.csv locations.csv locationmentions.csv

# 添加文档
git add README-GITHUB.md LITERARY_MAP_GUIDE.md DATA_SOURCES.md DEPLOYMENT.md .gitignore

# 查看将要提交的文件
git status
```

**⚠️ sentences.csv 注意事项**:
- 文件大小 21MB，接近 GitHub 限制
- **方案 A**: 不上传（推荐，功能不受影响）
  ```bash
  # 已在 .gitignore 中忽略
  ```
- **方案 B**: 使用 Git LFS 上传
  ```bash
  git lfs install
  git lfs track "sentences.csv"
  git add .gitattributes sentences.csv
  ```

### Step 3: 创建初始提交

```bash
git commit -m "Initial commit: Scottish Literary Map v3.0"
```

### Step 4: 在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 仓库名称: `scottish-literary-map` (或自定义)
3. 设置为 **Public**
4. **不要**勾选 "Initialize with README"
5. 点击 "Create repository"

### Step 5: 连接并推送

```bash
# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/scottish-literary-map.git

# 推送代码
git branch -M main
git push -u origin main
```

### Step 6: 启用 GitHub Pages

1. 仓库页面 → **Settings**
2. 左侧菜单 → **Pages**
3. Source:
   - Branch: `main`
   - Folder: `/ (root)`
4. 点击 **Save**

### Step 7: 等待部署

- 等待 1-3 分钟
- 刷新页面，看到绿色提示：
  ```
  ✅ Your site is published at https://YOUR_USERNAME.github.io/scottish-literary-map/
  ```

### Step 8: 更新 README

```bash
# 编辑 README-GITHUB.md，替换：
# YOUR_USERNAME → 你的 GitHub 用户名
# YOUR_REPO_NAME → scottish-literary-map

# 重命名为 README.md
mv README-GITHUB.md README.md

# 提交并推送
git add README.md
git commit -m "Update README with deployment link"
git push origin main
```

---

## 🔗 访问链接

部署成功后，您的网站地址：

```
https://YOUR_USERNAME.github.io/scottish-literary-map/literary-map.html
```

例如（如果用户名是 suxin）：
```
https://suxin.github.io/scottish-literary-map/literary-map.html
```

---

## ✅ 部署验证

访问网站后，检查以下项目：

### 视觉检查
- [ ] 页面正常显示，有复古风格
- [ ] 首页显示两个功能卡片
- [ ] 顶部有模式切换按钮
- [ ] 装饰边框和花纹显示正常

### 功能检查
- [ ] 地图可以加载
- [ ] 地图上有彩色标记点
- [ ] 点击标记显示弹窗
- [ ] 弹窗显示地点信息
- [ ] 筛选面板可以打开
- [ ] 书架按钮可以点击
- [ ] 点击书籍打开阅读器
- [ ] 翻页按钮工作正常
- [ ] 游客/学者模式可以切换

### 技术检查
- [ ] 浏览器控制台（F12）无红色错误
- [ ] Network 标签显示所有 CSV 文件成功加载
- [ ] 字体正常显示（不是系统默认字体）
- [ ] 地图瓦片正常加载

---

## 🐛 常见问题快速修复

### 问题：404 页面未找到

**检查**:
```bash
# 确认文件已推送
git ls-files | grep literary-map.html

# 如果没有，重新添加
git add literary-map.html
git commit -m "Add main page"
git push origin main
```

### 问题：数据不加载

**检查**:
```bash
# 确认 CSV 文件已上传
git ls-files | grep csv

# 检查文件大小
git ls-files -s | grep csv
```

### 问题：地图不显示

**原因**: CDN 资源加载失败

**解决**: 检查网络连接，或稍后重试

---

## 📊 文件大小总览

| 文件类型 | 大小 | 上传建议 |
|---------|------|---------|
| HTML/CSS/JS | 62 KB | ✅ 必须上传 |
| documents_genre.csv | 112 KB | ✅ 必须上传 |
| locations.csv | 83 KB | ✅ 必须上传 |
| locationmentions.csv | 1.6 MB | ✅ 必须上传 |
| sentences.csv | 21 MB | ⚠️ 可选 |
| **总计（不含 sentences）** | **~1.9 MB** | ✅ 适合直接上传 |
| **总计（含 sentences）** | **~23 MB** | ⚠️ 需要 Git LFS |

---

## 🎯 快速命令汇总

```bash
# 完整部署流程（一键复制）
cd "c:\Users\suxin\Desktop\Litlong"

# 初始化
git init
git add literary-map.html literary-styles.css literary-app.js
git add documents_genre.csv locations.csv locationmentions.csv
git add README-GITHUB.md LITERARY_MAP_GUIDE.md DATA_SOURCES.md .gitignore
git commit -m "Initial commit: Scottish Literary Map v3.0"

# 连接 GitHub（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/scottish-literary-map.git
git branch -M main
git push -u origin main

# 然后在 GitHub 网站启用 Pages
```

---

## 📝 后续更新

每次修改后：

```bash
git add .
git commit -m "描述你的更改"
git push origin main
```

GitHub Pages 会自动重新部署（约 1-2 分钟）。

---

**检查清单版本**: 1.0
**最后更新**: 2025-12-07
**状态**: ✅ 准备就绪
