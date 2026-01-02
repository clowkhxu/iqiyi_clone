// Biến toàn cục lưu danh sách tập phim để dùng cho pagination
let currentServerData = [];
let currentMovieInfo = {};

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

const collectionBtnSvg = `
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.3,17.25 C29.7,17.25 30,17.56 30,17.94 L30,19.4 C30,19.8 29.7,20.1 29.3,20.1 L22.9,20.1 L22.9,39.7 L28.6,34.9 C29.4,34.3 30.4,34.3 31.2,34.8 L31.4,34.9 L37.1,39.7 L37.1,33.5 C37.1,33.1 37.4,32.8 37.8,32.8 L39.2,32.8 C39.6,32.8 39.9,33.1 39.9,33.5 L39.9,41.2 C39.9,42.4 39,43.4 37.8,43.4 C37.4,43.4 37,43.2 36.6,43 L36.4,42.9 L30,37.5 L23.6,42.9 C22.7,43.6 21.5,43.5 20.7,42.8 L20.6,42.6 C20.3,42.3 20.1,41.9 20.1,41.4 L20.1,41.2 L20.1,20.1 C20.1,18.6 21.2,17.4 22.7,17.3 L22.9,17.25 L29.3,17.25 Z M39.2,17.25 C39.6,17.25 39.9,17.56 39.9,17.94 L39.9,21.5 L43.5,21.5 C43.9,21.5 44.2,21.8 44.2,22.2 L44.2,23.6 C44.2,24 43.9,24.3 43.5,24.3 L39.9,24.3 L39.9,27.9 C39.9,28.3 39.6,28.6 39.2,28.6 L37.8,28.6 C37.4,28.6 37.1,28.3 37.1,27.9 L37.1,24.3 L33.5,24.3 C33.1,24.3 32.8,24 32.8,23.6 L32.8,22.2 C32.8,21.8 33.1,21.5 33.5,21.5 L37.1,21.5 L37.1,17.9 C37.1,17.6 37.4,17.25 37.8,17.25 L39.2,17.25 Z" fill="#111319" fill-rule="nonzero"/>
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

    // Content Containers
    const tabEpisodes = document.getElementById('tab-episodes');
    const tabCast = document.getElementById('tab-cast');

    if (tabName === 'episodes') {
        navEpisodes.classList.add('active');
        navEpisodes.classList.remove('inactive');
        navCast.classList.remove('active');
        navCast.classList.add('inactive');

        tabEpisodes.style.display = 'block';
        tabCast.style.display = 'none';
    } else if (tabName === 'cast') {
        navCast.classList.add('active');
        navCast.classList.remove('inactive');
        navEpisodes.classList.remove('active');
        navEpisodes.classList.add('inactive');

        tabCast.style.display = 'block';
        tabEpisodes.style.display = 'none';
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