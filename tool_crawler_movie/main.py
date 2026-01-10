import requests
import time
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime

# --- CẤU HÌNH KEY ---
KEY_DATA = {
  "type":"REDACTED",
  "project_id": "groovy-datum-433810-k4",
  "private_key_id": "369fb65ded611adb8c459c930aa57c0b6323ab43",
  "private_key":"REDACTED",
  "client_email":"REDACTED
  "client_id": "108656875041815180015",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/iqyi-2707%40groovy-datum-433810-k4.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

# Tên Sheet
SHEET_NAME = 'GGSHEET_API_MOVIE' 

# API URLs
API_LIST = "https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2"
API_DETAIL = "https://phimapi.com/phim"
API_NGUONC = "https://phim.nguonc.com/api/film"
API_OPHIM = "https://ophim1.com/v1/api/phim"

def setup_google_sheet():
    scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
    try:
        creds = ServiceAccountCredentials.from_json_keyfile_dict(KEY_DATA, scope)
        client = gspread.authorize(creds)
        sheet = client.open(SHEET_NAME).sheet1
        return sheet
    except Exception as e:
        print(f"LỖI KẾT NỐI SHEET: {e}")
        return None

def load_existing_data(sheet):
    print("Đang đọc dữ liệu cũ để lấy số thứ tự (ID)...")
    existing_db = {}
    max_id = 0
    try:
        all_values = sheet.get_all_values()
        
        for idx, row in enumerate(all_values[1:], start=2):
            if len(row) > 16: 
                raw_id = row[0]
                current_id = 0
                if raw_id.isdigit():
                    current_id = int(raw_id)
                    if current_id > max_id:
                        max_id = current_id
                
                slug = row[2] 
                
                # Logic lấy Time:
                # Cấu trúc mới: ... P(Content) | Q(EpTotal) | R(Lang) | S(Hot) | T(Time)
                # T là cột thứ 20 -> index 19
                try:
                    modified_time = row[19] if len(row) > 19 else ""
                except:
                    modified_time = ""

                if slug:
                    existing_db[slug] = {
                        'row': idx,
                        'time': modified_time,
                        'id': current_id
                    }
    except Exception as e:
        print(f"Lỗi đọc dữ liệu: {e}")
        
    return existing_db, max_id

# --- LOGIC XỬ LÝ LINK MỚI ---
def get_prefix(server_name):
    name_lower = server_name.lower()
    if "vietsub" in name_lower: return "[SV]"
    if "lồng tiếng" in name_lower: return "[LT]"
    if "thuyết minh" in name_lower: return "[TM]"
    return "" 

# --- API HELPERS ---
def get_nguonc_embed(slug):
    results = []
    try:
        resp = requests.get(f"{API_NGUONC}/{slug}", timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            if data.get('status') == 'success':
                episodes = data.get('movie', {}).get('episodes', [])
                for ep_server in episodes:
                    sv_name = ep_server.get('server_name', '')
                    prefix = get_prefix(sv_name)
                    
                    if prefix:
                        for item in ep_server.get('items', []):
                            ep_name = item.get('name', '').strip()
                            link = item.get('embed', '').strip()
                            if link:
                                results.append(f"{prefix} Tập {ep_name} {link}")
    except: pass
    return "\n".join(results)

def get_ophim_m3u8(slug):
    results = []
    try:
        resp = requests.get(f"{API_OPHIM}/{slug}", timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            if data.get('status') == 'success':
                episodes = data.get('data', {}).get('item', {}).get('episodes', [])
                for ep_server in episodes:
                    sv_name = ep_server.get('server_name', '')
                    prefix = get_prefix(sv_name)
                    
                    if prefix:
                        for item in ep_server.get('server_data', []):
                            ep_name = item.get('name', '').strip()
                            link = item.get('link_m3u8', '').strip()
                            if link:
                                results.append(f"{prefix} Tập {ep_name} {link}")
    except: pass
    return "\n".join(results)

def get_phimapi_detail(slug):
    try:
        resp = requests.get(f"{API_DETAIL}/{slug}", timeout=10)
        return resp.json() if resp.status_code == 200 else None
    except: return None

def process_movie_data(api_data, custom_id):
    if not api_data or not api_data.get('status'): return None

    movie = api_data.get('movie', {})
    slug = movie.get('slug', '')
    episodes = api_data.get('episodes', [])

    bole = 1 if movie.get('type') == 'single' else 2

    countries = ", ".join([c['name'] for c in movie.get('country', [])])
    categories = ", ".join([c['name'] for c in movie.get('category', [])])
    actors = ", ".join(movie.get('actor', []))
    director = ", ".join(movie.get('director', []))

    tmdb_id = ""
    tmdb_data = movie.get('tmdb')
    if tmdb_data and isinstance(tmdb_data, dict):
        raw_tmdb_id = tmdb_data.get('id')
        if raw_tmdb_id: tmdb_id = str(raw_tmdb_id)

    # --- XỬ LÝ LIST TẬP PHIM (PHIM API) ---
    kk_list = []
    if episodes:
        for ep_server in episodes:
            sv_name = ep_server.get('server_name', '')
            prefix = get_prefix(sv_name)
            
            if prefix:
                for item in ep_server.get('server_data', []):
                    ep_name = item.get('name', '').strip()
                    link = item.get('link_m3u8', '').strip()
                    if link:
                        kk_list.append(f"{prefix} {ep_name} {link}")
    
    kk_m3u8 = "\n".join(kk_list)
    # --------------------------------------

    nguonc_embed = get_nguonc_embed(slug)
    ophim_m3u8 = get_ophim_m3u8(slug)

    # TRẢ VỀ DANH SÁCH CỘT (CẬP NHẬT Q, R, S, T)
    return [
        custom_id,                    # A
        tmdb_id,                      # B
        slug,                         # C
        movie.get('name', ''),        # D
        movie.get('origin_name', ''), # E
        movie.get('poster_url', ''),  # F 
        movie.get('thumb_url', ''),   # G 
        bole,                         # H
        movie.get('year', ''),        # I
        countries,                    # J
        categories,                   # K
        actors,                       # L 
        director,                     # M 
        movie.get('episode_current', ''), # N 
        movie.get('time', ''),        # O
        movie.get('content', ''),     # P
        movie.get('episode_total', ''), # Q (NEW - TỔNG TẬP)
        movie.get('lang', ''),          # R (NEW - NGÔN NGỮ)
        "",                             # S (NEW - HOT - Để trống cho user nhập)
        movie.get('modified', {}).get('time', ''), # T (Đẩy Time sang đây)
        kk_m3u8,       # U (Link 1)
        nguonc_embed,  # V (Link 2)
        ophim_m3u8     # W (Link 3)
    ]

def get_total_pages():
    try:
        resp = requests.get(f"{API_LIST}?page=1", timeout=10)
        return resp.json()['pagination']['totalPages'] if resp.status_code == 200 else 0
    except: return 0

# --- HÀM XỬ LÝ CHUNG CHO 1 PHIM ---
def handle_single_movie(sheet, existing_db, slug, api_time, id_counter):
    need_process = False
    is_update = False
    row_index = -1
    use_id = 0

    if slug not in existing_db:
        need_process = True
        id_counter += 1
        use_id = id_counter
        print(f"\n[+] New ID {use_id}: {slug}", end="")
    else:
        old_info = existing_db[slug]
        if not api_time or api_time != old_info['time']:
            need_process = True
            is_update = True
            row_index = old_info['row']
            use_id = old_info['id']
            print(f"\n[*] Upd ID {use_id}: {slug}", end="")
        else:
            print(f"\n[-] Skip (No change): {slug}", end="")

    if need_process:
        detail = get_phimapi_detail(slug)
        if not detail:
            print(" -> Lỗi lấy API Detail.")
            return None, False

        real_time = detail.get('movie', {}).get('modified', {}).get('time', '')
        row_data = process_movie_data(detail, use_id)
        
        if row_data:
            if is_update:
                try:
                    # UPDATE range mở rộng đến W
                    sheet.update(f"A{row_index}:W{row_index}", [row_data])
                    existing_db[slug]['time'] = real_time
                    print(" -> Xong.")
                    return None, True
                except Exception as e: 
                    print(f" -> Err Upd: {e}")
            else:
                try:
                    sheet.append_row(row_data)
                    existing_db[slug] = {'row': 0, 'time': real_time, 'id': use_id}
                    print(" -> Xong.")
                    return {'slug': slug, 'data': row_data}, True
                except Exception as e:
                    print(f" -> Err Add: {e}")
    
    return None, False

def main():
    print("--- TOOL UPDATE MOVIE (WITH EP_TOTAL, LANG) ---")
    sheet = setup_google_sheet()
    if not sheet: return

    existing_db, current_max_id = load_existing_data(sheet)
    print(f"-> Max ID: {current_max_id}")
    print(f"-> Total DB: {len(existing_db)}")

    print("\nCHỌN CHẾ ĐỘ:")
    print("1. Tự động quét (Auto Update)")
    print("2. Nhập link thủ công (Manual Input)")
    choice = input("Nhập số (1 hoặc 2): ").strip()

    if choice == '2':
        # --- CHẾ ĐỘ THỦ CÔNG ---
        while True:
            raw_link = input("\nNhập Link phim (hoặc 'exit' để thoát): ").strip()
            if raw_link.lower() == 'exit': break
            if not raw_link: continue

            slug = raw_link.rstrip('/').split('/')[-1]
            print(f"-> Đang xử lý slug: {slug}")
            
            handle_single_movie(sheet, existing_db, slug, None, current_max_id)
            
            if slug in existing_db and existing_db[slug]['id'] > current_max_id:
                current_max_id = existing_db[slug]['id']

    else:
        # --- CHẾ ĐỘ AUTO ---
        total_pages = get_total_pages()
        print(f"-> Tổng API: {total_pages} trang.")
        
        id_counter = current_max_id

        for page in range(total_pages, 0, -1):
            print(f"\n>> Page {page}...", end=" ")
            try:
                resp = requests.get(f"{API_LIST}?page={page}", timeout=15)
                if resp.status_code == 200:
                    items = resp.json().get('items', [])
                    rows_to_add = []
                    
                    for item in items:
                        slug = item.get('slug')
                        api_time = item.get('modified', {}).get('time', '')
                        if not slug: continue

                        need_process = False
                        is_update = False
                        row_index = -1
                        use_id = 0

                        if slug not in existing_db:
                            need_process = True
                            id_counter += 1
                            use_id = id_counter
                            print(f"\n[+] New ID {use_id}: {slug}", end="")
                        else:
                            old_info = existing_db[slug]
                            if api_time != old_info['time']:
                                need_process = True
                                is_update = True
                                row_index = old_info['row']
                                use_id = old_info['id']
                                print(f"\n[*] Upd ID {use_id}: {slug}", end="")

                        if need_process:
                            detail = get_phimapi_detail(slug)
                            row_data = process_movie_data(detail, use_id)
                            
                            if row_data:
                                if is_update:
                                    try:
                                        # UPDATE range mở rộng đến W
                                        sheet.update(f"A{row_index}:W{row_index}", [row_data])
                                        existing_db[slug]['time'] = api_time
                                    except Exception as e: print(f"Err Upd: {e}")
                                    time.sleep(1)
                                else:
                                    rows_to_add.append(row_data)
                                    existing_db[slug] = {'row': 0, 'time': api_time, 'id': use_id}
                                    time.sleep(0.1)

                    if rows_to_add:
                        try:
                            sheet.append_rows(rows_to_add)
                            print(f"\n-> Added {len(rows_to_add)} movies.")
                        except:
                            time.sleep(60)
                            try: sheet.append_rows(rows_to_add)
                            except: pass
                else:
                    print(" [Lỗi API List]")
            except Exception as e:
                print(f" [Lỗi Mạng] {e}")
            time.sleep(1)

    print("\n--- DONE ---")

if __name__ == "__main__":
    main()