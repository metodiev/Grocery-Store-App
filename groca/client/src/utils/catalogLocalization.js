const categoryNames = {
  bg: {
    "fruits-vegetables": "Плодове и зеленчуци",
    "meat-seafood": "Месо и морски дарове",
    "dairy-eggs": "Млечни продукти и яйца",
    bakery: "Пекарна",
    beverages: "Напитки",
    snacks: "Снаксове",
    "frozen-foods": "Замразени храни",
    pantry: "Основни продукти",
    household: "За дома",
    "personal-care": "Лична грижа"
  }
};

const productNames = {
  bg: {
    "fresh-red-apples": "Свежи червени ябълки",
    bananas: "Банани",
    spinach: "Спанак",
    tomatoes: "Домати",
    "chicken-breast": "Пилешко филе",
    "atlantic-salmon": "Атлантическа сьомга",
    "whole-milk": "Пълномаслено мляко",
    "free-range-eggs": "Яйца от свободно отглеждани кокошки",
    "sourdough-bread": "Хляб с квас",
    "butter-croissant": "Маслен кроасан",
    "orange-juice": "Портокалов сок",
    "sparkling-water": "Газирана вода",
    "potato-chips": "Картофен чипс",
    "dark-chocolate": "Тъмен шоколад",
    "frozen-pizza": "Замразена пица",
    "frozen-berries": "Замразени горски плодове",
    "basmati-rice": "Басмати ориз",
    "olive-oil": "Зехтин",
    "dish-soap": "Препарат за съдове",
    "laundry-detergent": "Прах за пране",
    shampoo: "Шампоан",
    toothpaste: "Паста за зъби",
    cucumber: "Краставица",
    strawberries: "Ягоди",
    "greek-yogurt": "Гръцко кисело мляко",
    "cheddar-cheese": "Чедър",
    "muffin-pack": "Пакет мъфини",
    "cola-drink": "Кола напитка",
    "trail-mix": "Ядково миксче",
    "canned-beans": "Консервиран боб"
  }
};

const productDescriptions = {
  bg: {
    "fresh-red-apples": "Свежи и хрупкави червени ябълки",
    bananas: "Сладки узрели банани",
    spinach: "Био бейби спанак",
    tomatoes: "Узрели на клон домати",
    "chicken-breast": "Обезкостено пилешко филе",
    "atlantic-salmon": "Свежо филе от сьомга",
    "whole-milk": "Кремообразно пълномаслено мляко",
    "free-range-eggs": "12 яйца от свободно отглеждани кокошки",
    "sourdough-bread": "Занаятчийски хляб с квас",
    "butter-croissant": "Хрупкав маслен кроасан",
    "orange-juice": "100% чист портокалов сок",
    "sparkling-water": "Натурална газирана вода",
    "potato-chips": "Картофен чипс със сол",
    "dark-chocolate": "Тъмен шоколад с 70% какао",
    "frozen-pizza": "Замразена пица със сирене",
    "frozen-berries": "Микс замразени горски плодове",
    "basmati-rice": "Премиум басмати ориз",
    "olive-oil": "Екстра върджин зехтин",
    "dish-soap": "Течен препарат за съдове с лимон",
    "laundry-detergent": "Концентриран препарат за пране",
    shampoo: "Хидратиращ шампоан",
    toothpaste: "Паста за зъби с мента",
    cucumber: "Свежа зелена краставица",
    strawberries: "Сладки ягоди",
    "greek-yogurt": "Натурално гръцко кисело мляко",
    "cheddar-cheese": "Отлежало сирене чедър",
    "muffin-pack": "Пакет боровинкови мъфини",
    "cola-drink": "Освежаваща кола напитка",
    "trail-mix": "Микс ядки и стафиди",
    "canned-beans": "Консервиран боб, богат на протеин"
  }
};

const unitNames = {
  bg: {
    kg: "кг",
    pack: "пакет",
    liter: "литър",
    piece: "бр.",
    bottle: "бутилка",
    bar: "бр.",
    bag: "пакет",
    cup: "чаша",
    tube: "туба",
    can: "консерва"
  }
};

const productIconOverrides = {
  tomatoes: "https://img.icons8.com/color/512/tomato.png",
  "whole-milk": "https://img.icons8.com/color/512/milk-bottle.png"
};

const toSlug = (text) => {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const normalizeProductKey = (product) => {
  if (product?.slug) {
    return product.slug.replace(/-\d+$/, "");
  }
  return toSlug(product?.name || "");
};

const normalizeCategorySlug = (value) => {
  if (typeof value === "string") {
    return value;
  }
  return value?.slug || toSlug(value?.name || "");
};

const formatSlugLabel = (slug) => {
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const localizeCategoryName = (categoryOrSlug, language = "en") => {
  const slug = normalizeCategorySlug(categoryOrSlug);
  if (language !== "bg") {
    return typeof categoryOrSlug === "string" ? formatSlugLabel(categoryOrSlug) : categoryOrSlug?.name || "";
  }

  const translated = categoryNames.bg[slug];
  if (translated) {
    return translated;
  }

  return typeof categoryOrSlug === "string" ? formatSlugLabel(categoryOrSlug) : categoryOrSlug?.name || "";
};

export const localizeProduct = (product, language = "en") => {
  const key = normalizeProductKey(product);
  const localizedName = language === "bg" ? productNames.bg[key] || product.name : product.name;
  const localizedDescription = language === "bg" ? productDescriptions.bg[key] || product.description : product.description;
  const localizedUnit = language === "bg" ? unitNames.bg[product.unit] || product.unit : product.unit;
  const image = productIconOverrides[key] || product.image;

  return {
    ...product,
    name: localizedName,
    description: localizedDescription,
    unit: localizedUnit,
    image
  };
};

export const localizeProductNameFromText = (name, language = "en") => {
  if (language !== "bg") {
    return name;
  }

  const key = toSlug(name);
  return productNames.bg[key] || name;
};
