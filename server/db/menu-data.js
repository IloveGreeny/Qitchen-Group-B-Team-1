// The Week 2 menu, now used only to fill the database (npm run db:seed).
// The live site reads these rows from Postgres through GET /api/menu.
export const menu = [
  { name: 'Tekka Maki', type: 'Maki', description: 'Fresh Tuna · 6 pcs', price: 9.5, image: 'tekka-maki.webp', alt: 'Tekka Maki - Tuna Roll' },
  { name: 'Oshinko Maki', type: 'Maki', description: 'Pickled Radish · 6 pcs', price: 6.5, image: 'oshinko-maki.webp', alt: 'Oshinko Maki - Pickled Radish Roll' },
  { name: 'Sake Maki', type: 'Maki', description: 'Atlantic Salmon · 6 pcs', price: 8.5, image: 'sake-maki.webp', alt: 'Sake Maki - Salmon Roll' },
  { name: 'Hamachi Maki', type: 'Maki', description: 'Yellowtail · 6 pcs', price: 10, image: 'hamachi-maki.webp', alt: 'Hamachi Maki - Yellowtail Roll' },
  { name: 'Salmon Tobiko Roll', type: 'Uramaki', description: 'Salmon, Avocado & Tobiko', price: 14.5, image: 'salmon-tobiko-uramaki.webp', alt: 'Salmon Tobiko Uramaki' },
  { name: 'Rainbow Roll', type: 'Uramaki', description: 'Assorted Fresh Fish & Avocado', price: 16.5, image: 'rainbow-roll-uramaki.webp', alt: 'Rainbow Roll Uramaki' },
  { name: 'Mango Fusion Roll', type: 'Uramaki', description: 'Tempura & Sweet Mango Glaze', price: 15, image: 'mango-fusion-uramaki.webp', alt: 'Mango Fusion Roll' },
  { name: 'Double Salmon Roll', type: 'Uramaki', description: 'Fresh Salmon & Avocado', price: 15.5, image: 'double-salmon-uramaki.webp', alt: 'Double Salmon Uramaki' },
  { name: 'Teriyaki Cream Roll', type: 'Special Rolls', description: 'Grilled Salmon & Cream Cheese', price: 16.5, image: 'teriyaki-cream-roll.webp', alt: 'Teriyaki Cream Special Roll' },
  { name: 'Crispy Volcano Roll', type: 'Special Rolls', description: 'Tempura Crunch & Spicy Tobiko', price: 17.5, image: 'crispy-volcano-roll.webp', alt: 'Crispy Volcano Special Roll' },
  { name: 'Green Garden Roll', type: 'Special Rolls', description: 'Prawn Tempura & Fresh Greens', price: 16, image: 'green-dragon-roll.webp', alt: 'Green Garden Special Roll' },
  { name: 'Black Pearl Roll', type: 'Special Rolls', description: 'Black Rice, Prawn & Glaze', price: 18, image: 'black-rice-roll.webp', alt: 'Black Pearl Special Roll' },
]
