// Biến toàn cục lưu danh sách tập phim để dùng cho pagination
let currentServerData = [];
let currentMovieInfo = {};
let isRecommendLoaded = false; // Biến kiểm tra đã tải tab đề xuất chưa

// --- CONFIG CHO CAST SECTION ---
const TMDB_API_KEY = 'd628e326b0c87e3f67133dabc797e5d0';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const PHIMAPI_IMAGE_BASE = 'https://phimimg.com/';

// Icon SVG cho nút thu gọn
const iconCollapse = `
    <svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 12 12" xml:space="preserve" width="12px" height="12px"><g id="UI"><g id="_x31_024_x2F_tab01" transform="translate(-532.000000, -407.000000)"><g id="上部分" transform="translate(64.000000, 0.000000)"><g id="_x30_5-地区_x2F_配音_x2F_人员_x2F_简介" transform="translate(0.000000, 266.000000)"><g id="more" transform="translate(0.000000, 72.000000)"><g id="编组" transform="translate(468.500000, 68.000000)"><path id="路径" fill-opacity="0.703" d="M0.4,10L1,10.6c0.2,0.2,0.5,0.2,0.7,0l0,0l3.9-3.9l0,0l3.9,3.9c0.2,0.2,0.5,0.2,0.7,0L11,10 c0.2-0.2,0.2-0.5,0-0.7L6.6,4.9l0,0C6.1,4.4,5.3,4.4,4.8,4.8L0.4,9.3C0.2,9.5,0.2,9.8,0.4,10L0.4,10z"></path><path id="路径备份" fill="#1CC749" d="M0.4,9L1,9.6c0.2,0.2,0.5,0.2,0.7,0l0,0l3.9-3.9l0,0l3.9,3.9c0.2,0.2,0.5,0.2,0.7,0 L11,9c0.2-0.2,0.2-0.5,0-0.7L6.6,3.9l0,0C6.1,3.4,5.3,3.4,4.8,3.8L0.4,8.3C0.2,8.5,0.2,8.8,0.4,9L0.4,9z"></path></g></g></g></g></g></g><path id="路径" fill-opacity="0.703" d="M0.4,10L1,10.6c0.2,0.2,0.5,0.2,0.7,0l0,0l3.9-3.9l0,0l3.9,3.9c0.2,0.2,0.5,0.2,0.7,0L11,10 c0.2-0.2,0.2-0.5,0-0.7L6.6,4.9l0,0C6.1,4.4,5.3,4.4,4.8,4.8L0.4,9.3C0.2,9.5,0.2,9.8,0.4,10L0.4,10z"></path></svg>
`;

// Icon SVG cho nút mở rộng
const iconExpand = `
    <svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="UI" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="1024/tab01" transform="translate(-532.000000, -407.000000)" fill-rule="nonzero"><g id="上部分" transform="translate(64.000000, 0.000000)"><g id="05-地区/配音/人员/简介" transform="translate(0.000000, 266.000000)"><g id="more" transform="translate(0.000000, 72.000000)"><g id="编组" transform="translate(468.500000, 68.000000)"><path d="M9.65685425,3.15685425 L9.65685425,4.07685425 C9.65690688,4.35299662 9.43304925,4.57685425 9.15690688,4.57685425 C9.15688933,4.57685425 9.15687179,4.57685425 9.15685425,4.57680162 L3.57685425,4.57621425 L3.57685425,4.57621425 L3.57685425,10.1568542 C3.57685425,10.4329966 3.35299662,10.6568542 3.07685425,10.6568542 L2.15685425,10.6568542 C1.88071187,10.6568542 1.65685425,10.4329966 1.65685425,10.1568542 L1.65685425,3.93685425 L1.65685425,3.93685425 C1.65685425,3.2620627 2.17901604,2.70922857 2.84132635,2.66036512 L9.15685432,2.65711181 C9.43299652,2.65671207 9.65696943,2.88045435 9.65711168,3.15659669 C9.65711173,3.15668254 9.65711175,3.15676839 9.65685425,3.15685425 Z" id="路径" fill-opacity="0.702969638" fill="#000000" transform="translate(5.656854, 6.656854) scale(-1, 1) rotate(-135.000000) translate(-5.656854, -6.656854) "></path><path d="M9.65685425,2.15685425 L9.65685425,3.07685425 C9.65690688,3.35299662 9.43304925,3.57685425 9.15690688,3.57685425 C9.15688933,3.57685425 9.15687179,3.57685425 9.15685425,3.57680162 L3.57685425,3.57621425 L3.57685425,3.57621425 L3.57685425,9.15685425 C3.57685425,9.43299662 3.35299662,9.65685425 3.07685425,9.65685425 L2.15685425,9.65685425 C1.88071187,9.65685425 1.65685425,9.43299662 1.65685425,9.15685425 L1.65685425,2.93685425 L1.65685425,2.93685425 C1.65685425,2.2620627 2.17901604,1.70922857 2.84132635,1.66036512 L9.15685432,1.65711181 C9.43299652,1.65671207 9.65696943,1.88045435 9.65711168,2.15668254 9.65711175,2.15676839 9.65685425,2.15685425 Z" id="路径备份" fill="#1CC749" transform="translate(5.656854, 5.656854) scale(-1, 1) rotate(-135.000000) translate(-5.656854, -5.656854) "></path></g></g></g></g></g></g></svg>
`;

// SVG Play & Collection for Cast Cards
const playBtnSvg = `
    <svg viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="30" fill="rgb(28, 199, 73)"></circle>
        <path d="M35.75,22.5 L45.14,36.6 C46.06,38 45.69,39.8 44.3,40.7 C43.8,41.1 43.2,41.25 42.6,41.25 L23.85,41.25 C22.2,41.25 20.85,39.9 20.85,38.25 C20.85,37.65 21,37.1 21.35,36.6 L30.75,22.5 C31.67,21.1 33.5,20.7 34.9,21.6 C35.2,21.9 35.5,22.2 35.75,22.5 Z" fill="#000000" transform="translate(33.25, 30.00) rotate(-270.00) translate(-33.25, -30.00) "></path>
    </svg>
`;

// ĐÃ SỬA: Cập nhật icon sưu tập mới.
const collectionBtnSvg = `
    <svg width="24px" height="24px" viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
             <path d="M29.3,17.25 C29.69,17.25 30,17.56 30,17.94 L30,19.39 C30,19.77 29.69,20.08 29.3,20.08 L22.91,20.08 L22.91,39.72 L28.64,34.95 C29.37,34.34 30.41,34.3 31.18,34.82 L31.36,34.95 L37.08,39.72 L37.08,33.52 C37.08,33.14 37.39,32.83 37.77,32.83 L39.22,32.83 C39.6,32.83 39.91,33.14 39.91,33.52 L39.91,41.23 C39.91,42.41 38.96,43.36 37.79,43.36 C37.36,43.36 36.95,43.23 36.6,43 L36.43,42.87 L30,37.51 L23.57,42.87 C22.72,43.57 21.49,43.51 20.72,42.75 L20.57,42.6 C20.3,42.27 20.13,41.87 20.09,41.45 L20.08,41.23 L20.08,20.08 C20.08,18.59 21.24,17.36 22.7,17.25 L22.91,17.25 L29.3,17.25 Z M39.22,17.25 C39.6,17.25 39.91,17.56 39.91,17.94 L39.91,21.5 L43.47,21.5 C43.85,21.5 44.16,21.81 44.16,22.19 L44.16,23.64 C44.16,24.02 43.85,24.33 43.47,24.33 L39.91,24.33 L39.91,27.89 C39.91,28.27 39.6,28.58 39.22,28.58 L37.77,28.58 C37.39,28.58 37.08,28.27 37.08,27.89 L37.08,24.33 L33.52,24.33 C33.14,24.33 32.83,24.02 32.83,23.64 L32.83,22.19 C32.83,21.81 33.14,21.5 33.52,21.5 L37.08,21.5 L37.08,17.94 C37.08,17.56 37.39,17.25 37.77,17.25 L39.22,17.25 Z" fill="#111319" fill-rule="nonzero"></path>
        </g>
    </svg>
`;


// Toggle Description
function toggleDescription() {
    var descContainer = document.getElementById("movieDesc");
    var btn = document.getElementById("toggleBtn");
    descContainer.classList.toggle("expanded");

    if (descContainer.classList.contains("expanded")) {
        btn.innerHTML = `Thu gọn giới thiệu ${iconCollapse}`;
    } else {
        btn.innerHTML = `Hiển thị thêm ${iconExpand}`;
    }
}

// Hàm Chuyển Tab
function switchTab(tabName) {
    // Nav Items
    const navEpisodes = document.getElementById('nav-episodes');
    const navCast = document.getElementById('nav-cast');
    const navRecommend = document.getElementById('nav-recommend');

    // Content Containers
    const tabEpisodes = document.getElementById('tab-episodes');
    const tabCast = document.getElementById('tab-cast');
    const tabRecommend = document.getElementById('tab-recommend');

    // Reset all
    navEpisodes.className = 'nav-item inactive';
    navCast.className = 'nav-item inactive';
    navRecommend.className = 'nav-item inactive';

    tabEpisodes.style.display = 'none';
    tabCast.style.display = 'none';
    tabRecommend.style.display = 'none';

    if (tabName === 'episodes') {
        navEpisodes.className = 'nav-item active';
        tabEpisodes.style.display = 'block';
    } else if (tabName === 'cast') {
        navCast.className = 'nav-item active';
        tabCast.style.display = 'block';
    } else if (tabName === 'recommend') {
        navRecommend.className = 'nav-item active';
        tabRecommend.style.display = 'block';
        
        // Gọi hàm tải dữ liệu nếu chưa tải
        if (!isRecommendLoaded) {
            fetchRecommendMovies();
        }
    }
}


// --- FETCH DATA LOGIC ---
document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const movieSlug = queryString ? queryString.substring(1) : null;

    if (!movieSlug) {
        document.getElementById('movieTitle').textContent = "Chưa chọn phim";
        document.getElementById('descText').textContent = "Vui lòng thêm ?{slug-phim} vào thanh địa chỉ để xem.";
        return;
    }

    const apiUrl = `https://phimapi.com/phim/${movieSlug}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                renderMovieData(data);
                // Sau khi có dữ liệu phim, gọi tiếp TMDB để lấy diễn viên
                const searchName = data.movie.origin_name || data.movie.name;
                // Hiển thị loading msg bên tab diễn viên
                document.getElementById('loadingMsg').style.display = 'block';
                fetchTmdbData(searchName, data.movie.type);
            } else {
                document.getElementById('movieTitle').textContent = "Không tìm thấy phim";
                document.getElementById('descText').textContent = "API trả về lỗi hoặc phim không tồn tại.";
            }
        })
        .catch(err => console.error("Error fetching data:", err));
});

function renderMovieData(data) {
    const movie = data.movie;
    const episodes = data.episodes;
    currentMovieInfo = movie;

    // 1. Banner & Image
    document.getElementById('bannerImg').src = movie.thumb_url;

    // 2. Title
    document.getElementById('movieTitle').textContent = movie.name;
    document.title = `${movie.name} (${movie.year})`;

    // 3. Meta Info
    const score = movie.tmdb ? movie.tmdb.vote_average : 9.8;
    document.getElementById('movieScore').textContent = score;

    let metaHtml = `
        <span class="meta-tag">${movie.quality}</span> <span class="divider">|</span>
        <span class="meta-tag">${movie.year}</span> <span class="divider">|</span>
        <span class="meta-tag">${movie.time}</span>
    `;
    document.getElementById('metaInfo').innerHTML = metaHtml;

    // 4. Tags
    const tagContainer = document.getElementById('tagList');
    let tagsHtml = "";
    if (movie.country && movie.country.length > 0) {
        movie.country.forEach(c => {
            tagsHtml += `<a href="#" class="tag">${c.name}</a>`;
        });
    }
    if (movie.category && movie.category.length > 0) {
        movie.category.forEach(cat => {
            tagsHtml += `<a href="#" class="tag">${cat.name}</a>`;
        });
    }
    tagsHtml += `<a href="#" class="tag">${movie.lang}</a>`;
    tagContainer.innerHTML = tagsHtml;

    // 5. Credits
    const directorList = document.getElementById('directorList');
    directorList.innerHTML = movie.director.map(d => `<a href="#">${d}</a>`).join(", ");

    const actorList = document.getElementById('actorList');
    actorList.innerHTML = movie.actor.map(a => `<a href="#">${a}</a>`).join(", ");

    // 6. Description
    document.getElementById('descText').innerHTML = movie.content;

    // 7. Episodes Logic
    if (episodes && episodes.length > 0) {
        currentServerData = episodes[0].server_data;
        const totalEpisodes = currentServerData.length;
        const chunkSize = 24;

        const btnPlayMain = document.getElementById('btnPlayMain');
        btnPlayMain.onclick = function () {
            if (currentServerData.length > 0) window.open(currentServerData[0].link_embed, '_blank');
        }

        const filterContainer = document.getElementById('episodeFilterContainer');

        if (totalEpisodes > chunkSize) {
            let selectHtml = `<select class="custom-select" id="chunkSelect" onchange="onChunkChange(this.value)">`;
            for (let i = 0; i < totalEpisodes; i += chunkSize) {
                let start = i + 1;
                let end = Math.min(i + chunkSize, totalEpisodes);
                selectHtml += `<option value="${i}">Chọn tập ${start}-${end}</option>`;
            }
            selectHtml += `</select>`;
            filterContainer.innerHTML = selectHtml;
            renderEpisodeGrid(0, chunkSize);
        } else {
            filterContainer.innerHTML = `<button class="filter-btn" style="background:none; border:none; padding-left:0; font-size:16px;">Chọn tập 1-${totalEpisodes}</button>`;
            renderEpisodeGrid(0, totalEpisodes);
        }
    }
}

function onChunkChange(startIndex) {
    const chunkSize = 24;
    renderEpisodeGrid(parseInt(startIndex), chunkSize);
}

function renderEpisodeGrid(startIndex, limit) {
    const grid = document.getElementById('episodeGrid');
    let episodeHtml = "";
    const endIndex = Math.min(startIndex + limit, currentServerData.length);
    const pageData = currentServerData.slice(startIndex, endIndex);

    pageData.forEach(ep => {
        episodeHtml += `
        <div class="card" onclick="window.open('${ep.link_embed}', '_blank')">
            <div class="card-img-box">
                <img src="${currentMovieInfo.thumb_url}" alt="${ep.name}">
                <div class="play-btn-overlay">
                    <svg width="60px" height="60px" viewBox="0 0 60 60" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        class="play-button">
                        <g id="Btn/Play/Normal" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <circle id="bg" fill="#1CC749" cx="30" cy="30" r="30"></circle>
                            <path d="M35.7461509,22.4942263 L45.1405996,36.5858994 C46.059657,37.9644855 45.6871354,39.8270935 44.3085493,40.7461509 C43.8157468,41.0746859 43.2367237,41.25 42.6444487,41.25 L23.8555513,41.25 C22.198697,41.25 20.8555513,39.9068542 20.8555513,38.25 C20.8555513,37.657725 21.0308654,37.078702 21.3594004,36.5858994 L30.7538491,22.4942263 C31.6729065,21.1156403 33.5355145,20.7431187 34.9141006,21.662176 C35.2436575,21.8818806 35.5264463,22.1646695 35.7461509,22.4942263 Z"
                                id="Triangle" fill="#000000"
                                transform="translate(33.250000, 30.000000) rotate(-270.000000) translate(-33.250000, -30.000000) ">
                            </path>
                        </g>
                    </svg>
                </div>
            </div>
            <div class="card-title">${ep.name} - ${currentMovieInfo.name}</div>
        </div>
        `;
    });
    grid.innerHTML = episodeHtml;
}

// --- TMDB CAST LOGIC ---
async function fetchTmdbData(queryName, type) {
    try {
        const isTv = (type === 'series' || type === 'tvshows' || type === 'hoathinh');
        const searchType = isTv ? 'tv' : 'movie';

        const searchUrl = `${TMDB_BASE_URL}/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(queryName)}&language=vi-VN&page=1`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (searchData.results && searchData.results.length > 0) {
            const tmdbId = searchData.results[0].id;
            const detailsUrl = `${TMDB_BASE_URL}/${searchType}/${tmdbId}/credits?api_key=${TMDB_API_KEY}&language=vi-VN`;
            const creditsRes = await fetch(detailsUrl);
            const creditsData = await creditsRes.json();

            document.getElementById('loadingMsg').style.display = 'none';
            renderCastList(creditsData.cast, creditsData.crew);
        } else {
            document.getElementById('loadingMsg').innerHTML = "Không tìm thấy thông tin trên TMDB.";
        }
    } catch (error) {
        console.error("Lỗi TMDB:", error);
    }
}

async function renderCastList(cast, crew) {
    const container = document.getElementById('castListContainer');
    container.innerHTML = "";

    const director = crew.find(c => c.job === 'Director');
    let peopleList = [];

    if (director) {
        peopleList.push({ ...director, roleName: 'Đạo diễn' });
    }

    cast.forEach(c => {
        peopleList.push({ ...c, roleName: 'Diễn viên' });
    });

    for (const person of peopleList) {
        const personBlock = document.createElement('div');
        personBlock.className = 'person-block';

        const avatarUrl = person.profile_path
            ? TMDB_IMAGE_BASE + person.profile_path
            : 'img/default_avatar.png';

        let html = `
            <div class="person-header">
                <div class="person-avatar">
                    <img src="${avatarUrl}" alt="${person.name}" onerror="this.onerror=null; this.src='img/default_avatar.png';">
                </div>
                <div class="person-info">
                    <div class="person-name">${person.name}</div>
                    <div class="person-role">${person.roleName}</div>
                    <div class="more-link">
                        Khác <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>
            </div>
            <div class="person-movies-grid" id="movies-of-${person.id}">
            </div>
        `;
        personBlock.innerHTML = html;
        container.appendChild(personBlock);

        fetchPersonCredits(person.id, `movies-of-${person.id}`);
    }
}

async function fetchPersonCredits(personId, containerId) {
    try {
        const url = `${TMDB_BASE_URL}/person/${personId}/combined_credits?api_key=${TMDB_API_KEY}&language=vi-VN`;
        const res = await fetch(url);
        const data = await res.json();

        let works = data.cast || [];
        if (works.length === 0) works = data.crew || [];

        works.sort((a, b) => b.popularity - a.popularity);

        const candidates = works.slice(0, 6);
        const gridContainer = document.getElementById(containerId);

        if (candidates.length > 0) {
            const processedMovies = await Promise.all(candidates.map(async (w) => {
                let result = null;
                try {
                    const titleQuery = w.title || w.name;
                    const searchApiUrl = `https://phimapi.com/v1/api/tim-kiem?keyword=${encodeURIComponent(titleQuery)}&limit=10`;
                    const searchRes = await fetch(searchApiUrl);
                    const searchResult = await searchRes.json();

                    if (searchResult.status === 'success' && searchResult.data && searchResult.data.items) {
                        const match = searchResult.data.items.find(item =>
                            item.tmdb && item.tmdb.id == w.id
                        );

                        if (match) {
                            let poster = match.poster_url;
                            if (!poster.startsWith('http')) {
                                poster = PHIMAPI_IMAGE_BASE + poster;
                            }
                            result = {
                                title: match.name,
                                poster: poster,
                                slug: match.slug
                            };
                        }
                    }
                } catch (err) {
                    console.log("Check API err", err);
                }
                return result;
            }));

            const finalMovies = processedMovies.filter(m => m !== null).slice(0, 2);

            if (finalMovies.length > 0) {
                let moviesHtml = "";
                finalMovies.forEach(m => {
                    moviesHtml += `
                        <div class="movie-card-vertical" title="${m.title}" onclick="window.location.href='?${m.slug}'">
                            <div class="poster-box">
                                <img src="${m.poster}" alt="${m.title}">
                                <div class="poster-overlay-gradient"></div>
                                <div class="play-btn-center">${playBtnSvg}</div>
                                <div class="collection-btn">
                                    ${collectionBtnSvg}
                                    <div class="tooltip-text">Sưu tập</div>
                                </div>
                            </div>
                            <div class="poster-title">${m.title}</div>
                        </div>
                    `;
                });
                gridContainer.innerHTML = moviesHtml;
            } else {
                handleNoMovies(gridContainer);
            }
        } else {
            handleNoMovies(gridContainer);
        }
    } catch (e) {
        console.log("Err credits person", personId);
        const c = document.getElementById(containerId);
        if (c) handleNoMovies(c);
    }
}

function handleNoMovies(container) {
    if (!container) return;
    container.innerHTML = "";
    container.style.display = "none";
    const parentBlock = container.closest('.person-block');
    if (parentBlock) {
        const header = parentBlock.querySelector('.person-header');
        if (header) {
            header.style.borderBottom = "none";
            header.style.marginBottom = "0";
            header.style.paddingBottom = "0";
        }
        parentBlock.style.paddingBottom = "24px";
    }
}

// --- RECOMMENDATION LOGIC ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function formatEpisodeText(epStr) {
    if (!epStr) return "";
    const lowerEp = epStr.toLowerCase().trim();

    if (lowerEp === 'full') return "Trọn bộ";

    if (lowerEp.includes('hoàn tất')) {
        const match = epStr.match(/\((\d+)/);
        if (match && match[1]) {
            return `Trọn bộ ${match[1]} tập`;
        }
        return "Trọn bộ";
    }

    if (lowerEp.startsWith('tập')) {
        return `Cập nhật tới ${lowerEp}`;
    }

    return epStr;
}

async function fetchRecommendMovies() {
    const grid = document.getElementById('recommendGrid');
    const totalItemsNeeded = 32;

    try {
        // Fetch 4 trang
        const pageRequests = [1, 2, 3, 4].map(page =>
            fetch(`https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2?page=${page}`).then(res => res.json())
        );

        const results = await Promise.all(pageRequests);
        let allMovies = [];

        results.forEach(data => {
            if (data.status && data.items) {
                allMovies = allMovies.concat(data.items);
            }
        });

        allMovies = shuffleArray(allMovies);
        const finalMovies = allMovies.slice(0, totalItemsNeeded);

        grid.innerHTML = '';
        finalMovies.forEach(movie => {
            const episodeDisplay = formatEpisodeText(movie.episode_current);
            const card = document.createElement('div');
            card.className = 'movie-card-recommend';
            // Logic chuyển trang giữ nguyên định dạng ?{slug} của trang web
            card.onclick = () => { window.location.href = `?${movie.slug}`; };

            card.innerHTML = `
                <div class="poster-wrapper-rec">
                    <img class="poster-img-rec" src="${movie.poster_url}" alt="${movie.name}">
                    <div class="poster-overlay-rec"></div>
                    <div class="episode-tag-rec">${episodeDisplay}</div>
                    <div class="play-btn-rec">${playBtnSvg}</div>
                    <div class="collection-btn-rec">
                        ${collectionBtnSvg}
                        <div class="tooltip-text">Sưu tập</div>
                    </div>
                </div>
                <div class="movie-title-rec">${movie.name}</div>
            `;
            grid.appendChild(card);
        });
        
        isRecommendLoaded = true; // Đánh dấu đã tải xong

    } catch (error) {
        console.error(error);
        grid.innerHTML = '<div style="color:red; grid-column:1/-1; text-align:center;">Lỗi tải dữ liệu đề xuất.</div>';
    }
}