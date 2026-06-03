from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "images"
OUT.mkdir(parents=True, exist_ok=True)

specs = [
    ("travelholics_lanyard_hero.png", "Hero Product Image", "Replace with clean lanyard mockup on cream background"),
    ("travelholics_lanyard_specs.png", "Approved Design / Spec Image", "Replace with cropped approved vendor spec sheet"),
    ("travelholics_lanyard_logo_repeat.png", "Logo Repeat Close-Up", "Replace with close-up of logo, cruise icons, Atlantis gradient"),
    ("travelholics_lanyard_clip_detail.png", "Clip / Detail Image", "Replace with silver lobster claw attachment close-up"),
    ("travelholics_lanyard_lifestyle.png", "Lifestyle / Use Image", "Replace with lanyard holding cruise card near luggage/passport"),
]

try:
    title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 58)
    body_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
    small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
except OSError:
    title_font = body_font = small_font = ImageFont.load_default()

for filename, title, note in specs:
    img = Image.new("RGB", (1600, 1600), "#F4EFE8")
    draw = ImageDraw.Draw(img)

    # Atlantis-inspired background blocks
    draw.rectangle((0, 0, 1600, 1600), fill="#F4EFE8")
    draw.ellipse((-350, -260, 760, 740), fill="#1C3A4A")
    draw.ellipse((900, 970, 1840, 1900), fill="#0F766E")
    draw.rectangle((0, 1280, 1600, 1600), fill="#111010")

    # Product placeholder frame
    draw.rounded_rectangle((220, 260, 1380, 1160), radius=46, outline="#A8865A", width=6, fill="#FFF9F0")
    draw.line((330, 900, 1270, 430), fill="#1C3A4A", width=62)
    draw.line((370, 950, 1310, 480), fill="#0F766E", width=28)
    draw.text((800, 690), "TRAVELHOLICS", anchor="mm", fill="#C05C2E", font=title_font)
    draw.text((800, 770), "CRUISE CARD LANYARD", anchor="mm", fill="#111010", font=body_font)

    # Labels
    draw.text((800, 140), title.upper(), anchor="mm", fill="#111010", font=title_font)
    draw.text((800, 1245), "ATLANTIS EDITION · IMAGE PLACEHOLDER", anchor="mm", fill="#F4EFE8", font=body_font)
    draw.text((800, 1325), note, anchor="mm", fill="#F4EFE8", font=small_font)
    draw.text((800, 1395), filename, anchor="mm", fill="#A8865A", font=small_font)

    img.save(OUT / filename, quality=95)

print("Created lanyard placeholders:")
for filename, _, _ in specs:
    print(OUT / filename)
