# 📚 苏格兰文学地图 | Scottish Literary Map

[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with](https://img.shields.io/badge/built%20with-Vanilla%20JS-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> 在阅读中旅行 - 探索19世纪苏格兰文学作品中的地理世界

一个交互式的文学地理可视化平台，采用复古文学风格设计，展示19世纪苏格兰文学作品中提及的地点和历史信息。

🌐 **在线演示**: [https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/](https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/)

---

## ✨ 主要特色

### 🎨 复古文学设计
- **羊皮纸质感** - 仿19世纪古籍的视觉效果
- **复古字体** - Playfair Display, EB Garamond, Crimson Text
- **手绘地图元素** - 装饰边框、花纹和图标
- **3D书籍效果** - 立体书脊和翻页动画

### 🗺️ 交互式地图
- **1,500+ 文学地点** - 标记在苏格兰地图上
- **三级颜色区分** - 根据提及频率显示：
  - 🔴 **高频** (50+次) - 酒红色
  - 🟤 **中频** (10-49次) - 棕褐色
  - 🟢 **低频** (1-9次) - 森林绿
- **详细弹窗** - 显示地点名称、提及次数、相关作品

### 📖 虚拟书架
- **200+ 文学作品** - 19世纪苏格兰经典
- **3D木质书架** - 逼真的书架视觉效果
- **翻页阅读器** - 双页展示，配有翻书音效
- **地点高亮** - 书中地点自动高亮并可跳转

### 🎓 双模式系统
- **游客模式** - 简洁直观，适合普通用户
- **学者模式** - 数据分析、学术引用、数据导出

---

## 📊 数据概览

- 📚 **文学作品**: 200+ 部
- ✍️ **作者**: 100+ 位
- 📍 **地点**: 1,500+ 个
- 💬 **地点提及**: 40,000+ 次
- 📅 **时间跨度**: 1850-1900年

---

## 🚀 快速开始

### 在线访问

直接访问 GitHub Pages 部署版本：
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/literary-map.html
```

### 本地运行

1. **克隆仓库**
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

2. **启动本地服务器**

使用 Python:
```bash
python -m http.server 8000
```

或使用 Node.js:
```bash
npx http-server
```

3. **访问页面**
```
http://localhost:8000/literary-map.html
```

⚠️ **重要**: 由于 CORS 限制，必须通过本地服务器访问，不能直接双击打开 HTML 文件。

---

## 📁 项目结构

```
Litlong/
├── literary-map.html          # 主页面
├── literary-styles.css        # 复古样式
├── literary-app.js            # 核心逻辑
├── documents_genre.csv        # 文学作品数据 (113 KB)
├── locations.csv              # 地点坐标 (85 KB)
├── locationmentions.csv       # 地点提及 (1.6 MB)
├── sentences.csv              # 句子文本 (21 MB) *可选
├── LITERARY_MAP_GUIDE.md      # 使用指南
├── DATA_SOURCES.md            # 数据说明
└── README-GITHUB.md           # 本文件
```

---

## 🛠️ 技术栈

### 前端技术
- **HTML5** - 语义化结构
- **CSS3** - Grid, Flexbox, 动画
- **Vanilla JavaScript** - 无框架，纯原生 JS

### 第三方库 (CDN)
- **Leaflet.js 1.9.4** - 地图可视化
- **Leaflet.markercluster** - 标记聚合
- **Chart.js 4.4.0** - 数据图表
- **Font Awesome 6.4.0** - 图标
- **Google Fonts** - 复古字体

### 数据处理
- CSV 解析 (自定义解析器)
- 客户端数据聚合和统计
- 实时筛选和搜索

---

## 🎯 主要功能

### 首页
- ✨ 复古视觉设计
- 📖 两大核心功能卡片
- 📊 实时统计数据

### 地图页面
- 🗺️ 交互式苏格兰地图
- 🎨 颜色编码的地点标记
- 🔍 多维度筛选（作者、年代、类型）
- 📍 地点搜索功能

### 书架页面
- 📚 3D木质书架展示
- ⏰ 时间线视图
- 📖 沉浸式阅读器
- 🔆 地点高亮功能

### 学者模式
- 📊 数据可视化图表
- 📝 学术引用生成
- 💾 数据导出 (CSV, Excel, PDF)

---

## 📖 使用说明

### 基本操作

1. **浏览地图**
   - 点击地图标记查看地点详情
   - 使用鼠标滚轮缩放
   - 拖动地图导航

2. **筛选作品**
   - 选择作者（下拉或搜索）
   - 设置年份范围（滑块或输入）
   - 选择文学类型标签

3. **阅读书籍**
   - 点击书架上的书籍
   - 使用翻页按钮阅读
   - 点击高亮地点跳转到地图

4. **切换模式**
   - 右上角点击"游客模式"或"学者模式"
   - 学者模式显示更多数据和工具

### 详细指南

查看 [LITERARY_MAP_GUIDE.md](LITERARY_MAP_GUIDE.md) 获取完整使用说明。

---

## 🌐 GitHub Pages 部署

### 自动部署（推荐）

1. **推送到 GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **启用 GitHub Pages**
   - 进入仓库的 Settings
   - 找到 "Pages" 部分
   - Source 选择 `main` 分支
   - 点击 Save

3. **等待部署完成**
   - 几分钟后访问: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/literary-map.html`

### 自定义域名

如果您有自己的域名：

1. 在仓库根目录创建 `CNAME` 文件
2. 写入您的域名: `your-domain.com`
3. 在域名注册商处添加 DNS 记录

---

## 📝 数据来源

本项目使用的数据来自苏格兰文学作品数据集，包含：

- **documents_genre.csv** - 文学作品元数据
- **locations.csv** - 地点地理坐标
- **locationmentions.csv** - 作品中的地点提及
- **sentences.csv** - 完整句子文本（可选）

详细数据结构说明见 [DATA_SOURCES.md](DATA_SOURCES.md)

---

## 🤝 贡献

欢迎贡献！如果您想改进此项目：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

- **地图数据**: © [OpenStreetMap](https://www.openstreetmap.org/) contributors
- **地图库**: [Leaflet.js](https://leafletjs.com/)
- **数据可视化**: [Chart.js](https://www.chartjs.org/)
- **图标**: [Font Awesome](https://fontawesome.com/)
- **字体**: [Google Fonts](https://fonts.google.com/)

---

## 📞 联系方式

如有问题或建议，请：
- 提交 [Issue](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/issues)
- 发起 [Discussion](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/discussions)

---

## 🌟 展示

如果您喜欢这个项目，请给个 Star ⭐️

---

**创建时间**: 2025-12-07
**版本**: 3.0 (Literary Edition)
**状态**: ✅ 已完成，可使用

---

<div align="center">
  <strong>📚 在阅读中旅行 | Travel Through Literature 🏴󠁧󠁢󠁳󠁣󠁴󠁿</strong>
</div>
