# Props: ghost memories for Open to Stay

Objects the storytellers mention, turned into small Gaussian splats (.sog) so they stream from GitHub like the scans and use no PlayCanvas storage.
They are shown by `scripts/ghost-props.js`, which reads `props-manifest.json` in this folder.

Made 29 Oct 2026 from free models (Sketchfab, Poly Pizza, Poly Haven). Each model was surface-sampled into splats with its own colours, scaled to real size, centred, and its base put on the floor (y = 0). Converter: `props/tools/mesh2splat.mjs`, then splat-transform 3.10.3 to .sog.

**Folders:** one per story. File name = object. Options for the same object end in -a, -b, -c.

To hide a prop: set `"enabled": false` on its line in props-manifest.json. To change where it floats: edit its `distance` (m from you) or `y` (m above the floor).

## Lagan balcony and the Nile (first story, Sudan) — `props/lagan/`

| File | What it is | Splats | Size (m) | Source | Licence |
|---|---|---|---|---|---|
| `lagan/tea-set.sog` | Tea set ("having tea with the family") | 10,000 | 0.45 × 0.08 × 0.24 | [Poly Haven: Poly Haven](https://polyhaven.com/a/tea_set_01) | CC0 |
| `lagan/crocodile-a.sog` | Crocodile (Nile) - option A, realistic | 22,000 | 2.74 × 1.05 × 3.5 | [Sketchfab: Brian Trepanier](https://sketchfab.com/3d-models/1be78d94f64e4952beeb74677f21143f) | CC Attribution |
| `lagan/crocodile-b.sog` | Crocodile (Nile) - option B | 20,000 | 1.16 × 0.45 × 3 | [Sketchfab: Beerus](https://sketchfab.com/3d-models/a242e4634a234d3fb909c54b2c39d7b8) | CC Attribution |
| `lagan/train-a.sog` | Train on the bridge - option A, modern | 29,909 | 20 × 6.74 × 3.81 | [Sketchfab: Yarek212](https://sketchfab.com/3d-models/f2933788134647ae9f98238e00ec97a4) | CC Attribution |
| `lagan/train-b.sog` | Train on the bridge - option B, low poly | 30,000 | 20 × 2.4 × 2.1 | [Sketchfab: Aditya Voxel](https://sketchfab.com/3d-models/3f6c325d7cd4472d8dbafac1ef9f03d6) | CC Attribution |
| `lagan/train-carriage.sog` | Railway carriage | 25,000 | 4.6 × 5.24 × 20 | [Poly Pizza: Poly by Google](https://poly.pizza/m/1EHZsD3ja38) | CC-BY 3.0 |
| `lagan/car.sog` | Car on the bridge | 18,000 | 1.98 × 1.34 × 4.3 | [Poly Pizza: Quaternius](https://poly.pizza/m/HQ0hvRM2XR) | CC-BY 3.0 |
| `lagan/phone.sog` | Phone playing songs from home | 4,000 | 0.04 × 0.15 × 0.09 | [Poly Pizza: Gabriel Valdivia](https://poly.pizza/m/7ztvFoiPP6j) | CC-BY 3.0 |

## Tayo: Ormeau Park to the family farm (Nigeria) — `props/tayo/`

| File | What it is | Splats | Size (m) | Source | Licence |
|---|---|---|---|---|---|
| `tayo/dog-a.sog` | Dog (Ormeau Park) - generic | 8,000 | 0.36 × 0.72 × 0.8 | [Poly Pizza: Quaternius](https://poly.pizza/m/2kUk0QqpCg) | CC0 1.0 |
| `tayo/dog-shiba.sog` | Dog - Shiba Inu | 8,000 | 0.19 × 0.55 × 0.7 | [Poly Pizza: Quaternius](https://poly.pizza/m/y4wdQpg767) | CC0 1.0 |
| `tayo/dog-pug.sog` | Dog - pug | 6,000 | 0.21 × 0.36 × 0.5 | [Poly Pizza: Quaternius](https://poly.pizza/m/xvcUwuKl4c) | CC-BY 3.0 |
| `tayo/dog-bordercollie.sog` | Dog - border collie | 9,000 | 0.24 × 0.59 × 0.95 | [Sketchfab: vicente betoret ferrero](https://sketchfab.com/3d-models/f5b9cb8ae12b46898afbc0d0e8cc8051) | CC Attribution |
| `tayo/dog-labrador-puppy.sog` | Dog - Labrador puppy | 6,000 | 0.14 × 0.3 × 0.5 | [Sketchfab: 3D Resource](https://sketchfab.com/3d-models/1afaa69215604838911ccd3221e4a6d6) | CC Attribution |
| `tayo/bird-robin.sog` | Bird (Northern Ireland) - robin | 5,000 | 0.07 × 0.1 × 0.15 | [Sketchfab: kenchoo](https://sketchfab.com/3d-models/dd04863288ed4c5ea0d444945a4f67c2) | CC Attribution |
| `tayo/picnic-blanket.sog` | Picnic blanket | 8,000 | 1.8 × 0 × 1.72 | [Sketchfab: AlysiaC](https://sketchfab.com/3d-models/57299a9fa8a54fd38601fc5d60e53b3e) | CC Attribution |
| `tayo/picnic-set.sog` | Picnic set (blanket and food) | 16,000 | 1.6 × 0.63 × 1.24 | [Sketchfab: Juliette(PurpleFox)](https://sketchfab.com/3d-models/f9f63f71a7234b938d2e7256ff47a383) | CC Attribution |
| `tayo/picnic-basket-a.sog` | Picnic basket - wicker | 8,000 | 0.45 × 0.14 × 0.35 | [Poly Haven: Poly Haven](https://polyhaven.com/a/wicker_basket_01) | CC0 |
| `tayo/picnic-basket-b.sog` | Picnic basket - simple | 6,000 | 0.45 × 0.38 × 0.25 | [Poly Pizza: Poly by Google](https://poly.pizza/m/aWBGhxXig8y) | CC-BY 3.0 |
| `tayo/bird-parrot.sog` | Bird (West Nigeria) - African grey parrot | 6,000 | 0.18 × 0.33 × 0.18 | [Sketchfab: Gert-Jan van den Boom](https://sketchfab.com/3d-models/6f729a4cb4db425599aa79257cc17c98) | CC Attribution-ShareAlike |
| `tayo/tree-cashew.sog` | Cashew tree (stand-in: tropical mango trees) | 18,287 | 8.77 × 7 × 24.71 | [Sketchfab: Jagobo](https://sketchfab.com/3d-models/6997814540f14929bf13cf3828b5dc90) | CC Attribution |
| `tayo/fruit-cashew.sog` | Cashew fruit | 3,000 | 0.05 × 0.07 × 0.1 | [Sketchfab: gelmi.com.br](https://sketchfab.com/3d-models/db9d4dc84b7c4517ab2b73fe96dc44d4) | CC Attribution |
| `tayo/tree-bitterkola-a.sog` | Bitter kola tree (stand-in: cocoa tree) | 8,280 | 4.07 × 4.5 × 3.91 | [Sketchfab: MVP_Kobesh](https://sketchfab.com/3d-models/1f4b6fb21c844aada8350f9d598753db) | CC Attribution |
| `tayo/tree-bitterkola-b.sog` | Bitter kola tree (stand-in: mango tree) | 32,000 | 5.87 × 6 × 5.93 | [Sketchfab: stealth86](https://sketchfab.com/3d-models/4b186052228d43d8b3fbb63213677de8) | CC Attribution |
| `tayo/cutlass-a.sog` | Weeding cutlass - option A | 4,000 | 0.6 × 0.12 × 0.02 | [Sketchfab: JungleBird](https://sketchfab.com/3d-models/175bb0580dee4890800ce56a6c83b831) | CC Attribution |
| `tayo/cutlass-b.sog` | Weeding cutlass - option B | 4,000 | 0.02 × 0.06 × 0.6 | [Sketchfab: Belonosoff](https://sketchfab.com/3d-models/340a3bed238f48b0aa169c38e1e75066) | CC Attribution |

## Israel: library and the bookshop — `props/israel/`

| File | What it is | Splats | Size (m) | Source | Licence |
|---|---|---|---|---|---|
| `israel/book-open.sog` | The book she hid - open book | 6,000 | 0.35 × 0.06 × 0.27 | [Poly Pizza: Quaternius](https://poly.pizza/m/FsCIGEfTEs) | CC0 1.0 |
| `israel/book-stack.sog` | Book stack | 6,000 | 0.3 × 0.21 × 0.3 | [Poly Pizza: Danni Bittman](https://poly.pizza/m/1WggoIFq8tx) | CC-BY 3.0 |
| `israel/chair-wooden.sog` | Wooden reading chair (for the bookshop scan) | 12,000 | 0.29 × 0.95 × 0.28 | [Poly Haven: Poly Haven](https://polyhaven.com/a/WoodenChair_01) | CC0 |
| `israel/bread-loaf.sog` | Loaf of bread (FareShare kitchen) | 5,000 | 0.12 × 0.11 × 0.3 | [Poly Pizza: Jarlan Perez](https://poly.pizza/m/adck7D-hul0) | CC-BY 3.0 |

## Kowther: the street outside her home — `props/kowther/`

| File | What it is | Splats | Size (m) | Source | Licence |
|---|---|---|---|---|---|
| `kowther/milk-carton-a.sog` | Milk carton - option A | 5,000 | 0.11 × 0.25 × 0.11 | [Sketchfab: mootiff](https://sketchfab.com/3d-models/24373fdaccb94e2faa494d046ccde627) | CC Attribution |
| `kowther/milk-carton-b.sog` | Milk carton - option B (simple) | 4,000 | 0.1 × 0.25 × 0.1 | [Poly Pizza: Kenney](https://poly.pizza/m/T2QjC2ZQya) | CC0 1.0 |
| `kowther/bag-grocery.sog` | Grocery bag | 8,000 | 0.4 × 0.35 × 0.45 | [Sketchfab: Antoine Dresen](https://sketchfab.com/3d-models/86d735e7933c4486aa60d70c55529b1b) | CC Attribution |
| `kowther/bag-paper.sog` | Paper bag | 7,000 | 0.2 × 0.4 × 0.25 | [Sketchfab: av_mod9](https://sketchfab.com/3d-models/22b06c54f69b4813824b29b7356396d7) | CC Attribution |
| `kowther/bag-paper-recycled.sog` | Paper bag - recycled | 7,000 | 0.12 × 0.4 × 0.23 | [Sketchfab: TBR_VFX](https://sketchfab.com/3d-models/fe7dc479bc79439aa579de6e00b3b8fb) | CC Attribution |
| `lagan/phone.sog` | Phones on the ground (calls home) - 1 | — | — | same file as lagan/phone.sog |  |
| `lagan/phone.sog` | Phones on the ground (calls home) - 2 | — | — | same file as lagan/phone.sog |  |
| `lagan/phone.sog` | Phones on the ground (calls home) - 3 | — | — | same file as lagan/phone.sog |  |
| `kowther/mattress-floor.sog` | Mattress on the floor (17 people) | 15,000 | 2 × 0.42 × 1.18 | [Sketchfab: Ingrid Bee](https://sketchfab.com/3d-models/1fa7d1844949448b8b8abaf4183126c5) | CC Attribution |
| `kowther/mattress-inflatable.sog` | Inflatable mattress | 12,000 | 1.9 × 0.19 × 1.63 | [Sketchfab: pantryDS](https://sketchfab.com/3d-models/381dab8401274cea9ffda2c8451eae7b) | CC Attribution |
| `kowther/sofa.sog` | Sofa | 18,000 | 2 × 0.79 × 0.91 | [Poly Haven: Poly Haven](https://polyhaven.com/a/sofa_02) | CC0 |
| `kowther/chair-plastic.sog` | Plastic chair (every seat they had) | 8,000 | 0.58 × 0.8 × 0.57 | [Poly Haven: Poly Haven](https://polyhaven.com/a/plastic_monobloc_chair_01) | CC0 |
| `kowther/blinds-a.sog` | Blinds closing - option A | 10,000 | 0.06 × 1.14 × 1.2 | [Sketchfab: AK STUDIO](https://sketchfab.com/3d-models/642df0acc18f45d2af8eaa698bdccff7) | CC Attribution |
| `kowther/blinds-b.sog` | Blinds closing - option B | 10,000 | 1.2 × 0.79 × 0.44 | [Sketchfab: Geng4d](https://sketchfab.com/3d-models/7de2fb69daba4301982230946ff69031) | CC Attribution |
| `kowther/bonfire-boat-a.sog` | Bonfire silhouette: boat - inflatable (dark silhouette) | 14,000 | 3.5 × 0.66 × 3.2 | [Sketchfab: emelyarules](https://sketchfab.com/3d-models/051fe2f3a1484a0bafd45bad054754b1) | CC Attribution |
| `kowther/bonfire-boat-b.sog` | Bonfire silhouette: boat - dinghy (dark silhouette) | 14,000 | 2.27 × 0.87 × 3.5 | [Sketchfab: quanci](https://sketchfab.com/3d-models/1c62a45198444f12aed0f33b801c2e12) | CC Attribution |
| `kowther/bonfire-mosque.sog` | Bonfire silhouette: mosque replica (generic) (dark silhouette) | 16,000 | 5.65 × 4 × 4.92 | [Sketchfab: ferelian75](https://sketchfab.com/3d-models/cc24cab5418b43d981bce47f2ad98284) | CC Attribution |

## Not included

- Magpie (Tom McGrath) and the low-poly milk carton (Ada_A): Sketchfab "Standard" licence, which doesn't allow sharing the model files publicly. They're in your Downloads source folder if you want them for a private build.

## Source models

Original downloads are on the laptop in `Downloads\ots_props_split\` (Sketchfab) and `Downloads\ots_props_polypizza.zip`, `Downloads\ots_props_polyhaven.zip`. Not stored here (too big for GitHub).

## The script

`scripts/ghost-props.js` (PlayCanvas, on its own entity "GhostProps"). It streams the .sog files listed in `props-manifest.json` from this repo, shows them in waves (one story at a time, `perWave` at once) on an arc in front of you, builds each one up from drifting particles, holds, then burns it away. Touch one with a fingertip or controller and it pops. In AR it starts 8 s after the green cube is touched; on desktop Launch it starts after 2 s. All timings and the ghost colour are attributes on the entity.
