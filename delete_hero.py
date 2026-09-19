import re

with open(r'd:\TopUP\frontend\src\pages\Home.js', 'r', encoding='utf8') as f:
    text = f.read()

pattern_hero = re.compile(r'\{\/\* Hero Section \(Desktop Only - Hidden on Mobile\) \*\/\}.*?<\/section>', re.DOTALL)

# Delete the hero section
text, count = pattern_hero.subn('', text)
print(f"Deleted {count} hero sections.")

# Adjust padding of EventBannerSlider section to act as hero
text = text.replace('<section className="py-6 sm:py-8">', '<section className="pt-8 sm:pt-12 pb-6 sm:pb-8">')

with open(r'd:\TopUP\frontend\src\pages\Home.js', 'w', encoding='utf8') as f:
    f.write(text)
