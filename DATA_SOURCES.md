# 📊 苏格兰文学旅游项目 - 数据源说明

## 数据文件清单

### 1. **documents_genre.csv** (112 KB)
主要的文学作品数据文件

**字段结构：**
- `document_id` - 文档唯一标识符
- `title` - 作品标题
- `forename` - 作者名
- `surname` - 作者姓
- `pubyear` - 出版年份（YYYY-MM-DD 格式）
- `gender` - 作者性别（m/f/u）
- `genre` - 文学类型

**数据特点：**
- 同一文档可能有多行记录（对应不同的文学类型）
- 年份范围：约 1850-1900
- 包含旅游、历史、小说、浪漫等多种文学类型

**使用位置：**
- ✅ 主页面作品列表展示
- ✅ 作者筛选功能
- ✅ 年份筛选功能
- ✅ 类型筛选功能
- ✅ 统计面板数据

**加载方式：**
```javascript
// app.js 中
const response = await fetch('documents_genre.csv');
const csvText = await response.text();
allData = parseCSV(csvText);
```

---

### 2. **locations.csv** (83 KB)
地理位置坐标数据

**字段结构：**
- `id` - 地点唯一标识符
- `text` - 地点名称
- `lat` - 纬度
- `lon` - 经度

**数据特点：**
- 主要为苏格兰地区的地点
- 包含爱丁堡、格拉斯哥等主要城市的详细地标
- 坐标精确到小数点后7位

**示例数据：**
```csv
id,text,lat,lon
90,Old Town,55.9471293,-3.2002511
91,Edinburgh,55.949428,-3.192704
184,Musselburgh,55.9421202,-3.0538516
```

**使用位置：**
- ✅ 地图标记点位置
- ✅ 地图弹窗显示地点名称
- ✅ 地理坐标绘制

**加载方式：**
```javascript
// map.js 中
const locationsResponse = await fetch('locations.csv');
const locationsText = await locationsResponse.text();
const locations = parseCSV(locationsText);
```

---

### 3. **locationmentions.csv** (1.6 MB)
文学作品中的地点提及记录

**字段结构：**
- `id` - 提及记录唯一标识符
- `text` - 提及的地点文本
- `document_id` - 对应的文档 ID（关联 documents_genre.csv）
- `location_id` - 对应的地点 ID（关联 locations.csv）
- `sentence_id` - 对应的句子 ID（关联 sentences.csv）

**数据特点：**
- 记录了文学作品中每一次提及地点的情况
- 同一地点可能被多个文档多次提及
- 用于统计地点的提及频率

**示例数据：**
```csv
id,text,document_id,location_id,sentence_id
183,Old Town,1,90,183
184,Edinburgh,1,91,184
227,Old Town,1,90,227
```

**数据关联：**
- `document_id` → documents_genre.csv
- `location_id` → locations.csv
- `sentence_id` → sentences.csv

**使用位置：**
- ✅ 计算地点提及次数
- ✅ 地图标记颜色深浅（提及次数越多颜色越深）
- ✅ 地图标记大小（提及次数越多标记越大）
- ✅ 统计相关文档数量

**加载方式：**
```javascript
// map.js 中
const mentionsResponse = await fetch('locationmentions.csv');
const mentionsText = await mentionsResponse.text();
const mentions = parseCSV(mentionsText);

// 统计提及次数
mentions.forEach(mention => {
    const locId = mention.location_id;
    locationMentions[locId] = locationMentions[locId] || { count: 0 };
    locationMentions[locId].count++;
});
```

---

### 4. **sentences.csv** (21 MB) ⚠️
句子完整文本数据（最大的文件）

**字段结构：**
- `id` - 句子唯一标识符
- `identifier` - 句子标识符（可能为空）
- `text` - 完整句子文本

**数据特点：**
- 包含提及地点的完整句子上下文
- 文件较大（21 MB），包含大量文本
- 提供文学作品的原文引用

**示例数据：**
```csv
id,identifier,text
183,,"Sloping up a long ridge it recalls here and there the famous Old Town of Edinburgh..."
```

**使用位置：**
- ✅ 地图弹窗中显示提及示例
- ✅ 提供文学作品原文上下文
- （可选）搜索功能、文本分析

**注意事项：**
- ⚠️ 文件较大，加载可能需要时间
- 建议按需加载，不是所有功能都需要
- 当前实现中主要用于地图弹窗展示

**加载方式：**
```javascript
// 如果需要完整句子数据
const sentencesResponse = await fetch('sentences.csv');
const sentencesText = await sentencesResponse.text();
const sentences = parseCSV(sentencesText);
```

---

## 数据关联关系

```
documents_genre.csv
    ↓ (document_id)
locationmentions.csv ← → locations.csv (location_id)
    ↓ (sentence_id)
sentences.csv
```

### 关联示例

1. **文档 ID 1** (documents_genre.csv)
   - 标题: "Varieties in Prose, vol. 2"
   - 作者: William Allingham
   - 年份: 1893

2. **提及记录** (locationmentions.csv)
   - 文档 1 提及地点 90 ("Old Town")
   - 文档 1 提及地点 91 ("Edinburgh")

3. **地点信息** (locations.csv)
   - 地点 90: Old Town (55.9471293, -3.2002511)
   - 地点 91: Edinburgh (55.949428, -3.192704)

4. **句子文本** (sentences.csv)
   - 句子 183: "Sloping up a long ridge it recalls here and there the famous Old Town of Edinburgh..."

---

## 当前系统使用情况

### ✅ 已实现功能

1. **documents_genre.csv**
   - 作品列表展示
   - 作者、年份、类型筛选
   - 统计面板

2. **locations.csv + locationmentions.csv**
   - 地图标记绘制
   - 提及次数统计
   - 标记颜色/大小动态调整

3. **部分 sentences.csv**
   - 地图弹窗中显示提及示例（前3个）

### 🔄 可优化功能

1. **sentences.csv 优化加载**
   - 按需加载特定句子
   - 不必一次性加载全部 21 MB 数据
   - 可以通过 sentence_id 建立索引

2. **数据缓存**
   - 使用 localStorage 缓存已加载数据
   - 减少重复请求

3. **数据预处理**
   - 预先统计提及频率
   - 生成汇总 JSON 文件
   - 减少客户端计算负担

---

## 数据验证测试

已创建测试页面：**test-data.html**

### 使用方法

1. 在浏览器中打开 `test-data.html`
2. 自动加载并验证所有四个数据文件
3. 显示加载状态和数据统计
4. 可查看数据样例

### 测试内容

- ✅ 文件是否可访问
- ✅ CSV 解析是否正确
- ✅ 数据字段完整性
- ✅ 数据量统计
- ✅ 数据关联验证

---

## 文件大小对比

| 文件名 | 大小 | 记录数（约） | 加载时间 |
|--------|------|------------|----------|
| documents_genre.csv | 112 KB | ~1,000 | 快速 |
| locations.csv | 83 KB | ~1,500 | 快速 |
| locationmentions.csv | 1.6 MB | ~40,000 | 中等 |
| sentences.csv | 21 MB | ~20,000 | 较慢 ⚠️ |

---

## 性能优化建议

### 1. 按需加载 sentences.csv
```javascript
// 只在需要时加载特定句子
async function getSentence(sentenceId) {
    // 使用后端 API 或预处理数据
    return await fetch(`/api/sentence/${sentenceId}`);
}
```

### 2. 预处理地点统计
创建一个汇总文件 `location_stats.json`：
```json
{
    "90": {
        "name": "Old Town",
        "lat": 55.9471293,
        "lon": -3.2002511,
        "mention_count": 15,
        "document_count": 8
    }
}
```

### 3. 使用 IndexedDB
```javascript
// 将大文件存储在 IndexedDB 中
// 避免每次重新下载
```

---

## 数据来源与版权

- **数据集**: 苏格兰文学作品地理数据
- **时期**: 19世纪（约1850-1900年）
- **地区**: 苏格兰及相关地区
- **用途**: 学术研究和教育展示

---

**最后更新**: 2025-11-30
**项目位置**: c:\Users\suxin\Desktop\Litlong\
**测试页面**: test-data.html
