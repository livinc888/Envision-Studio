import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import math

out_dir = r"E:\New folder\client\public\images"
os.makedirs(out_dir, exist_ok=True)

width, height = 640, 920

def create_base(bg_color, glow_color, glow_pos=(0.5, 0.3), glow_radius=0.45):
    img = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    # Radial ambient lighting
    cx, cy = int(width * glow_pos[0]), int(height * glow_pos[1])
    rad = int(width * glow_radius)
    for r in range(rad, 0, -8):
        alpha = int((1.0 - (r / rad)) ** 1.8 * 80)
        c = (
            min(255, int(bg_color[0] + glow_color[0] * (alpha / 255))),
            min(255, int(bg_color[1] + glow_color[1] * (alpha / 255))),
            min(255, int(bg_color[2] + glow_color[2] * (alpha / 255))),
        )
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=c)
    return img

def draw_grid(draw, step=32, color=(35, 35, 42)):
    for x in range(0, width, step):
        draw.line([(x, 0), (x, height)], fill=color, width=1)
    for y in range(0, height, step):
        draw.line([(0, y), (width, y)], fill=color, width=1)

# Card 1: E-Commerce Architecture & Checkout UI
def generate_card_1():
    img = create_base((14, 14, 18), (229, 50, 43), glow_pos=(0.7, 0.25), glow_radius=0.6)
    img = img.filter(ImageFilter.GaussianBlur(radius=25))
    draw = ImageDraw.Draw(img)
    draw_grid(draw, 40, (26, 26, 32))

    # Header badge
    draw.rounded_rectangle([40, 50, 220, 82], radius=16, fill=(28, 28, 35), outline=(60, 60, 75))
    draw.text((56, 60), "CASE STUDY / 01", fill=(229, 50, 43))
    draw.text((40, 110), "E-COMMERCE CHECKOUT", fill=(255, 255, 255))
    draw.text((40, 135), "Optimizing Funnel Friction & Token Systems", fill=(160, 160, 175))

    # UI Mockup Box: Checkout Glassmorphic Card
    card_box = [40, 180, width - 40, 700]
    draw.rounded_rectangle(card_box, radius=24, fill=(22, 22, 28), outline=(50, 50, 65), width=2)

    # Browser / App Top Header
    draw.ellipse([64, 206, 76, 218], fill=(229, 50, 43))
    draw.ellipse([84, 206, 96, 218], fill=(245, 158, 11))
    draw.ellipse([104, 206, 116, 218], fill=(16, 185, 129))
    draw.text((140, 204), "api.envision.studio/checkout/v3", fill=(120, 120, 140))

    # Inner Product Card UI
    draw.rounded_rectangle([65, 245, width - 65, 420], radius=18, fill=(30, 30, 38), outline=(60, 60, 75))
    # Product Thumbnail Gradient
    draw.rounded_rectangle([85, 265, 210, 395], radius=12, fill=(45, 20, 24), outline=(180, 40, 35))
    draw.text((95, 320), "PRODUCT\nSTUDY", fill=(229, 50, 43))

    # Product details
    draw.text((230, 275), "Aether Kinetic Timepiece", fill=(255, 255, 255))
    draw.text((230, 305), "SKU: EK-8940 / Edition: 01 of 500", fill=(130, 130, 145))
    draw.text((230, 335), "$1,450.00 USD", fill=(16, 185, 129))
    draw.rounded_rectangle([230, 365, 340, 392], radius=8, fill=(16, 185, 129, 40), outline=(16, 185, 129))
    draw.text((245, 372), "IN STOCK", fill=(16, 185, 129))

    # Payment flow step indicators
    steps = ["Cart (01)", "Shipping (02)", "Payment (03)", "Confirm (04)"]
    for i, step in enumerate(steps):
        sx = 65 + i * 130
        active = (i <= 2)
        bg = (229, 50, 43) if active else (40, 40, 50)
        draw.rounded_rectangle([sx, 445, sx + 118, 475], radius=8, fill=bg)
        draw.text((sx + 14, 453), step, fill=(255, 255, 255) if active else (120, 120, 130))

    # Checkout metrics panel
    draw.rounded_rectangle([65, 495, width - 65, 600], radius=16, fill=(26, 26, 34), outline=(50, 50, 65))
    draw.text((85, 515), "Checkout Velocity: 1.4s (reduced by 58%)", fill=(255, 255, 255))
    draw.text((85, 545), "Cart Abandonment Drop: -34.8% post-redesign", fill=(16, 185, 129))
    draw.text((85, 570), "Stripe Elements tokenization + Apple Pay native", fill=(140, 140, 160))

    # Primary Action CTA Button inside mockup
    draw.rounded_rectangle([65, 620, width - 65, 675], radius=28, fill=(229, 50, 43))
    draw.text((220, 638), "COMPLETE ORDER ->", fill=(255, 255, 255))

    # Bottom pill badges
    draw.rounded_rectangle([40, 730, 185, 762], radius=16, fill=(28, 28, 36), outline=(60, 60, 75))
    draw.text((55, 740), "[REACT + STRIPE]", fill=(200, 200, 220))
    draw.rounded_rectangle([200, 730, 360, 762], radius=16, fill=(28, 28, 36), outline=(60, 60, 75))
    draw.text((215, 740), "[CONVERSION: +34%]", fill=(16, 185, 129))
    draw.rounded_rectangle([375, 730, 520, 762], radius=16, fill=(28, 28, 36), outline=(60, 60, 75))
    draw.text((390, 740), "[LATENCY: 1.4s]", fill=(229, 50, 43))

    return img

# Card 2: Mobile App Telemetry & Gestural Architecture
def generate_card_2():
    img = create_base((12, 16, 22), (16, 185, 129), glow_pos=(0.3, 0.4), glow_radius=0.6)
    img = img.filter(ImageFilter.GaussianBlur(radius=25))
    draw = ImageDraw.Draw(img)
    draw_grid(draw, 40, (22, 28, 38))

    # Header badge
    draw.rounded_rectangle([40, 50, 220, 82], radius=16, fill=(24, 32, 44), outline=(45, 60, 85))
    draw.text((56, 60), "CASE STUDY / 02", fill=(16, 185, 129))
    draw.text((40, 110), "MOBILE HEALTH TELEMETRY", fill=(255, 255, 255))
    draw.text((40, 135), "Cross-Platform Biometric & Gesture Engine", fill=(140, 165, 185))

    # Phone Frame Bezel
    phone_box = [90, 180, width - 90, 760]
    draw.rounded_rectangle(phone_box, radius=36, fill=(16, 20, 28), outline=(65, 80, 105), width=3)

    # Dynamic Island / Camera Pill
    draw.rounded_rectangle([250, 195, 390, 220], radius=12, fill=(8, 10, 14))

    # Screen Content: Header
    draw.text((120, 240), "Daily Strain & Heart Rate", fill=(255, 255, 255))
    draw.text((120, 265), "LIVE TELEMETRY // SENSOR ACTIVE", fill=(16, 185, 129))

    # Metric Tiles: BPM & Calories
    draw.rounded_rectangle([120, 300, 260, 390], radius=18, fill=(24, 30, 42), outline=(40, 52, 72))
    draw.text((135, 312), "HEART RATE", fill=(130, 150, 175))
    draw.text((135, 335), "142", fill=(229, 50, 43))
    draw.text((195, 345), "BPM", fill=(130, 150, 175))

    draw.rounded_rectangle([280, 300, 420, 390], radius=18, fill=(24, 30, 42), outline=(40, 52, 72))
    draw.text((295, 312), "BURNED", fill=(130, 150, 175))
    draw.text((295, 335), "890", fill=(16, 185, 129))
    draw.text((355, 345), "KCAL", fill=(130, 150, 175))

    # Graph Bezier Area: Heart Rate Waveform
    graph_box = [120, 415, width - 120, 560]
    draw.rounded_rectangle(graph_box, radius=20, fill=(20, 26, 36), outline=(40, 52, 72))
    draw.text((140, 430), "Continuous ECG Telemetry", fill=(160, 180, 200))

    # Plot wave
    points = []
    for px in range(140, width - 140, 8):
        t = (px - 140) / 40.0
        py = 500 + int(math.sin(t * 1.5) * 22 + math.sin(t * 4.2) * 14)
        points.append((px, py))
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill=(16, 185, 129), width=3)
        draw.ellipse([points[i][0]-3, points[i][1]-3, points[i][0]+3, points[i][1]+3], fill=(255, 255, 255))

    # Activity Rings
    draw.rounded_rectangle([120, 580, width - 120, 680], radius=20, fill=(24, 30, 42), outline=(40, 52, 72))
    draw.ellipse([145, 600, 215, 670], outline=(16, 185, 129), width=7)
    draw.ellipse([155, 610, 205, 660], outline=(59, 130, 246), width=5)
    draw.text((235, 612), "Cardio Load: Optimal (94%)", fill=(255, 255, 255))
    draw.text((235, 638), "Recovery Index: 88 / 100", fill=(16, 185, 129))

    # Bottom Phone Indicator Bar
    draw.rounded_rectangle([250, 740, 390, 746], radius=3, fill=(100, 120, 150))

    return img

# Card 3: Brand Identity & Geometric Specimen
def generate_card_3():
    img = create_base((18, 16, 14), (245, 158, 11), glow_pos=(0.6, 0.35), glow_radius=0.55)
    img = img.filter(ImageFilter.GaussianBlur(radius=25))
    draw = ImageDraw.Draw(img)
    draw_grid(draw, 35, (35, 30, 24))

    # Header badge
    draw.rounded_rectangle([40, 50, 220, 82], radius=16, fill=(35, 30, 22), outline=(75, 65, 45))
    draw.text((56, 60), "CASE STUDY / 03", fill=(245, 158, 11))
    draw.text((40, 110), "BRAND IDENTITY & SYSTEM", fill=(255, 255, 255))
    draw.text((40, 135), "Geometric Construction & Typography Hierarchy", fill=(180, 165, 140))

    # Specimen Box
    specimen_box = [40, 180, width - 40, 720]
    draw.rounded_rectangle(specimen_box, radius=24, fill=(24, 22, 18), outline=(65, 55, 40), width=2)

    # Architectural Golden Ratio Construction
    center = (width // 2, 340)
    for r in [40, 70, 110, 160]:
        draw.ellipse([center[0] - r, center[1] - r, center[0] + r, center[1] + r], outline=(245, 158, 11, 100), width=1)
    draw.line([(center[0] - 180, center[1]), (center[0] + 180, center[1])], fill=(245, 158, 11), width=1)
    draw.line([(center[0], center[1] - 180), (center[0], center[1] + 180)], fill=(245, 158, 11), width=1)
    draw.line([(center[0] - 130, center[1] - 130), (center[0] + 130, center[1] + 130)], fill=(245, 158, 11, 120), width=1)

    # Center Geometric Symbol Mark
    poly_pts = [
        (center[0], center[1] - 55),
        (center[0] + 55, center[1] + 35),
        (center[0] - 55, center[1] + 35)
    ]
    draw.polygon(poly_pts, fill=(245, 158, 11), outline=(255, 255, 255))
    draw.ellipse([center[0] - 16, center[1] - 4, center[0] + 16, center[1] + 28], fill=(18, 16, 14))

    # Grid Construction Labels
    draw.text((70, 520), "RATIO: 1.618 // FIBONACCI RADII", fill=(245, 158, 11))
    draw.text((70, 545), "SYSTEM: 8PT FLUID SCALING GRID", fill=(200, 190, 175))

    # Color Swatches Palette
    swatches = [
        ((229, 50, 43), "#E5322B (Studio Red)"),
        ((245, 158, 11), "#F59E0B (Ochre Amber)"),
        ((11, 11, 11), "#0B0B0B (Obsidian Dark)"),
        ((255, 255, 255), "#FFFFFF (Pure Canvas)")
    ]
    for i, (col, label) in enumerate(swatches):
        sy = 580 + i * 32
        draw.rounded_rectangle([70, sy, 96, sy + 22], radius=4, fill=col, outline=(80, 80, 80))
        draw.text((110, sy + 4), label, fill=(220, 215, 205))

    return img

# Card 4: Fintech Payment Gateway & Infrastructure
def generate_card_4():
    img = create_base((14, 18, 24), (59, 130, 246), glow_pos=(0.5, 0.3), glow_radius=0.6)
    img = img.filter(ImageFilter.GaussianBlur(radius=25))
    draw = ImageDraw.Draw(img)
    draw_grid(draw, 40, (24, 30, 45))

    # Header badge
    draw.rounded_rectangle([40, 50, 220, 82], radius=16, fill=(24, 32, 50), outline=(45, 65, 100))
    draw.text((56, 60), "CASE STUDY / 04", fill=(59, 130, 246))
    draw.text((40, 110), "FINTECH PAYMENT GATEWAY", fill=(255, 255, 255))
    draw.text((40, 135), "Resilient Webhooks & 256-Bit Ledger Nodes", fill=(140, 160, 190))

    # Architecture Node Diagram
    node_box = [40, 180, width - 40, 720]
    draw.rounded_rectangle(node_box, radius=24, fill=(18, 24, 36), outline=(45, 65, 95), width=2)

    # 3 Architecture Nodes
    nodes = [
        (width // 2, 260, "POST /v1/transactions", (59, 130, 246)),
        (width // 2, 400, "AES-256 VAULT ROUTER", (16, 185, 129)),
        (width // 2, 540, "GLOBAL SETTLEMENT LEDGER", (229, 50, 43))
    ]

    # Connecting pipes
    draw.line([(width // 2, 290), (width // 2, 370)], fill=(59, 130, 246), width=3)
    draw.line([(width // 2, 430), (width // 2, 510)], fill=(16, 185, 129), width=3)

    for nx, ny, title, color in nodes:
        draw.rounded_rectangle([nx - 180, ny - 30, nx + 180, ny + 30], radius=14, fill=(26, 34, 52), outline=color, width=2)
        draw.ellipse([nx - 160, ny - 6, nx - 148, ny + 6], fill=color)
        draw.text((nx - 130, ny - 8), title, fill=(255, 255, 255))

    # Performance metrics panel
    draw.rounded_rectangle([65, 600, width - 65, 690], radius=16, fill=(24, 30, 46), outline=(40, 55, 80))
    draw.text((85, 615), "Median Latency: 28ms globally", fill=(16, 185, 129))
    draw.text((85, 640), "Zero-Downtime Webhook Guarantee: 99.999%", fill=(255, 255, 255))
    draw.text((85, 665), "PCI-DSS Level 1 Compliant Architecture", fill=(130, 150, 180))

    return img

# Card 5: Real-Time Collaboration & Sockets
def generate_card_5():
    img = create_base((18, 14, 24), (168, 85, 247), glow_pos=(0.4, 0.4), glow_radius=0.6)
    img = img.filter(ImageFilter.GaussianBlur(radius=25))
    draw = ImageDraw.Draw(img)
    draw_grid(draw, 40, (30, 24, 42))

    # Header badge
    draw.rounded_rectangle([40, 50, 220, 82], radius=16, fill=(32, 24, 44), outline=(65, 45, 90))
    draw.text((56, 60), "CASE STUDY / 05", fill=(168, 85, 247))
    draw.text((40, 110), "REAL-TIME SOCKET ENGINE", fill=(255, 255, 255))
    draw.text((40, 135), "Multiplayer State Synchronization Canvas", fill=(170, 150, 190))

    # Multiplayer Canvas Box
    canvas_box = [40, 180, width - 40, 720]
    draw.rounded_rectangle(canvas_box, radius=24, fill=(22, 18, 30), outline=(55, 42, 75), width=2)

    # Node Tree Objects
    draw.rounded_rectangle([80, 260, 260, 360], radius=16, fill=(35, 28, 48), outline=(168, 85, 247))
    draw.text((100, 280), "HeroSection.tsx", fill=(255, 255, 255))
    draw.text((100, 310), "State: Synchronized", fill=(16, 185, 129))

    draw.rounded_rectangle([320, 340, 500, 440], radius=16, fill=(35, 28, 48), outline=(59, 130, 246))
    draw.text((340, 360), "ShaderWebGL.ts", fill=(255, 255, 255))
    draw.text((340, 390), "FPS: 60 locked", fill=(59, 130, 246))

    # Connection line between nodes
    draw.line([(260, 310), (320, 390)], fill=(168, 85, 247), width=2)

    # Multiplayer Cursor 1
    c1 = (220, 390)
    draw.polygon([c1, (c1[0] + 16, c1[1] + 16), (c1[0] + 6, c1[1] + 16), (c1[0] + 4, c1[1] + 24), (c1[0], c1[1] + 22)], fill=(229, 50, 43))
    draw.rounded_rectangle([c1[0] + 18, c1[1] + 12, c1[0] + 160, c1[1] + 36], radius=6, fill=(229, 50, 43))
    draw.text((c1[0] + 26, c1[1] + 17), "Marcus (Creative Lead)", fill=(255, 255, 255))

    # Multiplayer Cursor 2
    c2 = (380, 490)
    draw.polygon([c2, (c2[0] + 16, c2[1] + 16), (c2[0] + 6, c2[1] + 16), (c2[0] + 4, c2[1] + 24), (c2[0], c2[1] + 22)], fill=(16, 185, 129))
    draw.rounded_rectangle([c2[0] + 18, c2[1] + 12, c2[0] + 155, c2[1] + 36], radius=6, fill=(16, 185, 129))
    draw.text((c2[0] + 26, c2[1] + 17), "Elena (Frontend Eng)", fill=(255, 255, 255))

    # Telemetry
    draw.rounded_rectangle([65, 590, width - 65, 680], radius=16, fill=(28, 22, 38), outline=(48, 36, 65))
    draw.text((85, 608), "WebSocket Roundtrip: 12ms", fill=(16, 185, 129))
    draw.text((85, 632), "Conflict-Free Replicated Data Types (CRDT)", fill=(255, 255, 255))
    draw.text((85, 656), "Peer-to-peer WebRTC fallback active", fill=(150, 135, 170))

    return img

# Card 6: Core Web Vitals & Search Engine Optimization
def generate_card_6():
    img = create_base((14, 20, 18), (16, 185, 129), glow_pos=(0.6, 0.45), glow_radius=0.6)
    img = img.filter(ImageFilter.GaussianBlur(radius=25))
    draw = ImageDraw.Draw(img)
    draw_grid(draw, 40, (24, 34, 30))

    # Header badge
    draw.rounded_rectangle([40, 50, 220, 82], radius=16, fill=(24, 36, 32), outline=(45, 75, 65))
    draw.text((56, 60), "CASE STUDY / 06", fill=(16, 185, 129))
    draw.text((40, 110), "SEARCH EXPERIENCE & VITALS", fill=(255, 255, 255))
    draw.text((40, 135), "Lighthouse 100 & Semantic Indexation", fill=(140, 175, 160))

    # Vitals Score Dashboard
    vitals_box = [40, 180, width - 40, 720]
    draw.rounded_rectangle(vitals_box, radius=24, fill=(18, 26, 24), outline=(40, 65, 55), width=2)

    # Giant Lighthouse Score 100 Dial
    center = (width // 2, 330)
    draw.ellipse([center[0] - 80, center[1] - 80, center[0] + 80, center[1] + 80], outline=(16, 185, 129), width=10)
    draw.text((center[0] - 40, center[1] - 30), "100", fill=(16, 185, 129))
    draw.text((center[0] - 65, center[1] + 15), "LIGHTHOUSE SCORE", fill=(200, 220, 210))

    # Vitals Metrics Matrix
    metrics = [
        ("LCP (Largest Contentful Paint)", "0.64s", (16, 185, 129)),
        ("INP (Interaction to Next Paint)", "12ms", (16, 185, 129)),
        ("CLS (Cumulative Layout Shift)", "0.000", (16, 185, 129)),
        ("Organic Traffic Velocity", "+218%", (59, 130, 246))
    ]
    for i, (m_title, val, col) in enumerate(metrics):
        my = 470 + i * 54
        draw.rounded_rectangle([65, my, width - 65, my + 44], radius=10, fill=(24, 34, 30), outline=(35, 55, 45))
        draw.text((85, my + 14), m_title, fill=(200, 215, 205))
        draw.text((width - 160, my + 14), val, fill=col)

    return img

print("Generating Project 1...")
generate_card_1().save(os.path.join(out_dir, "project-1.jpg"), quality=95)
print("Generating Project 2...")
generate_card_2().save(os.path.join(out_dir, "project-2.jpg"), quality=95)
print("Generating Project 3...")
generate_card_3().save(os.path.join(out_dir, "project-3.jpg"), quality=95)
print("Generating Project 4...")
generate_card_4().save(os.path.join(out_dir, "project-4.jpg"), quality=95)
print("Generating Project 5...")
generate_card_5().save(os.path.join(out_dir, "project-5.jpg"), quality=95)
print("Generating Project 6...")
generate_card_6().save(os.path.join(out_dir, "project-6.jpg"), quality=95)

print("All 6 project showcase images generated successfully!")

