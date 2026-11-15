# Rendering performance

Tested against `ffe09ec` (main before optimization), on map 50×50, seed 1337, viewport 960×640, one and four local players. Chromium used SwiftShader software rendering, not a phone GPU. The script pauses automatic animation, sets identical starting cameras, warms rendering, takes seven scene-update samples and reports their median. Draw calls count a full unchanged frame across every viewport, with renderer.info auto-reset disabled. Shadow updates caused by a world edit are measured separately by regression checks, not counted as idle-frame work.

| Metric | Before, 1 view | After, 1 view | Before, 4 views | After, 4 views |
| --- | ---: | ---: | ---: | ---: |
| Median synchronous scene update | 71.7 ms | 1.7 ms | 168.6 ms | 7.5 ms |
| Draw calls per unchanged frame | 5,099 | 616 | 63,474 | 1,777 |
| Uploaded geometries | 1,131 | 466 | 4,597 | 1,620 |

These are CPU submission/update measurements and deterministic scene counters, not GPU frame-time or FPS measurements. Absolute timings vary with machine load. The tests do not establish real-device frame rates or promise a fixed FPS.

## Changes

- Retain player, NPC and decoration models. Movement changes transforms; damage changes health-bar scale and color. Equipment changes rebuild only the affected player. Dead NPCs and consumed decorations are removed and disposed.
- Batch repeated resource meshes into InstancedMesh objects in 8×8 chunks. Gathering masks only the corresponding instance slots. Chunks remain cached during exploration and are cleared on a new game or return to the menu.
- Use simpler trees outside the nearby chunks, choose detail and visibility separately for each player's camera, and keep the central boss visible. Distant NPC models are created when approached.
- Cache directional shadows. Changes to world objects dirty the cache; idle animation and camera rotation reuse it. A dirty update uses a simplified complete shadow scene before drawing the individual views. This adds one scene pass only on updates, instead of recomputing shadows for every view every frame. Small idle breathing motions intentionally reuse the cached shadow.
- Use 1536² shadows for desktop solo and 1024² for touch/split-screen; bound pixel ratio by device and viewport count. Sustained slow frame delivery lowers resolution gradually, with a five-second cooldown; sustained headroom can restore it up to the chosen ceiling. No automatic simulation-speed changes.
- Reuse camera vectors, update projection only when needed, and raycast only the interactive tile mesh.

## Verification

```sh
npm ci
npx playwright install chromium
npm test
npm run test:render
node scripts/benchmark-render.cjs ARX_ARX_25x25_mobile_split.html
```

Optional environment variables: `CHROME_PATH` selects an existing Chromium binary; `THREE_PATH` serves a locally saved Three.js r128 during testing. The game itself still embeds WASM and loads Three.js as before.

The browser regression script verifies object identities during movement and damage, gathered-instance masking, monster removal, retained camps, equipment updates, boss warnings, restarts across all map sizes with the same seed, stable geometry identities across idle frames, idle shadow-cache reuse, split-screen draw-call limits, adaptive resolution and mobile HUD separation. `npm test` covers the 16 game/WASM tests.

## WASM decision

Moving the whole game to WASM is not justified by these measurements. Geometry management and render submission were the major observed costs; reducing unnecessary work addresses both without changing engines. A full rewrite would still issue GPU commands and pay for shaders, pixels and shadows. WASM can help a future CPU-heavy simulation or large batch of animation/physics calculations, after profiling identifies a remaining bottleneck. The existing WASM terrain kernel is retained; no new WASM speedup is claimed.

The APK, AAB and Windows EXE under `pobierz/` are older packaged builds and do not automatically incorporate these HTML changes. This change does not rebuild or sign them.
