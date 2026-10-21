# Splat index — portal-storage

Every Gaussian splat used in Katya's PlayCanvas portal projects lives here, so it doesn't use PlayCanvas storage.
PlayCanvas only holds the **address** of a splat (a `lod-meta.json` link). To swap a splat, change that address (see bottom).

Link format: `https://raw.githubusercontent.com/luckysunshine1994/portal-storage/main/<Folder>/lod-meta.json`

| Folder | What it is | Splats | Detail levels | Used in (PlayCanvas) | Added |
|---|---|---|---|---|---|
| `LibrarySplat500K` | Bookshop/library scan, cut to 500k (same size as the working scenes) | 500,000 | 1 | Not used now. Ran better than 1M but still overloaded Quest 3 | 21 Oct 2026 |
| `LibrarySplat250K` | Bookshop/library scan, cut to 250k | 250,000 | 1 | **Library Test** → `splatUrl` and `riverLaganSplatUrl` | 21 Oct 2026 |
| `LibrarySplat1M` | Bookshop/library scan, cut to 1 million | 1,000,000 | 1 | Not used. Too heavy for Quest 3 (see Test results) | 21 Oct 2026 |
| `LibrarySplat5M` | Bookshop/library scan, full 5 million, streamed | 5,000,000 (+2.5M, 1.25M, 600k streaming levels) | 4 | Not used. Was in Library Test `riverLaganSplatUrl`; removed 21 Oct 2026 because the 1M version alone already froze Quest 3 (the portal script has no streaming support, so it would load everything) | 21 Oct 2026 |
| `RiverLaganSplat` | River Lagan | 500,000 | 1 | AR Portal Anchors Experiment (script default) | Aug 2026 |
| `DesertPyramidsSplat` | Desert pyramids | 500,000 | 1 | AR Portal Anchors Experiment → `splatUrl` | Aug 2026 |
| `RiverNileGashSplat` | River Nile / Gash | 500,000 | 1 | — | Aug 2026 |
| `0_0` (root) | Loose copy of the River Lagan chunk (same files as `RiverLaganSplat/0_0`) | 500,000 | — | — | Aug 2026 |

Older entries were filled in from the files themselves; nothing in those folders was changed.

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

- `skateTiltX` 180: the library scan comes out upside down, this flips it.
- `skateVerticalOffset` 2.7: puts the scan's floor at the portal's floor (floor measured from the splat data).
- `dissolveDelay` 100000: switches off the dissolve-and-swap, so after you step through you stay in the library and see your room through the door.
- Code changes in Library Test's own copy of xr-portal.js (the original project is untouched), each marked `// Library Test:`: 80% render resolution, Quest fixed foveation, and a 1.5 s lock after each crossing so a jumpy anchor can't flip you back out.

## Test results

- 21 Oct 2026, Quest 3, Library Test with LibrarySplat1M: portal black for about a minute while loading, then painterly blur, heavy lag, the portal swims with head movement, and the headset needed a hard reset. 1M is over the limit for this setup. The working scenes are 500k.
- 21 Oct 2026, LibrarySplat500K: better. Portal jumps but returns to its anchor; scene upside down; still overloaded. Stepping through flipped back to the room (dissolve/swap plus possible double crossing).
