# Social sharing card

`card.html` is the source of `public/og.png` (1200×630), the image shown when
orpay.pages.dev is shared on WhatsApp, X, LinkedIn, Facebook or Slack.

To regenerate after editing:

```bash
cp ../public/icon-512.png . && "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 \
  --screenshot=../public/og.png "file://$PWD/card.html" && rm icon-512.png
```

## Instagram (square)

`instagram.html` → `orpay-instagram-1080.png` (1080×1080). Regenerate the same
way with `--window-size=1080,1080` and `--screenshot=orpay-instagram-1080.png`.
