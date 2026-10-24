# Splat index — portal-storage

Every Gaussian splat used in Katya's PlayCanvas portal projects lives here, so it doesn't use PlayCanvas storage.
PlayCanvas only holds the **address** of a splat (a `lod-meta.json` link). To swap a splat, change that address (see bottom).

Link format: `https://raw.githubusercontent.com/luckysunshine1994/portal-storage/main/<Folder>/lod-meta.json`

| Folder | What it is | Splats | Detail levels | Used in (PlayCanvas) | Added |
|---|---|---|---|---|---|
| `OrmeauParkStream5M` | Ormeau Park woodland paths, full 5 million, streamed | 5,000,000 (+2.5M, 1.25M, 600k, 300k, 150k levels) | 6 | **Ormeau Test** → `splatUrl` (streamed, budget 300k) | 24 Oct 2026 |
| `OrmeauPark300K` | Ormeau Park, cut to 300k | 300,000 | 1 | Fallback for Ormeau Test | 24 Oct 2026 |
| `LibrarySplat500K` | Bookshop/library scan, cut to 500k (same size as the working scenes) | 500,000 | 1 | Not used now. Ran better than 1M but still overloaded Quest 3 | 21 Oct 2026 |
| `LibrarySplat250K` | Bookshop/library scan, cut to 250k | 250,000 | 1 | **Glass Sphere Test** placeholder; Library Test `riverLaganSplatUrl` (unused); in the GOOD VERSION checkpoint | 21 Oct 2026 |
| `LibrarySplatStream5M` | Bookshop/library scan, full 5 million, streamed with light levels for Quest | 5,000,000 (+2.5M, 1.25M, 600k, 300k, 150k levels) | 6 | **Library Test** → `splatUrl` (streamed, budget 300k) | 22 Oct 2026 |
| `LibrarySplat1M` | Bookshop/library scan, cut to 1 million | 1,000,000 | 1 | Not used. Too heavy for Quest 3 (see Test results) | 21 Oct 2026 |
| `LibrarySplat5M` | Bookshop/library scan, full 5 million, streamed | 5,000,000 (+2.5M, 1.25M, 600k streaming levels) | 4 | Not used. Was in Library Test `riverLaganSplatUrl`; removed 21 Oct 2026 because the 1M version alone already froze Quest 3 (the portal script has no streaming support, so it would load everything) | 21 Oct 2026 |
| `RiverLaganSplat` | River Lagan | 500,000 | 1 | AR Portal Anchors Experiment (script default) | Aug 2026 |
| `DesertPyramidsSplat` | Desert pyramids | 500,000 | 1 | AR Portal Anchors Experiment → `splatUrl` | Aug 2026 |
| `RiverNileGashSplat` | River Nile / Gash | 500,000 | 1 | — | Aug 2026 |
| `0_0` (root) | Loose copy of the River Lagan chunk (same files as `RiverLaganSplat/0_0`) | 500,000 | — | — | Aug 2026 |

Older entries were filled in from the files themselves; nothing in those folders was changed.

## Ormeau Park splats — where they came from

- Source: `D:\GaussianSplatting\Projects\OrmeauPark\output\ormeaupark_splat.ply` (5M splats, LichtFeld, 23 Oct 2026, from 8 videos = 4 walks x 2 phones, 16 Oct). Quality PSNR 14.7 (trunks sharp, leaves/sky hazy). Notes in that folder's README.txt.
- Quest versions made in `OrmeauPark\output\quest\` (same LOD method as the library, `--lod-chunk-extent 8`).
- Placement measured from the COLMAP cameras and ground: scan is tilted and about 5x smaller than real size. In Ormeau Test: `skateTiltX` 1.5, `skateTiltZ` 159, `skateYaw` -90 (path runs straight through the door), `skateScale` 5.2, `skateVerticalOffset` 1.84 (ground 0.354 scan units below the scan origin; origin is on the walked path).

## Library splats — where they came from

- Source: `D:\GaussianSplatting\Projects\Library\output\library_splat.ply` on Katya's PC (5,000,000 splats, 1.24 GB, LichtFeld Studio, 4 Oct 2026). **Never edit this file.**
- 500K and 250K were cut from the 1.25M in-between file (`temp\lod2.ply`) with `-d 500000` / `-d 250000`, then packed the same way.
- Converted with `D:\GaussianSplatting\Projects\Library\output\library_test\run_library_test.bat` (splat-transform 3.10.1, needs Node.js).
- Colour detail cut to base colour only (`-H 0`), same as the older scans, to keep Quest 3 light.
- 5M version: 4 levels of detail in ~4 m chunks (`--lod-chunk-extent 4`), so the headset only loads the chunks near and in front of you.
- Inside each `lod-meta.json` and each chunk's `meta.json`, file names were changed to full raw.githubusercontent links (same method as `RiverLaganSplat`), so the splat loads from GitHub wherever the project runs.
- Sizes: LibrarySplat1M ≈ 12 MB, LibrarySplat5M ≈ 100 MB.

## How to swap a splat in a PlayCanvas project

1. Open the project in the PlayCanvas Editor.
2. Select the **Camera** entity (its tags list which splat sits in which slot).
3. In the **xrPortal** script, paste the new `lod-meta.json` link into `splatUrl` (first scene) or `riverLaganSplatUrl` (second scene).
4. Update the Camera's tags and this table.

To add a new splat: put it in a new folder named `<Place>Splat<count>` (e.g. `LibrarySplat1M`), add a row here, and leave existing folders as they are.

## Library Test settings (xrPortal on Camera)

- `skateTiltZ` 180 (and `skateTiltX` 0): flips the upside-down scan. Flipping on X instead (tried first) also turned the library back-to-front, putting it on the room side of the door.
- `skateVerticalOffset` 0.7: puts the scan's floor at the real floor (2.7 was 2 m too high in the headset).
- `dissolveDelay` 100000: switches off the dissolve-and-swap, so after you step through you stay in the library and see your room through the door.
- Code changes in Library Test's own copy of xr-portal.js (the original project is untouched), each marked `// Library Test:`: 80% render resolution, Quest fixed foveation, a 1.5 s lock after each crossing so a jumpy anchor can't flip you back out, a forgiving doorway check, and the walk-in FIX: `_placePortalFrom` no longer resets `_prevCamPos` on every anchor update (Quest anchor updates were wiping the step-through detector every frame, so crossing never registered; bug came in with the anchors version). (A port of the official splat-portal depth method was tried and reverted on 21 Oct.)
- Project setting **Transparent Canvas: ON** (was off in the new project; your Anchors project has it on). Without it the doorway is black from inside instead of showing the room.
- Radial splat sorting on (code, marked `// Library Test:`), as in the official splat-portal example, to reduce colour flicker when turning your head.
- `primarySplatDelay` 0 (was 10 s wait after the button press before the splat loads) and `debugMarkerDuration` 0 (hides the three coloured calibration spheres).

## Ormeau Test (PlayCanvas project)

- Copy of Library Test (same walk-in fixes, transparent canvas, radial sorting, 300k budget), made 24 Oct. Launch scene 2631845.
- Its own copy of xr-portal.js adds two attributes, marked `// Ormeau Test:`: `skateScale` and `skateYaw`.
- Desktop check: streams to ~298k splats; standing on the path at real eye height, upright, looking down the path through the door.

## Saved good version

- PlayCanvas checkpoint **"GOOD VERSION 21 Oct 2026"** in Library Test (Version Control panel): walk-in works, room visible through door, LibrarySplat250K, transparent canvas, radial sorting. Restore it from Version Control if a later experiment goes wrong.

## Streaming (in progress)

- Code added (after the checkpoint): splat budget 300,000, and coarse-first loading for any library whose folder name contains `Stream`.
- Desktop test: the existing `LibrarySplat5M` streams, but its coarsest level is 600k, above the 300k budget, so it would still overload Quest.
- `LibrarySplatStream5M` (22 Oct): same scan with extra 300k and 150k levels (`temp\lod4.ply`, `temp\lod5.ply`), made with `run_stream5m.bat`. Desktop test 22 Oct: coarse 150k appears after ~7 s, then sharpens to ~297k within the 300k budget; walk-in still works. Now switched on in Library Test.

## Glass Sphere Test (PlayCanvas project)

- New project, separate from Library Test. Script: `scripts/glass-sphere.js` (copy in this repo). Splat world cropped inside a floating glass ball in passthrough; tap to enter AR, trigger/pinch re-places the ball in front of you.
- Uses `LibrarySplat250K` as a placeholder until the Belfast City Library scan is ready.
- Transparent Canvas ON. No screen-grab refraction (doesn't run in WebXR); glossy shell instead.

## Test results

- 21 Oct 2026, Quest 3, Library Test with LibrarySplat1M: portal black for about a minute while loading, then painterly blur, heavy lag, the portal swims with head movement, and the headset needed a hard reset. 1M is over the limit for this setup. The working scenes are 500k.
- 21 Oct 2026, LibrarySplat500K: better. Portal jumps but returns to its anchor; scene upside down; still overloaded. Stepping through flipped back to the room (dissolve/swap plus possible double crossing).
- 21 Oct 2026, LibrarySplat250K flipped: could look through but not walk in (stayed a flat image). Likely cause: portal sits low, so the head passed above the opening and the crossing never counted. Floor was 2 m too high.
- 21 Oct 2026: ported the official splat-portal example's depth method (previous script showed the library as a flat image in the frame, visible from both sides).
- 21 Oct 2026: official depth method reverted (three spheres, still flat). Flip changed from X to Z.
- 21 Oct 2026: found the walk-in bug by simulating on desktop. With anchor updates every frame the crossing never registered (old code); with the fix it registers. Same bug is in AR Portal Anchors Experiment (not changed).
- 21 Oct 2026: walk-in confirmed working on Quest. Doorway black from inside -> Transparent Canvas turned on. Colour flicker -> radial sorting turned on.
