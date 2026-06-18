from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1240, 1754
out = Path("outputs/proposals/kp_4_preview.png")
out.parent.mkdir(parents=True, exist_ok=True)

img = Image.new("RGB", (W, H), "white")
d = ImageDraw.Draw(img)

font_path = Path("C:/Windows/Fonts/arial.ttf")
bold_path = Path("C:/Windows/Fonts/arialbd.ttf")


def font(size, bold=False):
    path = bold_path if bold and bold_path.exists() else font_path
    return ImageFont.truetype(str(path), size) if path.exists() else ImageFont.load_default()


black = (20, 20, 20)
purple = (138, 43, 226)
text = (28, 39, 48)
line = (217, 222, 232)
soft = (247, 244, 255)
header_soft = (241, 236, 255)

logo = Image.open("assets/logo.png").convert("RGBA")
logo.thumbnail((300, 105), Image.LANCZOS)
img.paste(logo, (80, 58), logo)

d.multiline_text(
    (530, 54),
    "Индивидуальный Предприниматель\nАндреев Никита Алексеевич",
    fill=black,
    font=font(27, True),
    align="right",
)
d.multiline_text(
    (530, 124),
    "+7 (993) 992-05-15\ninfo-misterpufik@yandex.ru\nmisterpufik.ru\n"
    "Юридический адрес: 197349, Санкт-Петербург, проспект Сизова, д. 34/18, кв. 452\n"
    "ИНН: 781432056933    ОГРНИП: 312784734000451",
    fill=text,
    font=font(16),
    align="right",
    spacing=3,
)

d.text((80, 260), "Коммерческое предложение № 4", fill=purple, font=font(36, True))
d.text((80, 310), "от 04.06.2026", fill=text, font=font(20))
d.text((W - 80, 274), "misterpufik.ru", fill=black, font=font(22, True), anchor="ra")

meta_y = 380
d.rounded_rectangle([80, meta_y, W - 80, meta_y + 86], radius=10, fill=soft, outline=(231, 226, 247), width=1)
d.text((110, meta_y + 26), "Заказ:", fill=text, font=font(22, True))
d.text((200, meta_y + 26), "Проверка подписи", fill=text, font=font(22))

x0, y0 = 80, 530
cols = [60, 430, 220, 120, 170, 210]
headers = ["№", "Позиция", "Размер", "Кол-во", "НДС, 5%", "Стоимость"]
rows = [
    ["1", "Поролоновая подушка", "49 x 49 x 5 см", "1", "50 ₽", "1 050 ₽"],
    ["2", "Доставка", "", "1", "25 ₽", "525 ₽"],
]
row_h = 62
d.rounded_rectangle([x0, y0, x0 + sum(cols), y0 + row_h * (len(rows) + 1)], radius=8, outline=line, width=1)
d.rectangle([x0, y0, x0 + sum(cols), y0 + row_h], fill=header_soft)
x = x0
for i, c in enumerate(cols):
    d.line([x, y0, x, y0 + row_h * (len(rows) + 1)], fill=line, width=1)
    d.text((x + 10, y0 + 18), headers[i], fill=black, font=font(20, True))
    x += c
d.line([x0 + sum(cols), y0, x0 + sum(cols), y0 + row_h * (len(rows) + 1)], fill=line, width=1)
for idx, row in enumerate(rows):
    y = y0 + row_h * (idx + 1)
    d.line([x0, y, x0 + sum(cols), y], fill=line, width=1)
    x = x0
    for i, c in enumerate(cols):
        d.text((x + 10, y + 19), row[i], fill=purple if row[i] == "Доставка" else text, font=font(20, row[i] == "Доставка"))
        x += c

total_y = y0 + row_h * 3 + 42
d.rounded_rectangle([760, total_y, W - 80, total_y + 105], radius=10, fill=soft, outline=(231, 226, 247), width=1)
d.text((W - 110, total_y + 22), "Итого: 1 575 ₽", fill=purple, font=font(31, True), anchor="ra")
d.text((W - 110, total_y + 70), "В том числе НДС, 5%: 75 ₽", fill=text, font=font(17), anchor="ra")
d.text((80, total_y + 130), "Срок изготовления: 10 рабочих дней с момента поступления оплаты", fill=text, font=font(20, True))

sig_y = total_y + 220
d.text((80, sig_y), "ИП   Андреев Никита Алексеевич", fill=black, font=font(23, True))
stamp = Image.open("assets/signature_stamp.png").convert("RGBA")
stamp.thumbnail((410, 320), Image.LANCZOS)
img.paste(stamp, (735, sig_y - 100), stamp)

d.line([80, 1660, W - 80, 1660], fill=line, width=2)
d.text((W // 2, 1680), "misterpufik.ru", fill=black, font=font(20), anchor="ma")

img.save(out)
print(out.resolve())
