// One line per prop. src = file in src/ or ph/ ; size in metres (longest side unless axis:'height')
// y = height of its base above the floor, distance = metres from the viewer
const SF = 'Sketchfab', PP = 'Poly Pizza', PH = 'Poly Haven';
export const STORIES = {
  lagan: 'Lagan balcony and the Nile (first story, Sudan)',
  tayo: 'Tayo: Ormeau Park to the family farm (Nigeria)',
  israel: 'Israel: library and the bookshop',
  kowther: 'Kowther: the street outside her home'
};
export const SPEC = [
  // ---- lagan
  { story: 'lagan', id: 'tea-set', label: 'Tea set ("having tea with the family")', src: 'ph/tea_set_01/tea_set_01_1k.gltf', size: 0.45, y: 0.9, distance: 1.2, count: 10000, site: PH, author: 'Poly Haven', lic: 'CC0', url: 'https://polyhaven.com/a/tea_set_01' },
  { story: 'lagan', id: 'crocodile-a', label: 'Crocodile (Nile) - option A, realistic', src: 'src/lagan__crocodile-a__crocodile-animal.glb', size: 3.5, distance: 3.2, count: 22000 },
  { story: 'lagan', id: 'crocodile-b', label: 'Crocodile (Nile) - option B', src: 'src/lagan__crocodile-c__crocodile-high-quality.glb', size: 3.0, distance: 3.2, count: 20000 },
  { story: 'lagan', id: 'train-a', label: 'Train on the bridge - option A, modern', src: 'src/lagan__train-a__semi-modern-train.glb', size: 20, distance: 11, count: 30000 },
  { story: 'lagan', id: 'train-b', label: 'Train on the bridge - option B, low poly', src: 'src/lagan__train-b__low-poly-passenger-train.glb', size: 20, distance: 11, count: 30000 },
  { story: 'lagan', id: 'train-carriage', label: 'Railway carriage', src: 'src/lagan__railway-carriage.glb', size: 20, distance: 11, count: 25000 },
  { story: 'lagan', id: 'car', label: 'Car on the bridge', src: 'src/lagan__car.glb', size: 4.3, distance: 5, count: 18000 },
  { story: 'lagan', id: 'phone', label: 'Phone playing songs from home', src: 'src/lagan__phone-pixel2.glb', size: 0.15, y: 1.1, distance: 0.9, count: 4000 },
  // ---- tayo
  { story: 'tayo', id: 'dog-a', label: 'Dog (Ormeau Park) - generic', src: 'src/tayo__dog-quaternius.glb', size: 0.8, distance: 1.8, count: 8000 },
  { story: 'tayo', id: 'dog-shiba', label: 'Dog - Shiba Inu', src: 'src/tayo__dog-shiba.glb', size: 0.7, distance: 1.8, count: 8000 },
  { story: 'tayo', id: 'dog-pug', label: 'Dog - pug', src: 'src/tayo__dog-pug.glb', size: 0.5, distance: 1.6, count: 6000 },
  { story: 'tayo', id: 'dog-bordercollie', label: 'Dog - border collie', src: 'src/tayo__dog-bordercollie__border-collie.glb', size: 0.95, distance: 2, count: 9000 },
  { story: 'tayo', id: 'dog-labrador-puppy', label: 'Dog - Labrador puppy', src: 'src/tayo__dog-labrador-puppy__labrador-retriever-puppy.glb', size: 0.5, distance: 1.6, count: 6000 },
  { story: 'tayo', id: 'bird-robin', label: 'Bird (Northern Ireland) - robin', src: 'src/tayo__bird-ni-robin__robin.glb', size: 0.15, y: 1.5, distance: 1.0, count: 5000 },
  { story: 'tayo', id: 'picnic-blanket', label: 'Picnic blanket', src: 'src/tayo__picnic-blanket__simple-picnic-blanket.glb', size: 1.8, distance: 2.2, count: 8000 },
  { story: 'tayo', id: 'picnic-set', label: 'Picnic set (blanket and food)', src: 'src/tayo__picnic-set__picnic-set-free.glb', size: 1.6, distance: 2.4, count: 16000 },
  { story: 'tayo', id: 'picnic-basket-a', label: 'Picnic basket - wicker', src: 'ph/wicker_basket_01/wicker_basket_01_1k.gltf', size: 0.45, distance: 1.6, count: 8000, site: PH, author: 'Poly Haven', lic: 'CC0', url: 'https://polyhaven.com/a/wicker_basket_01' },
  { story: 'tayo', id: 'picnic-basket-b', label: 'Picnic basket - simple', src: 'src/tayo__picnic-basket-polygoogle.glb', size: 0.45, distance: 1.6, count: 6000 },
  { story: 'tayo', id: 'bird-parrot', label: 'Bird (West Nigeria) - African grey parrot', src: 'src/tayo__bird-ng-africangreyparrot__african-grey-parrot.glb', size: 0.33, y: 1.7, distance: 1.4, count: 6000 },
  { story: 'tayo', id: 'tree-cashew', label: 'Cashew tree (stand-in: tropical mango trees)', src: 'src/tayo__tree-cashew-standin-mango__tropical-mango-trees.glb', size: 7, axis: 'height', distance: 12, count: 35000 },
  { story: 'tayo', id: 'fruit-cashew', label: 'Cashew fruit', src: 'src/tayo__fruit-cashew__cashew.glb', size: 0.1, y: 1.3, distance: 0.8, count: 3000 },
  { story: 'tayo', id: 'tree-bitterkola-a', label: 'Bitter kola tree (stand-in: cocoa tree)', src: 'src/tayo__tree-bitterkola-standin-cocoa__cocoa-tree.glb', size: 4.5, axis: 'height', distance: 6, count: 30000 },
  { story: 'tayo', id: 'tree-bitterkola-b', label: 'Bitter kola tree (stand-in: mango tree)', src: 'src/tayo__tree-bitterkola-standin-mango__mango-tree.glb', size: 6, axis: 'height', distance: 7, count: 32000 },
  { story: 'tayo', id: 'cutlass-a', label: 'Weeding cutlass - option A', src: 'src/tayo__tool-cutlass-a__classic-machete.glb', size: 0.6, distance: 1.3, count: 4000 },
  { story: 'tayo', id: 'cutlass-b', label: 'Weeding cutlass - option B', src: 'src/tayo__tool-cutlass-b__machete.glb', size: 0.6, distance: 1.3, count: 4000 },
  // ---- israel
  { story: 'israel', id: 'book-open', label: 'The book she hid - open book', src: 'src/israel__book-open.glb', size: 0.35, y: 1.0, distance: 1.0, count: 6000 },
  { story: 'israel', id: 'book-stack', label: 'Book stack', src: 'src/israel__book-stack.glb', size: 0.3, distance: 1.3, count: 6000 },
  { story: 'israel', id: 'chair-wooden', label: 'Wooden reading chair (for the bookshop scan)', src: 'ph/WoodenChair_01/WoodenChair_01_1k.gltf', size: 0.95, axis: 'height', distance: 1.8, count: 12000, site: PH, author: 'Poly Haven', lic: 'CC0', url: 'https://polyhaven.com/a/WoodenChair_01' },
  { story: 'israel', id: 'bread-loaf', label: 'Loaf of bread (FareShare kitchen)', src: 'src/israel__bread-loaf.glb', size: 0.3, y: 0.9, distance: 1.2, count: 5000 },
  // ---- kowther
  { story: 'kowther', id: 'milk-carton-a', label: 'Milk carton - option A', src: 'src/kowther__milk-carton-a__milk-carton.glb', size: 0.25, y: 0.9, distance: 1.0, count: 5000 },
  { story: 'kowther', id: 'milk-carton-b', label: 'Milk carton - option B (simple)', src: 'src/kowther__milk-carton-kenney.glb', size: 0.25, y: 0.9, distance: 1.1, count: 4000 },
  { story: 'kowther', id: 'bag-grocery', label: 'Grocery bag', src: 'src/kowther__bag-grocery__grocery-bag.glb', size: 0.45, distance: 1.3, count: 8000 },
  { story: 'kowther', id: 'bag-paper', label: 'Paper bag', src: 'src/kowther__bag-paper__paper-bag.glb', size: 0.4, distance: 1.3, count: 7000 },
  { story: 'kowther', id: 'bag-paper-recycled', label: 'Paper bag - recycled', src: 'src/kowther__bag-paper-recycled__recycled-paper-bag.glb', size: 0.4, distance: 1.4, count: 7000 },
  { story: 'kowther', id: 'phone-1', label: 'Phones on the ground (calls home) - 1', src: 'src/lagan__phone-pixel2.glb', reuse: 'lagan/phone.sog', size: 0.15, y: 0.02, distance: 1.1, count: 4000 },
  { story: 'kowther', id: 'phone-2', label: 'Phones on the ground (calls home) - 2', reuse: 'lagan/phone.sog', size: 0.15, y: 0.02, distance: 1.5, yaw: 40 },
  { story: 'kowther', id: 'phone-3', label: 'Phones on the ground (calls home) - 3', reuse: 'lagan/phone.sog', size: 0.15, y: 0.02, distance: 1.9, yaw: -70 },
  { story: 'kowther', id: 'mattress-floor', label: 'Mattress on the floor (17 people)', src: 'src/kowther__mattress-floor__dorm-floor-mattress-with-sheet.glb', size: 2.0, distance: 2.4, count: 15000 },
  { story: 'kowther', id: 'mattress-inflatable', label: 'Inflatable mattress', src: 'src/kowther__mattress-inflatable__inflatable-mattress.glb', size: 1.9, distance: 2.6, count: 12000 },
  { story: 'kowther', id: 'sofa', label: 'Sofa', src: 'ph/sofa_02/sofa_02_1k.gltf', size: 2.0, distance: 3, count: 18000, site: PH, author: 'Poly Haven', lic: 'CC0', url: 'https://polyhaven.com/a/sofa_02' },
  { story: 'kowther', id: 'chair-plastic', label: 'Plastic chair (every seat they had)', src: 'ph/plastic_monobloc_chair_01/plastic_monobloc_chair_01_1k.gltf', size: 0.8, axis: 'height', distance: 2.2, count: 8000, site: PH, author: 'Poly Haven', lic: 'CC0', url: 'https://polyhaven.com/a/plastic_monobloc_chair_01' },
  { story: 'kowther', id: 'blinds-a', label: 'Blinds closing - option A', src: 'src/kowther__blinds-a__window-blinds-low-poly-3d-mode.glb', size: 1.2, y: 1.0, distance: 2.5, count: 10000 },
  { story: 'kowther', id: 'blinds-b', label: 'Blinds closing - option B', src: 'src/kowther__blinds-b__blinds.glb', size: 1.2, y: 1.0, distance: 2.5, count: 10000 },
  { story: 'kowther', id: 'bonfire-boat-a', label: 'Bonfire silhouette: boat - inflatable', src: 'src/kowther__bonfire-boat-inflatable__inflatable-boat.glb', size: 3.5, distance: 7, count: 14000, silhouette: true },
  { story: 'kowther', id: 'bonfire-boat-b', label: 'Bonfire silhouette: boat - dinghy', src: 'src/kowther__bonfire-boat-dinghy__dinghy.glb', rotx: -90, size: 3.5, distance: 7, count: 14000, silhouette: true },
  { story: 'kowther', id: 'bonfire-mosque', label: 'Bonfire silhouette: mosque replica (generic)', src: 'src/kowther__bonfire-mosque-simple__simple-mosque.glb', size: 4, axis: 'height', distance: 8, count: 16000, silhouette: true },
];
