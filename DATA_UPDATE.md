# 📊 数据源更新说明

## 🎉 已切换到合并数据源

**更新时间**: 2025-12-07

---

## ✅ 新数据源

### 主文件
- **文件名**: `mergedLitlong_forgenre.csv`
- **大小**: 3.8 MB
- **记录数**: 约 28,000+ 条

### 数据结构

| 字段 | 说明 | 示例 |
|------|------|------|
| `id` | 记录唯一ID | 183 |
| `text_x` | 地点提及文本 | Old Town |
| `document_id` | 文档ID | 1 |
| `location_id` | 地点ID | 90 |
| `text` | 地点标准名称 | Old Town |
| `lat` | 纬度 | 55.9471293 |
| `lon` | 经度 | -3.2002511 |
| `title` | 作品标题 | Varieties in Prose, vol. 2 |
| `forename` | 作者名 | William |
| `surname` | 作者姓 | Allingham |
| `pubyear` | 出版年份 | 1893-01-01 |
| `gender` | 作者性别 | m |
| `genre` | 文学类型 | travel, history |

---

## 🔄 与之前的区别

### 之前使用 4 个独立文件：
1. `documents_genre.csv` (113 KB) - 文档信息
2. `locations.csv` (85 KB) - 地点坐标
3. `locationmentions.csv` (1.6 MB) - 地点提及
4. `sentences.csv` (21 MB) - 句子文本 *(可选)*

### 现在使用 1 个合并文件：
- `mergedLitlong_forgenre.csv` (3.8 MB) - **包含所有信息**

---

## 📈 优势

### 1. **简化数据加载**
- 只需加载一个 CSV 文件
- 减少网络请求次数（从 3-4 个减少到 1 个）
- 更快的初始加载速度

### 2. **数据一致性**
- 所有数据已预先关联
- 避免数据不匹配问题
- 更容易维护和更新

### 3. **完整的类型信息**
- 每个地点提及都包含完整的作品和作者信息
- 每行记录都包含 `genre` 字段
- 支持多类型作品（一个作品可以有多个 genre）

### 4. **更小的总体积**
- 合并文件: 3.8 MB
- 原始文件总和: 1.9 MB + 21 MB sentences.csv
- 不包含 sentences.csv，只有核心数据

---

## 🛠️ 代码更新

### literary-app.js 主要变化

#### 之前：
```javascript
// 加载 3 个独立文件
await fetch('documents_genre.csv');
await fetch('locations.csv');
await fetch('locationmentions.csv');

// 手动关联数据
calculateLocationStats();
```

#### 现在：
```javascript
// 只加载 1 个合并文件
const mergedData = await fetch('mergedLitlong_forgenre.csv');

// 直接提取所需信息
// 文档按 document_id 分组
// 地点按 location_id 分组
// 统计在数据处理时自动完成
```

---

## 📊 数据提取逻辑

### 1. 文档提取
```javascript
// 按 document_id 分组
// 合并同一作品的多个 genre
const docsMap = {};
mergedData.forEach(row => {
    if (!docsMap[row.document_id]) {
        docsMap[row.document_id] = {
            document_id, title, forename, surname, pubyear, gender,
            genres: []
        };
    }
    docsMap[row.document_id].genres.push(row.genre);
});
```

### 2. 地点提取
```javascript
// 按 location_id 分组
// 统计提及次数和相关文档数
const locsMap = {};
mergedData.forEach(row => {
    if (!locsMap[row.location_id]) {
        locsMap[row.location_id] = {
            id, text, lat, lon,
            mentions: []
        };
    }
    locsMap[row.location_id].mentions.push({
        id: row.id,
        text_x: row.text_x,
        document_id: row.document_id
    });
});

// 添加统计信息
mentionCount = mentions.length;
documentCount = uniqueDocs.size;
```

---

## 🎯 功能影响

### ✅ 保持不变的功能
- 地图显示所有地点标记
- 三级颜色编码（高/中/低频）
- 作者筛选
- 年份筛选
- 类型筛选
- 虚拟书架
- 翻页阅读器
- 游客/学者模式切换

### 🆕 改进的功能
- **更快的加载速度** - 单文件请求
- **更准确的统计** - 直接从合并数据计算
- **更好的类型支持** - 每个提及都有 genre 信息

---

## 🔍 数据验证

### 验证合并数据正确性

打开浏览器控制台（F12），查看加载日志：

```
✓ 加载 28000+ 条合并数据记录
✓ 提取 200+ 个文档
✓ 提取 1500+ 个地点
✓ 最多提及: Edinburgh (XXX次)
```

### 检查数据完整性

1. **文档数量**: 应该与原 documents_genre.csv 一致（200+）
2. **地点数量**: 应该与原 locations.csv 一致（1500+）
3. **提及统计**: 地图标记数量和颜色应正确显示

---

## 📁 文件清理建议

### 可以删除的文件（已不再使用）
- `documents_genre.csv`
- `locations.csv`
- `locationmentions.csv`
- `sentences.csv` (如果已上传)

### 保留的文件
- ✅ `mergedLitlong_forgenre.csv` - **新的主数据源**
- ✅ `literary-map.html` - 主页面
- ✅ `literary-styles.css` - 样式
- ✅ `literary-app.js` - 逻辑（已更新）
- ✅ 所有文档 (.md 文件)

---

## 🚀 部署状态

- ✅ 代码已更新到 GitHub
- ✅ 合并数据文件已上传
- ✅ GitHub Pages 会自动重新部署
- ⏳ 等待 1-2 分钟后访问更新的网站

---

## 🔗 访问更新后的网站

```
https://xin40445-maker.github.io/Litlong/
```

---

## 💡 技术说明

### CSV 解析
- 使用相同的 `parseCSV()` 函数
- 支持引号包裹的字段
- 处理逗号分隔符

### 性能优化
- 数据在客户端一次性加载
- 使用 Map 对象快速分组
- 避免重复计算

### 兼容性
- 所有现有功能完全兼容
- 无需修改 HTML 或 CSS
- 只更新了 JavaScript 数据加载部分

---

**更新完成**: ✅
**测试状态**: 待验证
**版本**: 3.1 (Merged Data Source)

---

<div align="center">
  <strong>🎉 数据源升级成功！</strong>
</div>
