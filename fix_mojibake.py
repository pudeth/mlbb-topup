import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# Replace Tiles Icon
text = re.sub(
    r'<span>.*?</span>\s*<span className="text-\[11px\] font-semibold">\{t\(\'layout_tiles\'\)\}</span>',
    r"""<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                      <span className="text-[11px] font-semibold">{t('layout_tiles')}</span>""",
    text
)

# Replace Large Icons Grid Icon
text = re.sub(
    r'<span>.*?</span>\s*<span className="text-\[11px\] font-semibold">\{t\(\'layout_large_icons\'\)\}</span>',
    r"""<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                      <span className="text-[11px] font-semibold">{t('layout_large_icons')}</span>""",
    text
)

# Replace List Icon
text = re.sub(
    r'<span>.*?</span>\s*<span className="text-\[11px\] font-semibold">\{t\(\'layout_list\'\)\}</span>',
    r"""<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                      <span className="text-[11px] font-semibold">{t('layout_list')}</span>""",
    text
)

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)

print("Icons replaced with SVGs.")
