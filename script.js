// --- SLIDER LOGIC ---
const slides = [
    {
        bg: "https://pic8.iqiyipic.com/hamster/20251204/93/2e/1ea7bdcd1a_1808_1017.webp",
        char: "https://pic2.iqiyipic.com/hamster/20251204/03/5b/eaa625ee79_xxx.webp",
        titleImg: "https://pic9.iqiyipic.com/hamster/20251204/04/b8/d3cc7554c9_xxx.webp",
        titleText: "Song Quỹ",
        score: "9.7",
        year: "2025",
        tags: "Lãng Mạn | Thuyết Minh",
        desc: "Song Quỹ được chuyển thể từ tiểu thuyết cùng tên. Khương Mộ và Cận Triêu từ hai đường thẳng song song đã tìm thấy nhau giữa dòng đời tấp nập."
    },
    {
        bg: "https://pic0.iqiyipic.com/hamster/20251125/3d/65/30d4314364_1808_1017.webp",
        char: "https://pic6.iqiyipic.com/hamster/20251024/a2/a2/3378063b78_xxx.webp",
        titleImg: "https://pic4.iqiyipic.com/hamster/20251024/15/c9/df35033d30_xxx.webp",
        titleText: "Thiên Địa Ký Tâm",
        score: "9.8",
        year: "2024",
        tags: "Cổ Trang | Kiếm Hiệp",
        desc: "Một câu chuyện về điệp viên và tình yêu đầy trắc trở trong giới giang hồ. Cung Tử Vũ và Vân Vi Sam cùng nhau đối mặt với những âm mưu thâm độc."
    }
];

let currentIndex = 0;
const wrapper = document.getElementById('sliderWrapper');
const paginationWrapper = document.getElementById('sliderPagination');
let autoPlayInterval;
const isMobile = window.innerWidth <= 768;

function initSlider() {
    wrapper.innerHTML = '';
    createPaginationDots();
    slides.forEach((slide, index) => {
        const isActive = index === 0 ? 'active' : '';
        const tagsArray = slide.tags.split('|');
        let badgesHTML = `<div class="badges-container">${tagsArray.map(tag => `<span class="badge">${tag.trim()}</span>`).join('')}</div>`;
        // UPDATE: SVG size is controlled by CSS class .score-icon, attributes here are backup
        const starIcon = `<svg class="score-icon" width="14px" height="14px" viewBox="0 0 28 27" xmlns="http://www.w3.org/2000/svg"><g fill="#1CC749"><path d="M16.7983826,2.56356746 L19.7968803,11.2875241 L29.1657516,11.3941138 C29.9719564,11.4033379 30.3057022,12.4128653 29.6590696,12.8853446 L22.1424877,18.3829131 L24.9344802,27.1724634 C25.17436,27.9288402 24.3014061,28.55198 23.643301,28.0938493 L16.0005215,22.7674392 L8.35669898,28.0928244 C7.69963687,28.5509551 6.82563997,27.9267904 7.06551979,27.1714385 L9.85751226,18.3818882 L2.34093036,12.8843197 C1.69429781,12.4118404 2.02804364,11.402313 2.83424842,11.3930889 L12.2031197,11.2864992 L15.2016174,2.56254256 C15.4602704,1.81231509 16.5407725,1.81231509 16.7983826,2.56356746 Z"/></g></svg>`;

        const slideHTML = `
            <div class="slide-item" data-index="${index}">
                <div class="slide-bg ${isActive}" style="background-image: url('${slide.bg}')"></div>
                <div class="slide-character-container ${isActive}">
                    <div class="slide-character" style="background-image: url('${slide.char}')"></div>
                </div>
                <div class="slide-info ${isActive}">
                    <div class="info-content-wrapper">
                        ${slide.titleImg ? `<div class="title-img" style="background-image: url('${slide.titleImg}')"></div>` : `<h1>${slide.titleText}</h1>`}
                        ${badgesHTML}
                        <div class="meta-tags">
                            ${starIcon}
                            <span class="score">${slide.score}</span>
                            <span class="divider">|</span>
                            <span>${slide.year}</span>
                            <span class="divider">|</span>
                            <span>${slide.tags}</span>
                        </div>
                        <div class="description">${slide.desc}</div>
                    </div>
                </div>
            </div>`;
        wrapper.innerHTML += slideHTML;
    });
    updatePaginationDots();
    resetInterval();
}

function createPaginationDots() {
    paginationWrapper.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('pagination-dot');
        dot.onclick = () => { currentIndex = index; showSlide(currentIndex); resetInterval(); };
        paginationWrapper.appendChild(dot);
    });
}

function updatePaginationDots() {
    const dots = document.querySelectorAll('.pagination-dot');
    dots.forEach((dot, index) => { dot.classList.toggle('active', index === currentIndex); });
}

function showSlide(index) {
    document.querySelectorAll('.slide-bg, .slide-character-container, .slide-info').forEach(el => el.classList.remove('active'));
    const items = document.querySelectorAll('.slide-item');
    if (items[index]) {
        items[index].querySelector('.slide-bg').classList.add('active');
        items[index].querySelector('.slide-character-container').classList.add('active');
        items[index].querySelector('.slide-info').classList.add('active');
    }
    updatePaginationDots();
}

function nextSlide() { currentIndex = (currentIndex + 1) % slides.length; showSlide(currentIndex); resetInterval(); }
function prevSlide() { currentIndex = (currentIndex - 1 + slides.length) % slides.length; showSlide(currentIndex); resetInterval(); }

function resetInterval() {
    clearInterval(autoPlayInterval);
    if (!isMobile) autoPlayInterval = setInterval(nextSlide, 5000);
}

const sliderContainer = document.querySelector('.slider-container');
let touchStartX = 0;
let touchEndX = 0;
sliderContainer.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; clearInterval(autoPlayInterval); }, { passive: true });
sliderContainer.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); resetInterval(); }, { passive: true });
function handleSwipe() {
    if (touchEndX < touchStartX - 50) nextSlide();
    if (touchEndX > touchStartX + 50) prevSlide();
}

// --- HELPER FUNCTIONS ---
function formatEpisodeText(text) {
    if (text.includes('Hoàn Tất')) {
        const match = text.match(/\d+/); 
        const total = match ? match[0] : '';
        return total ? `Trọn bộ ${total} tập` : 'Trọn bộ';
    } else if (text.startsWith('Tập')) {
        return 'Cập nhật ' + text.toLowerCase();
    }
    return text;
}

function setupCarousel(containerId, prevBtnId, nextBtnId) {
    const container = document.getElementById(containerId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    const checkScroll = () => {
        if (container.scrollLeft <= 1) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }
        if(container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
             nextBtn.classList.add('hidden');
        } else {
             nextBtn.classList.remove('hidden');
        }
    };

    const getScrollAmount = () => {
        return container.clientWidth;
    };

    nextBtn.onclick = () => { container.scrollBy({ left: getScrollAmount(), behavior: 'smooth' }); };
    prevBtn.onclick = () => { container.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }); };
    container.addEventListener('scroll', checkScroll);
    
    setTimeout(checkScroll, 100);
}

// --- CACHE & HOVER LOGIC ---
const movieCache = {};
let hoverTimeout;

function attachHoverEvent(card, slug) {
    if (window.innerWidth <= 768) return; 

    card.addEventListener('mouseenter', () => {
        // UPDATE: Giảm delay xuống 50ms (gần như tức thì)
        hoverTimeout = setTimeout(async () => {
            const hoverCard = card.querySelector('.hover-details-card');
            
            const cardRect = card.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const hoverWidth = 300; 

            hoverCard.classList.remove('align-left', 'align-right');

            if (cardRect.left < 100) {
                hoverCard.classList.add('align-left');
            }
            else if (cardRect.right + (hoverWidth/2) > screenWidth) {
                hoverCard.classList.add('align-right');
            }

            if (hoverCard.dataset.loaded === "true") {
                hoverCard.classList.add('active');
                return;
            }

            try {
                let movieData;
                if (movieCache[slug]) {
                    movieData = movieCache[slug];
                } else {
                    const res = await fetch(`https://phimapi.com/phim/${slug}`);
                    const json = await res.json();
                    if(json.status) {
                        movieData = json.movie;
                        movieCache[slug] = movieData;
                    }
                }

                if (movieData) {
                    fillHoverData(hoverCard, movieData);
                    hoverCard.classList.add('active');
                    hoverCard.dataset.loaded = "true";
                }
            } catch (err) {
                console.error("Lỗi hover:", err);
            }

        }, 50); 
    });

    card.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        const hoverCard = card.querySelector('.hover-details-card');
        hoverCard.classList.remove('active');
    });
}

function fillHoverData(hoverCard, movie) {
    const randomRating = (Math.random() * (9.9 - 8.5) + 8.5).toFixed(1);
    const categories = movie.category ? movie.category.slice(0, 3).map(c => `<span class="hover-tag">${c.name}</span>`).join('') : '';
    let content = movie.content ? movie.content.replace(/<[^>]*>?/gm, '') : 'Đang cập nhật nội dung...';
    
    const playSvg = `
        <svg class="hover-btn-icon" viewBox="0 0 60 60"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><circle fill="#1CC749" cx="30" cy="30" r="30"></circle><path d="M35.746,22.494 L45.14,36.586 C46.06,37.964 45.687,39.827 44.308,40.746 C43.815,41.075 43.236,41.25 42.644,41.25 L23.855,41.25 C22.198,41.25 20.855,39.907 20.855,38.25 C20.855,37.658 21.03,37.079 21.36,36.586 L30.754,22.494 C31.673,21.116 33.535,20.743 34.914,21.662 C35.243,21.882 35.526,22.165 35.746,22.494 Z" fill="#000000" transform="translate(33.25, 30.00) rotate(-270.00) translate(-33.25, -30.00) "></path></g></svg>`;
    
    const addSvg = `
        <svg class="hover-btn-icon" viewBox="0 0 60 60"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><circle fill="#FFFFFF" cx="30" cy="30" r="30"></circle><path d="M29.3,17.25 C29.69,17.25 30,17.56 30,17.94 L30,19.39 C30,19.77 29.69,20.08 29.3,20.08 L22.91,20.08 L22.91,39.72 L28.64,34.95 C29.37,34.34 30.41,34.3 31.18,34.82 L31.36,34.95 L37.08,39.72 L37.08,33.52 C37.08,33.14 37.39,32.83 37.77,32.83 L39.22,32.83 C39.6,32.83 39.91,33.14 39.91,33.52 L39.91,41.23 C39.91,42.41 38.96,43.36 37.79,43.36 C37.36,43.36 36.95,43.23 36.6,43 L36.43,42.87 L30,37.51 L23.57,42.87 C22.72,43.57 21.49,43.51 20.72,42.75 L20.57,42.6 C20.3,42.27 20.13,41.87 20.09,41.45 L20.08,41.23 L20.08,20.08 C20.08,18.59 21.24,17.36 22.7,17.25 L22.91,17.25 L29.3,17.25 Z M39.22,17.25 C39.6,17.25 39.91,17.56 39.91,17.94 L39.91,21.5 L43.47,21.5 C43.85,21.5 44.16,21.81 44.16,22.19 L44.16,23.64 C44.16,24.02 43.85,24.33 43.47,24.33 L39.91,24.33 L39.91,27.89 C39.91,28.27 39.6,28.58 39.22,28.58 L37.77,28.58 C37.39,28.58 37.08,28.27 37.08,27.89 L37.08,24.33 L33.52,24.33 C33.14,24.33 32.83,24.02 32.83,23.64 L32.83,22.19 C32.83,21.81 33.14,21.5 33.52,21.5 L37.08,21.5 L37.08,17.94 C37.08,17.56 37.39,17.25 37.77,17.25 L39.22,17.25 Z" fill="#111319" fill-rule="nonzero"></path></g></svg>`;
    
    const html = `
        <div class="hover-thumb-container">
            <img src="${movie.thumb_url || movie.poster_url}" class="hover-thumb-img" alt="${movie.name}">
            <div class="hover-actions">
                ${playSvg}
                ${addSvg}
            </div>
        </div>
        <div class="hover-info">
            <div class="hover-title">${movie.name}</div>
            <div class="hover-meta-row">
                <span class="meta-score">★ ${randomRating}</span>
                <span class="meta-age">T16</span>
                <span class="meta-quality">FHD</span>
                <span class="meta-year" style="color:#ccc;">${movie.year}</span>
            </div>
            <div class="hover-tags">
                ${categories}
                <span class="hover-tag">${movie.country?.[0]?.name || 'Trung Quốc'}</span>
            </div>
            <div class="hover-desc">${content}</div>
            <div class="hover-more-btn">
                Xem thêm <svg style="width:12px;height:12px;fill:#1cc749;margin-left:2px;" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </div>
        </div>
    `;
    hoverCard.innerHTML = html;
}

// --- FETCH NEW MOVIES ---
async function fetchNewMovies() {
    const grid = document.getElementById('newMoviesGrid');
    try {
        const [res1, res2] = await Promise.all([
            fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2?page=1&limit=10'),
            fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2?page=2&limit=10')
        ]);
        const data1 = await res1.json();
        const data2 = await res2.json();
        const allMovies = [...(data1.items || []), ...(data2.items || [])];

        if (allMovies.length > 0) {
            grid.innerHTML = ''; 
            allMovies.forEach(movie => {
                const card = document.createElement('div');
                card.className = 'movie-card';
                card.innerHTML = `
                    <div class="poster-wrapper">
                        <img src="${movie.poster_url}" alt="${movie.name}" class="poster-img" loading="lazy">
                        <span class="episode-tag">${formatEpisodeText(movie.episode_current)}</span>
                    </div>
                    <div class="poster-title">${movie.name}</div>
                    <div class="hover-details-card" data-loaded="false">
                        <div class="loading-text" style="padding:20px; font-size:12px;">Đang tải...</div>
                    </div>
                `;
                card.onclick = () => console.log('Clicked:', movie.name);
                attachHoverEvent(card, movie.slug);
                grid.appendChild(card);
            });
            setupCarousel('newMoviesGrid', 'moviePrevBtn', 'movieNextBtn');
        }
    } catch (error) {
        console.error('Lỗi khi tải phim mới:', error);
    }
}

// --- FETCH ROMANCE MOVIES ---
async function fetchRomanceMovies() {
    const grid = document.getElementById('romanceGrid');
    try {
        const response = await fetch('https://phimapi.com/v1/api/the-loai/tinh-cam?page=1&limit=10');
        const json = await response.json();
        
        const items = json.data?.items || [];
        const imageDomain = json.data?.APP_DOMAIN_CDN_IMAGE || 'https://phimimg.com';

        if (items.length > 0) {
            grid.innerHTML = ''; 
            items.forEach(movie => {
                const posterUrl = `${imageDomain}/${movie.poster_url}`;
                
                const card = document.createElement('div');
                card.className = 'movie-card';
                card.innerHTML = `
                    <div class="poster-wrapper">
                        <img src="${posterUrl}" alt="${movie.name}" class="poster-img" loading="lazy">
                        <span class="episode-tag">${formatEpisodeText(movie.episode_current)}</span>
                    </div>
                    <div class="poster-title">${movie.name}</div>
                    <div class="hover-details-card" data-loaded="false">
                        <div class="loading-text" style="padding:20px; font-size:12px;">Đang tải...</div>
                    </div>
                `;
                card.onclick = () => console.log('Clicked Romance:', movie.name);
                attachHoverEvent(card, movie.slug);
                grid.appendChild(card);
            });
            setupCarousel('romanceGrid', 'romancePrevBtn', 'romanceNextBtn');
        } else {
            grid.innerHTML = '<div class="loading-text">Không có phim tình cảm nào.</div>';
        }
    } catch (error) {
        console.error('Lỗi khi tải phim tình cảm:', error);
        grid.innerHTML = '<div class="loading-text">Lỗi tải dữ liệu.</div>';
    }
}


// --- FETCH TOP TRENDING ---
const mutedColors = [
    'rgba(47, 79, 79, 0.9)',    // Dark Slate Gray
    'rgba(85, 107, 47, 0.9)',   // Dark Olive Green
    'rgba(72, 61, 139, 0.9)',   // Dark Slate Blue
    'rgba(139, 0, 0, 0.8)',     // Dark Red (Muted)
    'rgba(0, 128, 128, 0.9)',   // Teal
    'rgba(128, 0, 128, 0.8)',   // Purple (Muted)
    'rgba(160, 82, 45, 0.9)',   // Sienna
    'rgba(25, 25, 112, 0.9)'    // Midnight Blue
];

async function fetchTopTrending() {
    const grid = document.getElementById('topTrendingGrid');
    try {
        const response = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2?page=1&limit=10');
        const data = await response.json();
        let items = data.items || [];

        if (items.length > 0) {
            items.sort(() => 0.5 - Math.random());
            const topItems = items.slice(0, 16); 

            grid.innerHTML = '';
            topItems.forEach((movie, index) => {
                const rank = index + 1;
                const rankClass = rank === 1 ? 'rank-text rank-1' : 'rank-text';
                const randomColor = mutedColors[Math.floor(Math.random() * mutedColors.length)];

                const card = document.createElement('div');
                card.className = 'movie-card movie-card--trending'; 
                card.style.setProperty('--overlay-color', randomColor);
                
                card.innerHTML = `
                    <div class="poster-wrapper">
                        <img src="${movie.poster_url}" alt="${movie.name}" class="poster-img" loading="lazy">
                    </div>
                    
                    <div class="trending-info-box">
                        <div class="${rankClass}">TOP ${rank}</div>
                        <div class="poster-title">${movie.name}</div>
                        <div class="episode-status">${formatEpisodeText(movie.episode_current)}</div>
                    </div>

                    <div class="hover-details-card" data-loaded="false">
                        <div class="loading-text" style="padding:20px; font-size:12px;">Đang tải...</div>
                    </div>
                `;
                card.onclick = () => console.log('Clicked Top:', movie.name);
                attachHoverEvent(card, movie.slug);
                grid.appendChild(card);
            });
            setupCarousel('topTrendingGrid', 'topPrevBtn', 'topNextBtn');
        }
    } catch (error) {
        console.error('Lỗi khi tải top trending:', error);
        grid.innerHTML = '<div class="loading-text">Không tải được top thịnh hành.</div>';
    }
}

// --- INIT ---
initSlider();
fetchNewMovies();
fetchRomanceMovies(); 
fetchTopTrending();