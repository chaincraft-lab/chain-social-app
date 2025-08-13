/**
 * Türkçe karakterleri İngilizce karşılıklarına dönüştürür
 */
export function turkishToEnglish(text: string): string {
  const turkishMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'I': 'I',
    'i': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };

  return text.replace(/[çÇğĞıIiİöÖşŞüÜ]/g, (match) => turkishMap[match] || match);
}

/**
 * Metinten URL dostu slug oluşturur
 */
export function generateSlug(text: string): string {
  return turkishToEnglish(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Özel karakterleri kaldır
    .replace(/[\s_-]+/g, '-') // Boşluk ve alt çizgileri tire ile değiştir
    .replace(/^-+|-+$/g, ''); // Baş ve sondaki tireleri kaldır
}

/**
 * Benzersiz slug oluşturur
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}