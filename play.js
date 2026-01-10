const TMDB_API_KEY = 'd628e326b0c87e3f67133dabc797e5d0';
let art;
let movieData = {};
let isThumbnailMode = false;
let currentServerData = [];

// --- SVG ICONS (CẬP NHẬT MỚI) ---
const listIconSvg = `
<svg width="18px" height="17px" viewBox="0 0 18 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="控件" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="icon/listmode" transform="translate(-3.000000, -3.000000)" fill="#A9A9AC"><path d="M5.5,17 C5.77614237,17 6,17.2238576 6,17.5 L6,19.5 C6,19.7761424 5.77614237,20 5.5,20 L3.5,20 C3.22385763,20 3,19.7761424 3,19.5 L3,17.5 C3,17.2238576 3.22385763,17 3.5,17 L5.5,17 Z M20.5,17 C20.7761424,17 21,17.2238576 21,17.5 L21,19.5 C21,19.7761424 20.7761424,20 20.5,20 L9.5,20 C9.22385763,20 9,19.7761424 9,19.5 L9,17.5 C9,17.2238576 9.22385763,17 9.5,17 L20.5,17 Z M5.5,10 C5.77614237,10 6,10.2238576 6,10.5 L6,12.5 C6,12.7761424 5.77614237,13 5.5,13 L3.5,13 C3.22385763,13 3,12.7761424 3,12.5 L3,10.5 C3,10.2238576 3.22385763,10 3.5,10 L5.5,10 Z M20.5,10 C20.7761424,10 21,10.2238576 21,10.5 L21,12.5 C21,12.7761424 20.7761424,13 20.5,13 L9.5,13 C9.22385763,13 9,12.7761424 9,12.5 L9,10.5 C9,10.2238576 9.22385763,10 9.5,10 L20.5,10 Z M5.5,3 C5.77614237,3 6,3.22385763 6,3.5 L6,5.5 C6,5.77614237 5.77614237,6 5.5,6 L3.5,6 C3.22385763,6 3,5.77614237 3,5.5 L3,3.5 C3,3.22385763 3.22385763,3 3.5,3 L5.5,3 Z M20.5,3 C20.7761424,3 21,3.22385763 21,3.5 L21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L9.5,6 C9.22385763,6 9,5.77614237 9,5.5 L9,3.5 C9,3.22385763 9.22385763,3 9.5,3 L20.5,3 Z" id="Combined-Shape"></path></g></g></svg>`;

const gridIconSvg = `
<svg width="17px" height="17px" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="控件" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="icon/btnmode" transform="translate(-3.000000, -3.000000)" fill="#A9A9AC"><path d="M5.5,17 C5.77614237,17 6,17.2238576 6,17.5 L6,19.5 C6,19.7761424 5.77614237,20 5.5,20 L3.5,20 C3.22385763,20 3,19.7761424 3,19.5 L3,17.5 C3,17.2238576 3.22385763,17 3.5,17 L5.5,17 Z M12.5,17 C12.7761424,17 13,17.2238576 13,17.5 L13,19.5 C13,19.7761424 12.7761424,20 12.5,20 L10.5,20 C10.2238576,20 10,19.7761424 10,19.5 L10,17.5 C10,17.2238576 10.2238576,17 10.5,17 L12.5,17 Z M19.5,17 C19.7761424,17 20,17.2238576 20,17.5 L20,19.5 C20,19.7761424 19.7761424,20 19.5,20 L17.5,20 C17.2238576,20 17,19.7761424 17,19.5 L17,17.5 C17,17.2238576 17.2238576,17 17.5,17 L19.5,17 Z M5.5,10 C5.77614237,10 6,10.2238576 6,10.5 L6,12.5 C6,12.7761424 5.77614237,13 5.5,13 L3.5,13 C3.22385763,13 3,12.7761424 3,12.5 L3,10.5 C3,10.2238576 3.22385763,10 3.5,10 L5.5,10 Z M12.5,10 C12.7761424,10 13,10.2238576 13,10.5 L13,12.5 C13,12.7761424 12.7761424,13 12.5,13 L10.5,13 C10.2238576,13 10,12.7761424 10,12.5 L10,10.5 C10,10.2238576 10.2238576,10 10.5,10 L12.5,10 Z M19.5,10 C19.7761424,10 20,10.2238576 20,10.5 L20,12.5 C20,12.7761424 19.7761424,13 19.5,13 L17.5,13 C17.2238576,13 17,12.7761424 17,12.5 L17,10.5 C17,10.2238576 17.2238576,10 17.5,10 L19.5,10 Z M5.5,3 C5.77614237,3 6,3.22385763 6,3.5 L6,5.5 C6,5.77614237 5.77614237,6 5.5,6 L3.5,6 C3.22385763,6 3,5.77614237 3,5.5 L3,3.5 C3,3.22385763 3.22385763,3 3.5,3 L5.5,3 Z M12.5,3 C12.7761424,3 13,3.22385763 13,3.5 L13,5.5 C13,5.77614237 12.7761424,6 12.5,6 L10.5,6 C10.2238576,6 10,5.77614237 10,5.5 L10,3.5 C10,3.22385763 10.2238576,3 10.5,3 L12.5,3 Z M19.5,3 C19.7761424,3 20,3.22385763 20,3.5 L20,5.5 C20,5.77614237 19.7761424,6 19.5,6 L17.5,6 C17.2238576,6 17,5.77614237 17,5.5 L17,3.5 C17,3.22385763 17.2238576,3 17.5,3 L19.5,3 Z" id="Combined-Shape"></path></g></g></svg>`;

const playSvg = `
<svg viewBox="0 0 60 60">
    <circle cx="30" cy="30" r="30" fill="#1CC749"></circle>
    <path d="M35.75,22.5 L45.14,36.6 C46.06,38 45.69,39.8 44.3,40.7 C43.8,41.1 43.2,41.25 42.6,41.25 L23.85,41.25 C22.2,41.25 20.85,39.9 20.85,38.25 C20.85,37.65 21,37.1 21.35,36.6 L30.75,22.5 C31.67,21.1 33.5,20.7 34.9,21.6 C35.2,21.9 35.5,22.2 35.75,22.5 Z" fill="#000000" transform="translate(33.25, 30.00) rotate(-270.00) translate(-33.25, -30.00) "></path>
</svg>`;

const collectionSvg = `
<svg viewBox="0 0 60 60">
     <path d="M29.3,17.25 C29.7,17.25 30,17.56 30,17.94 L30,19.4 C30,19.8 29.7,20.1 29.3,20.1 L22.9,20.1 L22.9,39.7 L28.6,34.9 C29.4,34.3 30.4,34.3 31.2,34.8 L31.4,34.9 L37.1,39.7 L37.1,33.5 C37.1,33.1 37.4,32.8 37.8,32.8 L39.2,32.8 C39.6,32.8 39.9,33.1 39.9,33.5 L39.9,41.2 C39.9,42.4 39,43.4 37.8,43.4 C37.4,43.4 37,43.2 36.6,43 L36.4,42.9 L30,37.5 L23.6,42.9 C22.7,43.6 21.5,43.5 20.7,42.8 L20.6,42.6 C20.3,42.3 20.1,41.9 20.1,41.4 L20.1,41.2 L20.1,20.1 C20.1,18.6 21.2,17.4 22.7,17.3 L22.9,17.25 L29.3,17.25 Z M39.2,17.25 C39.6,17.25 39.9,17.56 39.9,17.94 L39.9,21.5 L43.5,21.5 C43.9,21.5 44.2,21.8 44.2,22.2 L44.2,23.6 C44.2,24 43.9,24.3 43.5,24.3 L39.9,24.3 L39.9,27.9 C39.9,28.3 39.6,28.6 39.2,28.6 L37.8,28.6 C37.4,28.6 37.1,28.3 37.1,27.9 L37.1,24.3 L33.5,24.3 C33.1,24.3 32.8,24 32.8,23.6 L32.8,22.2 C32.8,21.8 33.1,21.5 33.5,21.5 L37.1,21.5 L37.1,17.9 C37.1,17.6 37.4,17.25 37.8,17.25 L39.2,17.25 Z" fill="#111319" fill-rule="nonzero"/>
</svg>`;

// --- EVENT TOGGLE ---
document.getElementById('viewModeBtn').addEventListener('click', () => {
    isThumbnailMode = !isThumbnailMode;
    const btn = document.getElementById('viewModeBtn');
    if (isThumbnailMode) {
        btn.innerHTML = gridIconSvg; // Bấm vào sẽ hiện icon thứ 2 (Grid)
    } else {
        btn.innerHTML = listIconSvg; // Bấm lại sẽ về icon ban đầu (List)
    }
    renderEpisodeGrid(currentServerData);
});

function getSlug() {
    const search = window.location.search;
    if (search.startsWith('?')) {
        return search.substring(1);
    }
    return ''; 
}

// --- NEW FUNCTION: XỬ LÝ VỊ TRÍ MŨI TÊN ---
function updateTitleLayout() {
    const titleMain = document.getElementById('titleMain');
    const arrowContainer = document.querySelector('.arrow-container');
    const titleEp = document.getElementById('titleEp');

    if (titleMain && arrowContainer && titleEp) {
        // Chỉ áp dụng tính toán vị trí tuyệt đối trên PC (> 1480px)
        // Trên mobile, CSS Flexbox sẽ tự lo
        if (window.innerWidth > 1480) {
            arrowContainer.style.position = 'absolute';
            arrowContainer.style.top = '50%';
            arrowContainer.style.transform = 'translateY(-50%)';
            arrowContainer.style.zIndex = '20';
            
            const mainWidth = titleMain.offsetWidth;
            const leftPos = mainWidth + 15; 
            arrowContainer.style.left = leftPos + 'px';

            titleEp.style.marginLeft = '40px'; 
        } else {
            // Reset style cho mobile
            arrowContainer.style.position = '';
            arrowContainer.style.top = '';
            arrowContainer.style.transform = '';
            arrowContainer.style.zIndex = '';
            arrowContainer.style.left = '';
            titleEp.style.marginLeft = '';
        }
    }
}

async function fetchMovieData() {
    const slug = getSlug();
    if (!slug) {
        document.getElementById('titleMain').innerText = "Chưa chọn phim (Thiếu slug)";
        return;
    }
    try {
        const response = await fetch(`https://phimapi.com/phim/${slug}`);
        const json = await response.json();
        if (json.status) {
            movieData = json;
            renderUI(json);
        } else {
            document.getElementById('titleMain').innerText = "Không tìm thấy phim!";
        }
    } catch (e) { console.error(e); }
}

async function fetchRankingData() {
    try {
        const res = await fetch('top-bang-xep-hang.json');
        const data = await res.json();
        if (Array.isArray(data)) {
            renderRanking(data);
        }
    } catch (e) { console.error("Lỗi tải bảng xếp hạng:", e); }
}

function renderRanking(items) {
    const container = document.getElementById('rankingList');
    container.innerHTML = '';
    items.forEach((item, index) => {
        const rankNum = index + 1;
        let rankClass = 'normal';
        if (rankNum === 1) rankClass = 'top1';
        else if (rankNum === 2) rankClass = 'top2';
        else if (rankNum === 3) rankClass = 'top3';

        const div = document.createElement('div');
        div.className = 'rank-item';
        div.onclick = () => { window.location.href = `play.html?${item.slug}`; };
        div.innerHTML = `
            <div class="rank-header-row">
                <span class="rank-num ${rankClass}">${rankNum}</span>
                <span class="rank-name">${item.name}</span>
            </div>
            <img class="rank-poster-img" src="${item.poster_url}" alt="${item.name}" loading="lazy" />
        `;
        container.appendChild(div);
    });
}

function renderUI(data) {
    const movie = data.movie;
    const episodes = data.episodes;

    const titleMain = document.getElementById('titleMain');
    titleMain.innerText = movie.name || "Chưa có tên";
    titleMain.href = `album.html?${movie.slug}`;

    document.getElementById('titleEp').innerText = "Tập 1";

    const sideTitle = document.getElementById('sideTitle');
    sideTitle.innerText = movie.name;
    sideTitle.href = `album.html?${movie.slug}`;

    setTimeout(updateTitleLayout, 0);

    const queryName = movie.origin_name || movie.name;
    getTmdbRating(queryName);

    document.getElementById('movieYear').innerText = movie.year || "----";
    document.getElementById('totalEp').innerText = movie.episode_total ? `${movie.episode_total} tập` : "";
    document.getElementById('movieContent').innerText = movie.content || "";

    setTimeout(checkDescriptionOverflow, 100);

    const tagContainer = document.getElementById('tagList');
    tagContainer.innerHTML = '';
    if (movie.category) movie.category.forEach(c => tagContainer.innerHTML += `<div class="tag-box">${c.name}</div>`);
    if (movie.country) movie.country.forEach(c => tagContainer.innerHTML += `<div class="tag-box">${c.name}</div>`);

    if (movie.actor) renderCast(movie.actor);

    if (episodes && episodes.length > 0) {
        renderServerSelect(episodes);
        if (episodes[0].server_data && episodes[0].server_data.length > 0) {
            initPlayer(episodes[0].server_data[0].link_m3u8, '');
        }
    }
}

function checkDescriptionOverflow() {
    const wrapper = document.getElementById('descWrapper');
    const content = wrapper.querySelector('.desc-content');
    const showBtn = document.getElementById('showMoreBtn');
    const collapseBtn = document.getElementById('collapseBtn');

    wrapper.classList.remove('expanded');
    wrapper.classList.add('collapsed');
    showBtn.classList.remove('show');
    collapseBtn.classList.remove('show');

    if (content.scrollHeight > content.clientHeight) {
        showBtn.classList.add('show');
    } else {
        wrapper.classList.remove('collapsed');
    }
}

async function getTmdbRating(query) {
    if (!query) return;
    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            const bestMatch = data.results[0];
            // Nếu có kết quả nhưng chưa có vote (0), vẫn hiển thị 0.0
            document.getElementById('ratingScore').innerText = bestMatch.vote_average ? bestMatch.vote_average.toFixed(1) : '0.0';
            document.getElementById('ratingCount').innerText = `(${bestMatch.vote_count || 0} người đã đánh giá)`;
        } else {
            // Không tìm thấy phim
            document.getElementById('ratingScore').innerText = '0.0';
            document.getElementById('ratingCount').innerText = '(0 người đã đánh giá)';
        }
    } catch (e) {
        // Lỗi kết nối
        document.getElementById('ratingScore').innerText = '0.0';
        document.getElementById('ratingCount').innerText = '(0 người đã đánh giá)';
    }
}

async function renderCast(actors) {
    const slider = document.getElementById('actorSlider');
    slider.innerHTML = '';
    const defaultAvatar = 'IMG/default_avatar.png';
    for (const name of actors) {
        const item = document.createElement('div');
        item.className = 'actor-item';
        item.innerHTML = `
            <div class="actor-img-box">
                <img class="actor-img" src="${defaultAvatar}" onerror="this.onerror=null;this.src='${defaultAvatar}';" alt="${name}">
            </div>
            <div class="actor-info">
                <div class="actor-name">${name}</div>
                <div class="actor-role">Diễn viên</div>
            </div>
        `;
        slider.appendChild(item);
        searchPersonTMDB(name).then(imgUrl => {
            if (imgUrl) {
                const imgEl = item.querySelector('.actor-img');
                if (imgEl) imgEl.src = imgUrl;
            }
        });
    }
    setupCarousel('actorSlider', 'actorPrevBtn', 'actorNextBtn', 7);
}

async function searchPersonTMDB(name) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(name)}`);
        const data = await res.json();
        if (data.results && data.results.length > 0 && data.results[0].profile_path) {
            return `https://image.tmdb.org/t/p/w200${data.results[0].profile_path}`;
        }
    } catch (e) { }
    return null;
}

function renderServerSelect(episodes) {
    const select = document.getElementById('serverSelect');
    select.innerHTML = '';
    episodes.forEach((server, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = server.server_name;
        select.appendChild(option);
    });
    select.addEventListener('change', (e) => {
        renderEpisodeGrid(episodes[e.target.value].server_data);
    });
    renderEpisodeGrid(episodes[0].server_data);
}

function renderEpisodeGrid(serverData) {
    currentServerData = serverData;
    const grid = document.getElementById('epGrid');
    const range = document.getElementById('epRange');
    grid.innerHTML = '';

    if (!serverData) return;

    const first = serverData[0].name.replace('Tập ', '').replace('Full', '').trim();
    const last = serverData[serverData.length - 1].name.replace('Tập ', '').replace('Full', '').trim();
    range.innerText = `Chọn tập ${first}-${last}`;

    if (isThumbnailMode) {
        grid.classList.add('thumbnail-view');
        grid.style.gridTemplateColumns = 'none';

        const movieName = movieData.movie.name || "Phim";
        const thumbUrl = movieData.movie.thumb_url || movieData.movie.poster_url;

        serverData.forEach((ep, index) => {
            const div = document.createElement('div');
            div.className = 'ep-thumb-item';
            
            const currentTitle = document.getElementById('titleEp').innerText;
            if (ep.name === currentTitle) {
                div.classList.add('selected');
            }

            div.innerHTML = `
                <div class="ep-thumb-img-box">
                    <img class="ep-thumb-img" src="${thumbUrl}" alt="${ep.name}" loading="lazy" onerror="this.src='IMG/default_poster.png'">
                </div>
                <div class="ep-thumb-name">${movieName} ${ep.name}</div>
            `;

            div.onclick = () => {
                document.querySelectorAll('.ep-thumb-item').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                document.getElementById('titleEp').innerText = ep.name;
                switchVideo(ep.link_m3u8);
            };
            grid.appendChild(div);
        });

    } else {
        grid.classList.remove('thumbnail-view');
        grid.style.gridTemplateColumns = '';

        serverData.forEach((ep, index) => {
            const div = document.createElement('div');
            div.className = 'ep-item';
            const currentTitle = document.getElementById('titleEp').innerText;
            if (ep.name === currentTitle) div.classList.add('selected');

            div.innerText = ep.name.replace('Tập ', '').replace('Full', '').trim();
            div.onclick = () => {
                document.querySelectorAll('.ep-item').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                document.getElementById('titleEp').innerText = ep.name;
                switchVideo(ep.link_m3u8);
            };
            grid.appendChild(div);
        });
    }
}

function initPlayer(url, poster) {
    if (art) art.destroy();
    art = new Artplayer({
        container: '.artplayer-app',
        url: url,
        poster: poster,
        volume: 0.5,
        isLive: false,
        muted: false,
        autoplay: true,
        autoSize: false,
        pip: true,
        autoMini: false,
        screenshot: true,
        setting: true,
        loop: false,
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        fullscreen: true,
        fullscreenWeb: true,
        subtitleOffset: true,
        miniProgressBar: true,
        mutex: true,
        backdrop: true,
        playsInline: true,
        autoPlayback: true,
        airplay: true,
        theme: '#1cc749',
        lang: 'vi',
        customType: {
            m3u8: function (video, url) {
                if (Hls.isSupported()) {
                    const hls = new Hls();
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url;
                }
            },
        },
    });
}

function switchVideo(url) {
    art.switchUrl(url);
    art.play();
}

const descWrapper = document.getElementById('descWrapper');
const showMoreBtn = document.getElementById('showMoreBtn');
const collapseBtn = document.getElementById('collapseBtn');

if (showMoreBtn) {
    showMoreBtn.onclick = () => {
        descWrapper.classList.remove('collapsed');
        descWrapper.classList.add('expanded');
        showMoreBtn.classList.remove('show');
        collapseBtn.classList.add('show');
    };
}

if (collapseBtn) {
    collapseBtn.onclick = () => {
        descWrapper.classList.remove('expanded');
        descWrapper.classList.add('collapsed');
        collapseBtn.classList.remove('show');
        showMoreBtn.classList.add('show');
    };
}

function formatRecEpisode(epStr) {
    if (!epStr) return "";
    const lowerEp = epStr.toLowerCase().trim();
    if (lowerEp === 'full') return "Trọn bộ";
    if (lowerEp.includes('hoàn tất')) {
        const match = epStr.match(/\((\d+)/);
        return (match && match[1]) ? `Trọn bộ ${match[1]} tập` : "Trọn bộ";
    }
    if (lowerEp.startsWith('tập')) return `Cập nhật tới ${lowerEp}`;
    return epStr;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function fetchRecommendations() {
    const grid = document.getElementById('recommendGrid');
    try {
        const [res1, res2] = await Promise.all([
            fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2?page=1'),
            fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2?page=3')
        ]);
        const data1 = await res1.json();
        const data2 = await res2.json();
        
        let allItems = [...(data1.items || []), ...(data2.items || [])];
        allItems = shuffleArray(allItems).slice(0, 18);

        if (allItems.length > 0) {
            grid.innerHTML = '';
            allItems.forEach(movie => {
                const epText = formatRecEpisode(movie.episode_current);
                const card = document.createElement('div');
                card.className = 'rec-movie-card';
                card.onclick = () => { window.location.href = `play.html?${movie.slug}`; };

                card.innerHTML = `
                    <div class="rec-poster-wrapper">
                        <img class="rec-poster-img" src="${movie.poster_url}" alt="${movie.name}" loading="lazy">
                        <div class="rec-poster-overlay"></div>
                        <div class="rec-episode-tag">${epText}</div>
                        <div class="rec-play-btn">${playSvg}</div>
                        <div class="rec-collection-btn">
                            ${collectionSvg}
                            <div class="rec-tooltip-text">Sưu tập</div>
                        </div>
                    </div>
                    <div class="rec-movie-title">${movie.name}</div>
                `;
                grid.appendChild(card);
            });
            setupCarousel('recommendGrid', 'recPrevBtn', 'recNextBtn', 6);
        } else {
            grid.innerHTML = '<div style="padding:20px;">Không có đề xuất.</div>';
        }

    } catch (e) {
        console.error(e);
        grid.innerHTML = '<div style="padding:20px;">Lỗi tải đề xuất.</div>';
    }
}

function setupCarousel(containerId, prevBtnId, nextBtnId, itemsPerScroll) {
    const container = document.getElementById(containerId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    if (!container || !prevBtn || !nextBtn) return;

    const checkScroll = () => {
        if (container.scrollLeft <= 5) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }
        if(Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth - 5) {
             nextBtn.classList.add('hidden');
        } else {
             nextBtn.classList.remove('hidden');
        }
    };

    const getScrollAmount = () => {
        const firstItem = container.firstElementChild;
        if (!firstItem) return 0;
        
        const style = window.getComputedStyle(container);
        const gap = parseFloat(style.gap) || 0;
        const itemWidth = firstItem.getBoundingClientRect().width;
        
        return (itemWidth + gap) * itemsPerScroll;
    };

    nextBtn.onclick = () => { container.scrollBy({ left: getScrollAmount(), behavior: 'smooth' }); };
    prevBtn.onclick = () => { container.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }); };
    
    container.addEventListener('scroll', checkScroll);
    setTimeout(checkScroll, 200); 
}

function handleResponsiveLayout() {
    const width = window.innerWidth;
    
    // Các phần tử cần di chuyển
    const recSec = document.getElementById('recommendSection');
    const listBox = document.getElementById('box-list');
    const infoBox = document.getElementById('box-info'); // Cha của Rec ở PC
    const actionBar = document.getElementById('videoActionBar');
    const videoArea = document.getElementById('box-player'); // Cha của Action ở PC
    const rankBox = document.getElementById('box-rank'); 
    const bottomSection = document.querySelector('.bottom-section'); // Cha của Rank ở PC

    if (width <= 1480) {
        // --- MOBILE LOGIC ---
        // 1. Action Bar lên trước List
        if (listBox && actionBar && listBox.parentNode) {
             listBox.parentNode.insertBefore(actionBar, listBox);
        }
        
        // 2. Recommend lên sau List (TRƯỚC Rank)
        if (listBox && recSec && listBox.parentNode) {
             listBox.parentNode.insertBefore(recSec, listBox.nextSibling);
        }

        // 3. Rank xuống sau Recommend (Ở CUỐI CÙNG)
        if (recSec && rankBox && recSec.parentNode) {
            recSec.parentNode.insertBefore(rankBox, recSec.nextSibling);
        }

    } else {
        // --- PC LOGIC (RESTORE) ---
        // 1. Trả Recommend về Box Info (cuối box)
        if (infoBox && recSec) {
             infoBox.appendChild(recSec);
        }

        // 2. Trả Action Bar về Video Area (cuối box)
        if (videoArea && actionBar) {
            videoArea.appendChild(actionBar);
        }

        // 3. Trả Ranking Box về Bottom Section
        if (bottomSection && rankBox) {
            bottomSection.appendChild(rankBox);
        }
    }
}

window.addEventListener('load', handleResponsiveLayout);
window.addEventListener('resize', handleResponsiveLayout);
window.addEventListener('resize', checkDescriptionOverflow);
window.addEventListener('resize', updateTitleLayout);

// INIT
fetchMovieData();
fetchRankingData();
fetchRecommendations();