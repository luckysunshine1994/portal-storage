# Lagan water occluder (Nov 2026)

Invisible 3D shell of the solid things around the river in the Lagan riverside scan (quay walls, railings,
lamp posts, the bridge piers and arches). Lagan Test's `lagan-sunset.js` loads it so the animated water
hides behind those things and covers the scan's own water and the loose blobs under it.

- Made from `LaganRiversideOct2026Splat300K` (splats with opacity > 0.35, within ~3 scan units of the
  river banks plus the bridge, from just above the water up to 4 scan units). Nothing in that folder was changed.
- `lagan-water-occluder.bin.gz`: gzip of a bitmask, 1 bit per voxel, x fastest, then height above the water, then z.
- `lagan-water-occluder.json`: voxel size (0.12 scan units, ~0.7 m), grid origin and size, water level and up vector used.
- Size: 34 KB.
