# import requests
# import sqlite3
# import time
# from bs4 import BeautifulSoup
# from datetime import datetime

# BASE_URL = "https://hub.villageofwisdom.org/library/?jsf_ajax=1"

# HEADERS = {
#     "User-Agent": "Mozilla/5.0 (compatible; LibraryScraper/1.0)"
# }

# CONTENT_TYPES = [
#     "lesson-plan",
#     "video",
#     "toolkit",
#     "infographic",
#     "website",
#     "article",
#     "image",
#     "activity",
# ]

# # ---------------------------
# # Database setup
# # ---------------------------

# conn = sqlite3.connect("library.db")
# cursor = conn.cursor()

# cursor.execute("""
# CREATE TABLE IF NOT EXISTS library_items (
#     id INTEGER PRIMARY KEY AUTOINCREMENT,
#     title TEXT,
#     url TEXT UNIQUE,
#     content_type TEXT,
#     html TEXT,
#     scraped_at TEXT
# )
# """)

# conn.commit()

# # ---------------------------
# # Payload builder
# # ---------------------------


# def build_payload(page: int, content_type: str):
#     return {
#         "action": "jet_smart_filters",
#         "provider": "jet-engine/listing",
#         "query[_meta_query_type]": content_type,
#         "defaults[post_status][]": "publish",
#         "defaults[post_type][]": "library",
#         "defaults[posts_per_page]": 20,
#         "defaults[paged]": page,
#         "defaults[ignore_sticky_posts]": 1,
#         "settings[lisitng_id]": 6497,
#         "settings[posts_num]": 20,
#         "settings[max_posts_num]": 9,
#         "settings[use_custom_post_types]": "yes",
#         "settings[custom_post_types][]": "library",
#     }

# # ---------------------------
# # Fetch one page
# # ---------------------------


# def fetch_page(payload):
#     r = requests.post(BASE_URL, headers=HEADERS, data=payload, timeout=15)
#     r.raise_for_status()
#     return r.json()

# # ---------------------------
# # Parse listing HTML
# # ---------------------------


# def parse_items(html):
#     soup = BeautifulSoup(html, "html.parser")
#     items = []

#     for card in soup.select(".jet-listing-grid__item"):
#         link = card.select_one("a")
#         title_el = card.select_one("h2, h3, h4")

#         url = link["href"] if link and link.has_attr("href") else None
#         title = title_el.get_text(strip=True) if title_el else None

#         if url:
#             items.append({
#                 "title": title,
#                 "url": url,
#                 "html": str(card)
#             })

#     return items

# # ---------------------------
# # Save item
# # ---------------------------


# def save_item(item, content_type):
#     cursor.execute("""
#         INSERT OR IGNORE INTO library_items
#         (title, url, content_type, html, scraped_at)
#         VALUES (?, ?, ?, ?, ?)
#     """, (
#         item["title"],
#         item["url"],
#         content_type,
#         item["html"],
#         datetime.utcnow().isoformat()
#     ))
#     conn.commit()

# # ---------------------------
# # Main scrape loop
# # ---------------------------


# def scrape():
#     for content_type in CONTENT_TYPES:
#         print(f"\n📂 Scraping type: {content_type}")
#         page = 1

#         while True:
#             payload = build_payload(page, content_type)
#             data = fetch_page(payload)

#             html = data.get("content", "")
#             pagination = data.get("pagination", {})
#             max_pages = pagination.get("max_num_pages", 1)

#             items = parse_items(html)
#             print(f"  • Page {page}/{max_pages} → {len(items)} items")

#             for item in items:
#                 save_item(item, content_type)

#             if page >= max_pages:
#                 break

#             page += 1
#             time.sleep(1)  # be polite

#     print("\n✅ Scraping complete")

# # ---------------------------
# # Run
# # ---------------------------


# if __name__ == "__main__":
#     scrape()
#     conn.close()


import sqlite3
import requests
from bs4 import BeautifulSoup
import time

DB = "library.db"
HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

# -------------------------
# Helpers
# -------------------------


def clean(text):
    return text.strip() if text else None


def extract_taxonomy(soup, label):
    """
    Extracts taxonomy pills based on visible label text,
    e.g. 'Age Group', 'Subject'
    """
    section = soup.find("div", string=lambda s: s and label in s)
    if not section:
        return []

    container = section.find_parent("section")
    if not container:
        return []

    return [
        clean(tag.get_text())
        for tag in container.select("a, span")
        if tag.get_text(strip=True)
    ]


# -------------------------
# Page Scraper
# -------------------------
def scrape_library_page(url):
    r = requests.get(url, headers=HEADERS, timeout=20)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")

    # Title
    title = soup.select_one("h1")
    title = clean(title.get_text()) if title else None

    # Description (main content)
    content = soup.select_one(".elementor-widget-theme-post-content")
    description = "\n".join(
        p.get_text(strip=True)
        for p in content.select("p")
    ) if content else None

    # Resource type (badge)
    resource_type = soup.select_one(".jet-listing-dynamic-terms__link")
    resource_type = clean(resource_type.get_text()) if resource_type else None

    # Taxonomies
    ages = extract_taxonomy(soup, "Age")
    subjects = extract_taxonomy(soup, "Subject")

    return title, description, resource_type, ages, subjects


# -------------------------
# Main
# -------------------------
def main():

    conn = sqlite3.connect(DB)
    cur = conn.cursor()

    # First, check if we need to migrate the schema
    cur.execute("PRAGMA table_info(library_items)")
    columns = [row[1] for row in cur.fetchall()]

    # Add missing columns if they don't exist
    if 'description' not in columns:
        cur.execute("ALTER TABLE library_items ADD COLUMN description TEXT")
    if 'resource_type' not in columns:
        cur.execute("ALTER TABLE library_items ADD COLUMN resource_type TEXT")

    conn.commit()

    cur.execute("SELECT id, url FROM library_items")
    rows = cur.fetchall()

    cur.executescript("""
        CREATE TABLE IF NOT EXISTS library_item_ages (
            item_id INTEGER,
            age TEXT
        );

        CREATE TABLE IF NOT EXISTS library_item_subjects (
            item_id INTEGER,
            subject TEXT
        );
    """)

    for item_id, url in rows:
        print(f"Scraping {url}")
        try:
            title, desc, rtype, ages, subjects = scrape_library_page(url)

            cur.execute("""
                UPDATE library_items
                SET title=?, description=?, resource_type=?
                WHERE id=?
            """, (title, desc, rtype, item_id))

            cur.execute(
                "DELETE FROM library_item_ages WHERE item_id=?", (item_id,))
            cur.execute(
                "DELETE FROM library_item_subjects WHERE item_id=?", (item_id,))

            for age in ages:
                cur.execute("""
                    INSERT INTO library_item_ages (item_id, age)
                    VALUES (?, ?)
                """, (item_id, age))

            for subject in subjects:
                cur.execute("""
                    INSERT INTO library_item_subjects (item_id, subject)
                    VALUES (?, ?)
                """, (item_id, subject))

            conn.commit()
            time.sleep(1)

        except Exception as e:
            print(f"❌ Failed {url}: {e}")

    conn.close()
    print("✅ Done")


if __name__ == "__main__":
    main()
