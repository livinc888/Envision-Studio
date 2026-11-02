import os
from PIL import Image, ImageDraw, ImageFont

def make_pure_text_poster(
    output_path,
    case_num,
    category,
    headline_word1,
    headline_word2,
    sub_specimen,
    big_stat,
    stat_unit,
    stat_label,
    description_lines,
    specs_dict,
    accent_color,
    bg_color=(12, 12, 15)
):
    width = 800
    height = 1100
    img = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # Fonts
    font_dir = "C:/Windows/Fonts"
    f_huge = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 96)
    f_stat = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 118)
    f_stat_unit = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 48)
    f_subhead = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 30)
    f_body = ImageFont.truetype(os.path.join(font_dir, "segoeui.ttf"), 20)
    f_mono_bold = ImageFont.truetype(os.path.join(font_dir, "consolab.ttf"), 19)
    f_mono = ImageFont.truetype(os.path.join(font_dir, "consola.ttf"), 17)
    f_micro = ImageFont.truetype(os.path.join(font_dir, "consolab.ttf"), 14)

    # Margins
    mx = 60
    my = 60

    # 1. Outer Fine Border & Corner Crosshairs
    draw.rectangle([mx, my, width - mx, height - my], outline=(40, 40, 48), width=1)
    # Corner ticks
    tick_len = 12
    # Top-Left
    draw.line([mx - tick_len, my, mx + tick_len, my], fill=accent_color, width=2)
    draw.line([mx, my - tick_len, mx, my + tick_len], fill=accent_color, width=2)
    # Top-Right
    draw.line([width - mx - tick_len, my, width - mx + tick_len, my], fill=(70, 70, 80), width=1)
    draw.line([width - mx, my - tick_len, width - mx, my + tick_len], fill=(70, 70, 80), width=1)
    # Bottom-Left
    draw.line([mx - tick_len, height - my, mx + tick_len, height - my], fill=(70, 70, 80), width=1)
    draw.line([mx, height - my - tick_len, mx, height - my + tick_len], fill=(70, 70, 80), width=1)
    # Bottom-Right
    draw.line([width - mx - tick_len, height - my, width - mx + tick_len, height - my], fill=accent_color, width=2)
    draw.line([width - mx, height - my - tick_len, width - mx, height - my + tick_len], fill=accent_color, width=2)

    # 2. Top Header Metadata Bar
    cur_y = my + 28
    draw.text((mx + 25, cur_y), f"ENVISION STUDIO // TECHNICAL POSTER", fill=(140, 140, 155), font=f_micro)
    draw.text((width - mx - 120, cur_y), f"PLATE {case_num}", fill=accent_color, font=f_micro)
    
    cur_y += 28
    draw.line([mx + 25, cur_y, width - mx - 25, cur_y], fill=(35, 35, 45), width=1)

    # 3. Category & Plate Index
    cur_y += 30
    draw.text((mx + 25, cur_y), f"CASE STUDY // {case_num}", fill=accent_color, font=f_mono_bold)
    draw.text((mx + 25, cur_y + 26), category.upper(), fill=(180, 180, 195), font=f_micro)

    # 4. Gigantic Display Words (Pure Swiss Typography)
    cur_y += 65
    draw.text((mx + 25, cur_y), headline_word1.upper(), fill=(255, 255, 255), font=f_huge)
    cur_y += 92
    draw.text((mx + 25, cur_y), headline_word2.upper(), fill=(140, 140, 155), font=f_huge)

    # 5. Sub-specimen
    cur_y += 115
    draw.line([mx + 25, cur_y, mx + 160, cur_y], fill=accent_color, width=3)
    cur_y += 18
    draw.text((mx + 25, cur_y), sub_specimen.upper(), fill=accent_color, font=f_subhead)

    # 6. Description Paragraph
    cur_y += 50
    for line in description_lines:
        draw.text((mx + 25, cur_y), line, fill=(200, 200, 215), font=f_body)
        cur_y += 28

    # 7. Massive Typographic Stat Block
    cur_y += 35
    stat_box_y = cur_y
    draw.rectangle([mx + 25, stat_box_y, width - mx - 25, stat_box_y + 160], outline=(45, 45, 55), fill=(18, 18, 22), width=1)
    
    # Accent indicator bar inside stat box
    draw.rectangle([mx + 25, stat_box_y, mx + 31, stat_box_y + 160], fill=accent_color)
    
    draw.text((mx + 50, stat_box_y + 18), stat_label.upper(), fill=(130, 130, 145), font=f_micro)
    
    # Big stat text
    stat_str = str(big_stat)
    draw.text((mx + 50, stat_box_y + 36), stat_str, fill=(255, 255, 255), font=f_stat)
    stat_bbox = draw.textbbox((mx + 50, stat_box_y + 36), stat_str, font=f_stat)
    if stat_unit:
        draw.text((stat_bbox[2] + 12, stat_box_y + 88), stat_unit, fill=accent_color, font=f_stat_unit)

    # 8. Monospaced Specs Grid Table (Pure Typographic Data)
    cur_y = stat_box_y + 180
    draw.text((mx + 25, cur_y), "TECHNICAL ARCHITECTURE SPECS", fill=(120, 120, 135), font=f_micro)
    cur_y += 24
    draw.line([mx + 25, cur_y, width - mx - 25, cur_y], fill=(40, 40, 50), width=1)
    cur_y += 15

    for key, val in specs_dict.items():
        draw.text((mx + 25, cur_y), f"[{key}]", fill=(130, 130, 145), font=f_mono)
        draw.text((mx + 260, cur_y), val, fill=(240, 240, 250), font=f_mono_bold)
        cur_y += 26

    # 9. Bottom Footer Stamped Metadata
    cur_y = height - my - 45
    draw.line([mx + 25, cur_y, width - mx - 25, cur_y], fill=(35, 35, 45), width=1)
    cur_y += 15
    draw.text((mx + 25, cur_y), "SYS.SPEC // PURE TYPOGRAPHIC STUDY", fill=(90, 90, 105), font=f_micro)
    draw.text((width - mx - 230, cur_y), "ALL RIGHTS RESERVED 2026", fill=(90, 90, 105), font=f_micro)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "JPEG", quality=95)
    print(f"Generated {output_path}")

posters = [
    {
        "output_path": "E:/New folder/client/public/images/project-1.jpg",
        "case_num": "01",
        "category": "E-Commerce Checkout & Token Architecture",
        "headline_word1": "Checkout",
        "headline_word2": "Velocity",
        "sub_specimen": "Sub-Second Token System",
        "big_stat": "1.4",
        "stat_unit": "SEC",
        "stat_label": "Median Checkout Transaction Velocity",
        "description_lines": [
            "Engineered to eliminate multi-step cart dropoff through",
            "frictionless unified token architecture. Built on React 18",
            "concurrent rendering and client-side token caching."
        ],
        "specs_dict": {
            "LATENCY": "140ms p95 Global Edge",
            "SECURITY": "PCI-DSS Level 1 Encrypted",
            "DROPOFF": "-34.8% Cart Abandonment",
            "PARITY": "Zero-Jank Token State"
        },
        "accent_color": (229, 50, 43) # Studio Red
    },
    {
        "output_path": "E:/New folder/client/public/images/project-2.jpg",
        "case_num": "02",
        "category": "Biometric Telemetry & Gesture Flow",
        "headline_word1": "Telemetry",
        "headline_word2": "Stream",
        "sub_specimen": "Real-Time Sensor Pipeline",
        "big_stat": "60",
        "stat_unit": "FPS",
        "stat_label": "Zero-Lag Gesture & Sensor Thread",
        "description_lines": [
            "Continuous low-power sensor telemetry streaming 142 BPM",
            "biometric signals with offline-first local cache synchronization",
            "and sub-millisecond gesture arbitration."
        ],
        "specs_dict": {
            "REFRESH": "60 FPS Hardware Sync",
            "TELEMETRY": "142 BPM Live Sensor Stream",
            "BUDGET": "< 16.6ms Render Frame",
            "BANDWIDTH": "2.4 KB/s LZW Compressed"
        },
        "accent_color": (16, 185, 129) # Mint Green
    },
    {
        "output_path": "E:/New folder/client/public/images/project-3.jpg",
        "case_num": "03",
        "category": "Spatial Grid & Design Tokens",
        "headline_word1": "Spatial",
        "headline_word2": "Grid",
        "sub_specimen": "Fibonacci 8pt Token Matrix",
        "big_stat": "8",
        "stat_unit": "PT",
        "stat_label": "Fluid Geometric Grid Rhythm",
        "description_lines": [
            "Architectural design system governed by golden ratio proportional",
            "rhythm. Fluid typography scales dynamically with viewport dimensions",
            "while strictly preserving mathematical baseline harmony."
        ],
        "specs_dict": {
            "GRID UNIT": "8.000px Fluid Baseline",
            "PROPORTION": "1.618033 Golden Section",
            "PARITY": "100% Web & Native Alignment",
            "TOKENS": "Geist Grotesk Typographic Scale"
        },
        "accent_color": (245, 158, 11) # Amber
    },
    {
        "output_path": "E:/New folder/client/public/images/project-4.jpg",
        "case_num": "04",
        "category": "Fintech Ledger & Settlement Protocol",
        "headline_word1": "Fintech",
        "headline_word2": "Ledger",
        "sub_specimen": "256-Bit Settlement Engine",
        "big_stat": "28",
        "stat_unit": "MS",
        "stat_label": "Global Ledger Reconciliation Latency",
        "description_lines": [
            "High-throughput payment gateway settlement layer with end-to-end",
            "cryptographic audit trails. Processing automated webhook pipelines",
            "with strict idempotency and zero-drift balance sync."
        ],
        "specs_dict": {
            "CIPHER": "AES-256-GCM Authenticated",
            "THROUGHPUT": "14,800 Tx / Sec Burst",
            "GUARANTEE": "99.999% Webhook Delivery",
            "DRIFT": "0.000ms Ledger Reconciliation"
        },
        "accent_color": (59, 130, 246) # Blue
    },
    {
        "output_path": "E:/New folder/client/public/images/project-5.jpg",
        "case_num": "05",
        "category": "CRDT Replication & Sockets",
        "headline_word1": "Socket",
        "headline_word2": "State",
        "sub_specimen": "Conflict-Free Sync Protocol",
        "big_stat": "12",
        "stat_unit": "MS",
        "stat_label": "Peer-to-Peer State Propagation Latency",
        "description_lines": [
            "Multiplayer canvas architecture powered by CRDT conflict resolution",
            "algorithms. Instantaneous state convergence across thousands of concurrent",
            "active peers without central locking."
        ],
        "specs_dict": {
            "CONCURRENCY": "50,000 Active Peer Nodes",
            "RESOLUTION": "Zero-Conflict CRDT Merge",
            "PROTOCOL": "WebSocket + WebRTC Mesh",
            "RECOVERY": "Sub-50ms Delta Resynchronization"
        },
        "accent_color": (168, 85, 247) # Purple
    },
    {
        "output_path": "E:/New folder/client/public/images/project-6.jpg",
        "case_num": "06",
        "category": "Core Web Vitals & Search Engine",
        "headline_word1": "Search",
        "headline_word2": "Index",
        "sub_specimen": "Core Web Vitals Dominance",
        "big_stat": "100",
        "stat_unit": "/100",
        "stat_label": "Lighthouse Performance & SEO Score",
        "description_lines": [
            "Zero-overhead edge rendering architecture generating pristine",
            "semantic HTML and structured JSON-LD schemas to dominate",
            "competitive category search results and capture intent."
        ],
        "specs_dict": {
            "LIGHTHOUSE": "100 / 100 Flawless Score",
            "INTERACTIVE": "0.42s Time-to-Interactive",
            "ORGANIC": "+218% Intent Capture Velocity",
            "VALIDATION": "100% Schema.org Structured Data"
        },
        "accent_color": (16, 185, 129) # Mint Green
    }
]

for p in posters:
    make_pure_text_poster(**p)
print("All 6 pure text posters generated successfully!")

