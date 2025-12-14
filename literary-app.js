// 苏格兰文学地图 - 完整应用逻辑

// ========== 全局数据存储 ==========
const AppData = {
    documents: [],
    locations: [],
    locationMentions: [],
    sentences: [],
    authors: new Set(),
    genres: new Set(),
    currentMode: 'tourist',
    currentPage: 'home',
    map: null,
    markers: [],
    markerClusters: null,
    currentBook: null,
    currentPageNum: 1,
    bookPages: []
};

// ========== CSV 解析工具 ==========
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const values = [];
        let currentValue = '';
        let insideQuotes = false;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                values.push(currentValue.trim().replace(/^"|"$/g, ''));
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        values.push(currentValue.trim().replace(/^"|"$/g, ''));

        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index];
            });
            data.push(row);
        }
    }

    return data;
}

// ========== 数据加载 ==========
async function loadAllData() {
    try {
        console.log('开始加载合并数据...');

        // 加载合并后的数据文件
        const mergedResponse = await fetch('mergedLitlong_forgenre.csv');
        if (!mergedResponse.ok) {
            throw new Error(`无法加载 mergedLitlong_forgenre.csv (状态: ${mergedResponse.status})`);
        }
        const mergedText = await mergedResponse.text();
        const mergedData = parseCSV(mergedText);

        console.log(`✓ 加载 ${mergedData.length} 条合并数据记录`);

        // 提取文档信息（按 document_id 分组）
        const docsMap = {};
        mergedData.forEach(row => {
            const docId = row.document_id;
            if (!docsMap[docId]) {
                docsMap[docId] = {
                    document_id: docId,
                    title: row.title,
                    forename: row.forename,
                    surname: row.surname,
                    pubyear: row.pubyear,
                    gender: row.gender,
                    genres: []
                };
                AppData.authors.add(`${row.forename} ${row.surname}`.trim());
            }
            // 添加类型（避免重复）
            if (row.genre && !docsMap[docId].genres.includes(row.genre)) {
                docsMap[docId].genres.push(row.genre);
                AppData.genres.add(row.genre);
            }
        });
        AppData.documents = Object.values(docsMap);
        console.log(`✓ 提取 ${AppData.documents.length} 个文档`);

        // 提取地点信息（按 location_id 分组）
        const locsMap = {};
        mergedData.forEach(row => {
            const locId = row.location_id;
            if (!locsMap[locId]) {
                locsMap[locId] = {
                    id: locId,
                    text: row.text,
                    lat: row.lat,
                    lon: row.lon,
                    mentions: []
                };
            }
            // 记录提及信息
            locsMap[locId].mentions.push({
                id: row.id,
                text_x: row.text_x,
                document_id: row.document_id
            });
        });

        // 转换为数组并添加统计信息
        AppData.locations = Object.values(locsMap).map(loc => {
            const uniqueDocs = new Set(loc.mentions.map(m => m.document_id));
            return {
                id: loc.id,
                text: loc.text,
                lat: loc.lat,
                lon: loc.lon,
                mentionCount: loc.mentions.length,
                documentCount: uniqueDocs.size,
                mentionTexts: loc.mentions.slice(0, 5).map(m => m.text_x)
            };
        }).filter(loc => loc.lat && loc.lon && !isNaN(parseFloat(loc.lat)));

        // 按提及次数排序
        AppData.locations.sort((a, b) => b.mentionCount - a.mentionCount);
        console.log(`✓ 提取 ${AppData.locations.length} 个地点`);
        console.log(`✓ 最多提及: ${AppData.locations[0]?.text} (${AppData.locations[0]?.mentionCount}次)`);

        // 保存原始合并数据用于其他功能
        AppData.mergedData = mergedData;

        // 初始化UI
        initializeApp();

    } catch (error) {
        console.error('数据加载失败:', error);

        // 提供更详细的错误信息
        let errorMessage = '数据加载失败！\n\n';

        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            errorMessage += '⚠️ 检测到CORS错误！\n\n';
            errorMessage += '请使用本地服务器运行此页面：\n\n';
            errorMessage += '方法1 (Python):\n';
            errorMessage += '  cd "c:\\Users\\suxin\\Desktop\\Litlong"\n';
            errorMessage += '  python -m http.server 8000\n';
            errorMessage += '  然后访问: http://localhost:8000/literary-map.html\n\n';
            errorMessage += '方法2 (Node.js):\n';
            errorMessage += '  cd "c:\\Users\\suxin\\Desktop\\Litlong"\n';
            errorMessage += '  npx http-server\n';
            errorMessage += '  然后访问显示的URL\n\n';
            errorMessage += '❌ 不要直接双击打开HTML文件！';
        } else {
            errorMessage += error.message + '\n\n';
            errorMessage += '请确保 mergedLitlong_forgenre.csv 文件存在于项目目录中。';
        }

        alert(errorMessage);
    }
}

// ========== 初始化应用 ==========
function initializeApp() {
    setupEventListeners();
    updateHomePageStats();
    populateFilters();
}

// ========== 事件监听 ==========
function setupEventListeners() {
    // 模式切换
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            switchMode(mode);
        });
    });

    // 页面导航
    document.querySelectorAll('[data-goto]').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.dataset.goto;
            navigateToPage(page);
        });
    });

    // 地图控制
    const clusterToggle = document.getElementById('toggle-clusters');
    if (clusterToggle) {
        clusterToggle.addEventListener('click', toggleClusters);
    }

    const highFreqToggle = document.getElementById('filter-high-freq');
    if (highFreqToggle) {
        highFreqToggle.addEventListener('click', filterHighFrequency);
    }

    // 筛选
    const applyFilters = document.getElementById('apply-filters');
    if (applyFilters) {
        applyFilters.addEventListener('click', applyMapFilters);
    }

    const resetFilters = document.getElementById('reset-filters');
    if (resetFilters) {
        resetFilters.addEventListener('click', resetMapFilters);
    }

    // 年份滑块
    const yearFilter = document.getElementById('year-filter');
    if (yearFilter) {
        yearFilter.addEventListener('input', function() {
            document.getElementById('selected-year').textContent = this.value;
        });
    }

    // 书架视图切换
    const viewBookshelf = document.getElementById('view-bookshelf');
    const viewTimeline = document.getElementById('view-timeline');

    if (viewBookshelf) {
        viewBookshelf.addEventListener('click', function() {
            document.getElementById('bookshelf-container').classList.add('active');
            document.getElementById('timeline-container').classList.remove('active');
            this.classList.add('active');
            viewTimeline.classList.remove('active');
        });
    }

    if (viewTimeline) {
        viewTimeline.addEventListener('click', function() {
            document.getElementById('timeline-container').classList.add('active');
            document.getElementById('bookshelf-container').classList.remove('active');
            this.classList.add('active');
            viewBookshelf.classList.remove('active');
        });
    }

    // 阅读器控制
    const closeReader = document.querySelector('.close-reader');
    if (closeReader) {
        closeReader.addEventListener('click', closeBookReader);
    }

    const prevPage = document.getElementById('prev-page');
    const nextPage = document.getElementById('next-page');

    if (prevPage) {
        prevPage.addEventListener('click', () => turnPage(-1));
    }

    if (nextPage) {
        nextPage.addEventListener('click', () => turnPage(1));
    }
}

// ========== 模式切换 ==========
function switchMode(mode) {
    AppData.currentMode = mode;
    document.body.className = `${mode}-mode`;

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    console.log(`切换到${mode === 'tourist' ? '游客' : '学者'}模式`);
}

// ========== 页面导航 ==========
function navigateToPage(pageName) {
    AppData.currentPage = pageName;

    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // 显示目标页面
    let targetPage;
    switch(pageName) {
        case 'home':
            targetPage = document.getElementById('homepage');
            break;
        case 'map':
            targetPage = document.getElementById('map-page');
            initializeMap();
            break;
        case 'library':
            targetPage = document.getElementById('library-page');
            initializeLibrary();
            break;
    }

    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// ========== 更新首页统计 ==========
function updateHomePageStats() {
    const locCount = document.getElementById('home-locations-count');
    const worksCount = document.getElementById('home-works-count');

    if (locCount) {
        locCount.textContent = AppData.locations.length + '+';
    }

    if (worksCount) {
        worksCount.textContent = AppData.documents.length + '+';
    }
}

// ========== 填充筛选器 ==========
function populateFilters() {
    // 作者筛选
    const authorFilter = document.getElementById('author-filter');
    if (authorFilter) {
        const sortedAuthors = Array.from(AppData.authors).sort();
        sortedAuthors.forEach(author => {
            const option = document.createElement('option');
            option.value = author;
            option.textContent = author;
            authorFilter.appendChild(option);
        });
    }

    // 类型筛选
    const genreFilter = document.getElementById('genre-filter');
    if (genreFilter) {
        const sortedGenres = Array.from(AppData.genres).sort();
        sortedGenres.forEach(genre => {
            const chip = document.createElement('div');
            chip.className = 'genre-chip';
            chip.textContent = genre;
            chip.dataset.genre = genre;
            chip.addEventListener('click', function() {
                this.classList.toggle('active');
            });
            genreFilter.appendChild(chip);
        });
    }
}

// ========== 初始化地图 ==========
function initializeMap() {
    if (AppData.map) return; // 已初始化

    const mapElement = document.getElementById('literature-map');
    if (!mapElement) return;

    // 创建地图 - 中心在苏格兰
    AppData.map = L.map('literature-map').setView([56.4907, -4.2026], 7);

    // 使用复古风格的底图
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 18
    }).addTo(AppData.map);

    // 添加所有地点标记
    addAllMarkers();
}

// ========== 添加地图标记 ==========
function addAllMarkers() {
    // 清除现有标记
    AppData.markers.forEach(marker => AppData.map.removeLayer(marker));
    AppData.markers = [];

    AppData.locations.forEach(location => {
        if (!location.lat || !location.lon) return;

        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);
        if (isNaN(lat) || isNaN(lon)) return;

        // 根据提及次数选择样式
        let markerClass, color;
        if (location.mentionCount >= 50) {
            markerClass = 'vintage-marker-high';
            color = '#800020'; // burgundy
        } else if (location.mentionCount >= 10) {
            markerClass = 'vintage-marker-medium';
            color = '#704214'; // sepia
        } else {
            markerClass = 'vintage-marker-low';
            color = '#228B22'; // forest green
        }

        // 创建自定义图标
        const icon = L.divIcon({
            className: markerClass,
            iconSize: [24, 24],
            html: `<div style="width:100%;height:100%;background:${color};border-radius:50%;border:3px solid #FFFDD0;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`
        });

        const marker = L.marker([lat, lon], { icon: icon });

        // 弹窗内容
        const popupContent = `
            <div style="font-family: 'Crimson Text', serif; max-width: 250px;">
                <h3 style="color: #800020; font-family: 'Playfair Display', serif; margin-bottom: 10px;">
                    ${location.text}
                </h3>
                <p style="margin: 5px 0;">
                    <strong>提及次数:</strong> ${location.mentionCount}
                </p>
                <p style="margin: 5px 0;">
                    <strong>相关作品:</strong> ${location.documentCount}
                </p>
                ${location.mentionTexts.length > 0 ? `
                    <p style="margin: 10px 0 5px; font-weight: bold;">提及示例:</p>
                    <ul style="margin: 0; padding-left: 20px; font-size: 0.9em;">
                        ${location.mentionTexts.slice(0, 2).map(text =>
                            `<li style="margin: 5px 0;">"${text.substring(0, 50)}..."</li>`
                        ).join('')}
                    </ul>
                ` : ''}
            </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(AppData.map);
        AppData.markers.push(marker);
    });

    console.log(`✓ 添加 ${AppData.markers.length} 个地图标记`);
}

// ========== 地图控制功能 ==========
function toggleClusters() {
    // 标记聚合功能
    console.log('切换聚合模式');
    // 使用 Leaflet.markercluster 实现
}

function filterHighFrequency() {
    // 只显示高频地点
    const btn = document.getElementById('filter-high-freq');
    const isActive = btn.classList.toggle('active');

    AppData.markers.forEach(marker => {
        marker.remove();
    });

    if (isActive) {
        const highFreqLocations = AppData.locations.filter(loc => loc.mentionCount >= 50);
        console.log(`显示 ${highFreqLocations.length} 个高频地点`);
        // 重新添加高频标记
    } else {
        addAllMarkers();
    }
}

function applyMapFilters() {
    const selectedAuthor = document.getElementById('author-filter').value;
    const selectedYear = document.getElementById('year-filter').value;
    const activeGenres = Array.from(document.querySelectorAll('.genre-chip.active')).map(chip => chip.dataset.genre);

    console.log('应用筛选:', { selectedAuthor, selectedYear, activeGenres });
    // 根据筛选条件过滤数据并更新地图
}

function resetMapFilters() {
    document.getElementById('author-filter').value = '';
    document.getElementById('year-filter').value = '1875';
    document.getElementById('selected-year').textContent = '1875';
    document.querySelectorAll('.genre-chip').forEach(chip => chip.classList.remove('active'));

    addAllMarkers();
}

// ========== 初始化书架 ==========
function initializeLibrary() {
    const shelf = document.querySelector('.wooden-shelf');
    if (!shelf || shelf.children.length > 0) return;

    // 取前20本书展示
    const displayBooks = AppData.documents.slice(0, 20);

    displayBooks.forEach((doc, index) => {
        const book = document.createElement('div');
        book.className = 'shelf-book';

        // 随机生成书籍颜色
        const colors = [
            'linear-gradient(135deg, #704214, #800020)',
            'linear-gradient(135deg, #228B22, #2C1810)',
            'linear-gradient(135deg, #D4AF37, #704214)',
            'linear-gradient(135deg, #800020, #2C1810)'
        ];
        book.style.background = colors[index % colors.length];

        // 书籍标题
        const titleDiv = document.createElement('div');
        titleDiv.style.cssText = `
            position: absolute;
            top: 20px;
            left: 15px;
            right: 8px;
            font-size: 0.75em;
            color: #FFFDD0;
            writing-mode: vertical-rl;
            text-align: center;
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
        `;
        titleDiv.textContent = doc.title.substring(0, 30);
        book.appendChild(titleDiv);

        // 点击打开阅读器
        book.addEventListener('click', () => openBookReader(doc));

        shelf.appendChild(book);
    });

    console.log(`✓ 添加 ${displayBooks.length} 本书到书架`);
}

// ========== 打开书籍阅读器 ==========
function openBookReader(book) {
    AppData.currentBook = book;
    AppData.currentPageNum = 0; // 从封面开始

    const reader = document.getElementById('book-reader');
    reader.classList.add('active');

    // 更新封面
    document.querySelector('.book-cover-page .book-title').textContent = book.title;
    document.querySelector('.book-cover-page .book-author').textContent =
        `${book.forename} ${book.surname}`;
    document.querySelector('.book-cover-page .book-year').textContent =
        book.pubyear.split('-')[0];

    // 生成书页内容（模拟）
    generateBookPages(book);

    // 播放翻书音效
    playPageTurnSound();

    console.log(`打开书籍: ${book.title}`);
}

// ========== 生成书页 ==========
function generateBookPages(book) {
    // 模拟书页内容
    AppData.bookPages = [
        {
            left: `<h3>第一章</h3><p>这是一个关于${book.title}的故事...</p>`,
            right: `<p>作者${book.forename} ${book.surname}在${book.pubyear.split('-')[0]}年创作了这部作品。</p>`
        },
        {
            left: `<p>书中提到了许多地点，包括爱丁堡、格拉斯哥等苏格兰著名城市。</p>`,
            right: `<p>这些地点在维多利亚时代的文学中占据重要地位。</p>`
        }
    ];

    updateReaderPages();
}

// ========== 更新阅读器页面 ==========
function updateReaderPages() {
    if (AppData.currentPageNum === 0) {
        // 显示封面
        document.querySelector('.book-cover-page').style.display = 'flex';
        document.querySelector('.book-content-pages').style.display = 'none';
    } else {
        document.querySelector('.book-cover-page').style.display = 'none';
        document.querySelector('.book-content-pages').style.display = 'flex';

        const pageIndex = AppData.currentPageNum - 1;
        if (pageIndex < AppData.bookPages.length) {
            const page = AppData.bookPages[pageIndex];
            document.getElementById('left-page-text').innerHTML = page.left;
            document.getElementById('right-page-text').innerHTML = page.right;

            // 更新页码
            document.querySelector('.page-number.left').textContent = pageIndex * 2 + 1;
            document.querySelector('.page-number.right').textContent = pageIndex * 2 + 2;
        }
    }

    // 更新页面信息
    document.getElementById('current-page').textContent = AppData.currentPageNum;
    document.getElementById('total-pages').textContent = AppData.bookPages.length + 1;
}

// ========== 翻页 ==========
function turnPage(direction) {
    const newPage = AppData.currentPageNum + direction;

    if (newPage < 0 || newPage > AppData.bookPages.length) {
        return; // 超出范围
    }

    AppData.currentPageNum = newPage;
    updateReaderPages();
    playPageTurnSound();

    // 添加翻页动画
    const pages = document.querySelector('.book-content-pages');
    if (pages) {
        pages.style.animation = 'none';
        setTimeout(() => {
            pages.style.animation = 'pageFlip 0.6s ease';
        }, 10);
    }
}

// ========== 关闭阅读器 ==========
function closeBookReader() {
    document.getElementById('book-reader').classList.remove('active');
    AppData.currentBook = null;
}

// ========== 播放翻书音效 ==========
function playPageTurnSound() {
    const sound = document.getElementById('page-turn-sound');
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('音效播放失败'));
    }
}

// ========== 页面加载时初始化 ==========
window.addEventListener('DOMContentLoaded', () => {
    console.log('苏格兰文学地图 - 初始化中...');
    loadAllData();
});

// ========== 翻页动画 CSS ==========
const style = document.createElement('style');
style.textContent = `
@keyframes pageFlip {
    0% {
        transform: rotateY(0deg);
        opacity: 1;
    }
    50% {
        transform: rotateY(90deg);
        opacity: 0.5;
    }
    100% {
        transform: rotateY(0deg);
        opacity: 1;
    }
}
`;
document.head.appendChild(style);
