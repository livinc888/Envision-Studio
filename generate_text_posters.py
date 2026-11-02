import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

out_dir = r"E:\New folder\client\public\images"
os.makedirs(out_dir, exist_ok=True)

width, height = 640, 920

cards_data = [
    {
        "id": "01",
        "category": "E-COMMERCE & TOKEN SYSTEM",
        "headline": "CHECKOUT VELOCITY\n& DESIGN TOKENS",
        "statement": "Eliminating multi-step purchase friction via unified design tokens, sub-second Stripe checkout, and zero-jank transitions.",
        "stat_num": "1.4s",
        "stat_label": "MEDIAN CHECKOUT VELOCITY",
        "metric_detail": "-34.8% CART ABANDONMENT RATE",
        "tech": "REACT 18  //  STRIPE ELEMENTS  //  DESIGN TOKENS",
        "accent": (229, 50, 43),
        "bg_dark": (11, 11, 14)
    },
    {
        "id": "02",
        "category": "BIOMETRICS & GESTURE FLOW",
        "headline": "BIOMETRIC TELEMETRY\n& GESTURE ENGINE",
        "statement": "Continuous real-time sensor streaming with 60 FPS gesture responsiveness and offline-first cache synchronization.",
        "stat_num": "60 FPS",
        "stat_label": "ZERO-LAG GESTURE THREAD",
        "metric_detail": "142 BPM REAL-TIME SENSOR STREAM",
        "tech": "REACT NATIVE  //  SWIFT ENGINES  //  BIOMETRICS",
        "accent": (16, 185, 129),
        "bg_dark": (10, 14, 12)
    },
    {
        "id": "03",
        "category": "GEOMETRIC GRID & TOKENS",
        "headline": "SPATIAL GRID\n& DESIGN TOKENS",
        "statement": "Proportionally governed spatial hierarchies, fluid typography tokens, and architectural brand construction systems.",
        "stat_num": "8 PT",
        "stat_label": "FLUID GEOMETRIC GRID",
        "metric_detail": "100% CROSS-PLATFORM COMPONENT PARITY",
        "tech": "DESIGN TOKENS  //  GEIST GROTESK  //  FIGMA API",
        "accent": (245, 158, 11),
        "bg_dark": (14, 13, 10)
    },
    {
        "id": "04",
        "category": "256-BIT LEDGER & VAULT",
        "headline": "FINTECH API\n& SETTLEMENT ENGINE",
        "statement": "High-throughput payment gateway architecture with encrypted webhook delivery and millisecond ledger reconciliation.",
        "stat_num": "28 ms",
        "stat_label": "GLOBAL API RECONCILIATION",
        "metric_detail": "99.999% WEBHOOK GUARANTEE",
        "tech": "NODE.JS EXPRESS  //  AES-256  //  WEBHOOK PIPELINE",
        "accent": (59, 130, 246),
        "bg_dark": (10, 12, 16)
    },
    {
        "id": "05",
        "category": "MULTIPLAYER CRDT CANVAS",
        "headline": "REAL-TIME SOCKET\nSYNCHRONIZATION",
        "statement": "Multiplayer collaborative canvas with peer-to-peer conflict-free data replication and millisecond presence awareness.",
        "stat_num": "12 ms",
        "stat_label": "SOCKET PROPAGATION LATENCY",
        "metric_detail": "ZERO CONFLICT STATE DRIFT",
        "tech": "WEBSOCKETS  //  CRDT PROTOCOL  //  WEBRTC PEERS",
        "accent": (168, 85, 247),
        "bg_dark": (13, 10, 16)
    },
    {
        "id": "06",
        "category": "LIGHTHOUSE 100 ENGINE",
        "headline": "CORE WEB VITALS\n& SEARCH INDEX",
        "statement": "Server-rendered semantic HTML with instant time-to-interactive, dominating enterprise category search results.",
        "stat_num": "100",
        "stat_label": "LIGHTHOUSE SPEED & SEO INDEX",
        "metric_detail": "+218% ORGANIC SEARCH CAPTURE",
        "tech": "SEMANTIC HTML  //  EDGE CACHING  //  SCHEMA.ORG",
        "accent": (16, 185, 129),
        "bg_dark": (10, 14, 12)
    }
]

for idx, card in enumerate(cards_data):
    img = Image.new("RGB", (width, height), card["bg_dark"])
    draw = ImageDraw.Draw(img)

    # Subtle ambient gradient wash in accent color
    accent = card["accent"]
    for y in range(height):
        ratio = y / float(height)
        fade = (1.0 - ratio) * 0.15
        r = int(card["bg_dark"][0] * (1 - fade) + accent[0] * fade)
        g = int(card["bg_dark"][1] * (1 - fade) + accent[1] * fade)
        b = int(card["bg_dark"][2] * (1 - fade) + accent[2] * fade)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Clean 1px fine grid
    for x in range(0, width, 40):
        draw.line([(x, 0), (x, height)], fill=(22, 22, 28), width=1)
    for y in range(0, height, 40):
        draw.line([(0, y), (width, y)], fill=(22, 22, 28), width=1)

    # Card border
    draw.rounded_rectangle([20, 20, width - 20, height - 20], radius=24, outline=(45, 45, 55), width=2)

    # Top Pill Tag
    draw.rounded_rectangle([48, 50, 240, 80], radius=15, fill=(24, 24, 30), outline=(60, 60, 70))
    draw.text((64, 59), f"CASE STUDY // {card['id']}", fill=accent)

    draw.text((width - 240, 60), card["category"], fill=(150, 150, 165))

    # Giant Oversized Numeral in Background
    draw.text((45, 120), card["id"], fill=(32, 32, 40))

    # Red accent marker square
    draw.rectangle([48, 200, 58, 210], fill=accent)
    draw.text((68, 198), card["category"], fill=accent)

    # Bold Headline
    draw.text((48, 240), card["headline"], fill=(255, 255, 255), spacing=12)

    # 1px Dotted Divider
    for dx in range(48, width - 48, 8):
        draw.line([(dx, 340), (dx + 4, 340)], fill=(60, 60, 70), width=1)

    # Statement text
    draw.text((48, 370), card["statement"], fill=(185, 185, 195), spacing=8)

    # Stat Highlight Box (Text Only)
    draw.rounded_rectangle([48, 480, width - 48, 680], radius=18, fill=(18, 18, 24), outline=(40, 40, 50))
    draw.text((72, 510), card["stat_label"], fill=(140, 140, 155))
    draw.text((72, 545), card["stat_num"], fill=(255, 255, 255))
    draw.text((72, 625), card["metric_detail"], fill=accent)

    # Bottom Tech Stack
    draw.rounded_rectangle([48, 720, width - 48, 770], radius=12, fill=(22, 22, 28), outline=(45, 45, 55))
    draw.text((68, 738), card["tech"], fill=(200, 200, 215))

    # Save image
    out_path = os.path.join(out_dir, f"project-{idx + 1}.jpg")
    img.save(out_path, quality=95)
    print(f"Saved text-only typographic poster: {out_path}")

print("All 6 text-only project images created successfully!")

