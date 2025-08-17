Frontend projesi şu an hem Vuetify hem Tailwind kullanılmış. Aşağıdaki isteklerime göre codebase'i yeniden düzenle:

1. Vuetify kullanımlarını kaldır ve yalnızca TailwindCSS kullan.
2. Kodları clean architecture mantığıyla modüllere ayır. 
   - DataTable, Create/Edit/Delete Dialog gibi parçalar tek dosyada olmasın. 
   - Tekrarlayan kısımları ayrı Vue component'leri haline getir.
   - Örneğin bir "CustomButton", "ModalDialog", "FormInput" component'i olsun ve props ile özelleştirilebilsin.
3. Global tema sistemi kur:
   - Renk paletleri (primary, secondary, success, error, warning, info vb.) global Tailwind config içinde tanımlansın.
   - Yazı tipleri, spacing, border-radius vb. değerler de global config’te tanımlı olsun. 
   - Componentlerde aynı renk, font veya spacing tekrar tekrar yazılmasın, global config üzerinden kullanılsın.
4. Dark mode / light mode desteği ekle:
   - Tailwind’in `dark:` sınıfını kullanarak global tema uyumlu hale getir.
   - Bütün componentler hem light hem dark mode ile çalışabilsin.
5. UI consistency:
   - Butonlar, inputlar, tablolar gibi ortak bileşenler aynı tasarım kurallarına uysun.
   - Örneğin bir yerde kullandığım buton ile başka yerde kullandığım buton görünüş olarak farklı olmasın. Sadece prop ile `variant="primary" | "secondary" | "danger"` gibi farklılaştırılsın.
6. Kod tekrarı azalt:
   - Tüm formlar aynı "FormField" component'ini kullanabilsin.
   - Modal pencereler ortak "ModalWrapper" component'i üzerinden gelsin.
   - Tablolarda sayfalama, filtreleme, sıralama gibi özellikler tekrar tekrar yazılmasın, component mantığı ile parçalanıp tekrar kullanılabilsin.


  - src/components/layout/Navbar.vue 
  - src/components/layout/Sidebar.vue #done 
  - src/components/layout/Footer.vue 
  - src/components/news/NewsPost.vue 
  - src/components/ui/CategoriesList.vue #done
  - src/components/auth/AuthDialog.vue

  Views:
  - src/views/HomePage.vue
  - src/views/CategoryPage.vue
  - src/views/TagPage.vue
  - src/views/DefenseLeaguePage.vue
  - src/views/ArticlePage.vue
  - src/views/SearchPage.vue