# Scripts

Copies of the PlayCanvas scripts used with the splats in this repo, so they're versioned and easy to find.

| File | Used in (PlayCanvas project) | What it does |
|---|---|---|
| `glass-sphere.js` | **Glass Sphere Test** (on the Camera) | Shows a splat inside a floating glass ball in Quest 3 passthrough. Splat is cropped to the ball; glossy see-through shell. Based on PlayCanvas's official glass-refraction example, without the screen-grab refraction (doesn't run in WebXR). Tap to enter AR; trigger/pinch re-places the ball in front of you. |

Change the splat by editing the `splatUrl` attribute on the Camera in PlayCanvas (a `lod-meta.json` link from this repo). See `SPLATS_INDEX.md` in the repo root.
