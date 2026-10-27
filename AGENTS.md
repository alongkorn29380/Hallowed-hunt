# Hallowed Hunt

Entry for Bruno Simon's Three.js Journey challenge (theme: "Hallowed").
A retro, Pokemon-style battle scene: a Thai exorcist (the player) fights foreign monsters by
typing each monster's weakness. Voxel (cube) characters, optional pixelated "retro mode".
Target: submit by 31 Oct - 1 Nov 2026 (aim to submit a day before the real deadline).

## Commands

- `npm run dev`            dev server
- `npm run build`          `tsc -b` + `vite build` (this is the type check; vitest does NOT type-check)
- `npx vitest run`         all tests
- `npx vitest run src/game` only game logic tests

After any change: run `npx vitest run` and `npm run build`. Do not commit unless asked.

## Stack

Vite + React + TypeScript, React Three Fiber, @react-three/drei, @react-three/postprocessing
(`Pixelation`), zustand (game state + camera shake), leva (debug sliders only), vitest.
No other runtime dependencies without asking.

## Structure

```
public/models/exorcist.glb     (GLBs are final assets; the generator scripts were removed)
public/models/ghosts/<id>.glb  werewolf, kappa, dracula, jiangshi, golem
src/data/types.ts              GhostData, Fatal, Vfx ('beam' | 'projectile' | 'none')
src/data/ghosts.ts             ghost data, in play order (werewolf = tutorial ... golem = boss)
src/game/judge.ts              judge(ghost, input) -> fatal | partial | wrong | empty (+ vfx)
src/game/store.ts              zustand: phase, hearts, ghostIndex, clues, attempts, lastVfx
src/scene/                     Experience, Light, CameraRig (+ useShake), Exorcist, Ghost,
                               RetroPass, useIdle.tsx, useReaction.ts
src/vfx/VoxelShatter.tsx       InstancedMesh shatter built from node userData.voxels
src/ui/                        DialogBox, BattleHUD (HTML overlay, outside <Canvas>)
```

## Game rules (invariants, tests depend on these)

- 3 hearts for the whole run (`MAX_HEARTS` exported from store.ts), not per ghost.
- Verdicts: `fatal` kills, `partial` ("a little effect") costs nothing, `wrong` costs a heart and
  reveals the next clue (max 3), `empty` is ignored. Fatal is always checked before partial.
- Input is normalized (lowercase, only a-z0-9) on both sides. A key matches if it equals the input,
  or if the key has 4+ characters and is contained in the input. Keys shorter than 4 chars
  must match exactly (so "sunday" does not match "sun").
- Repeating an answer (after normalizing) is free and is not recorded.
- Phases: title -> battle -> ghostDown -> (next) battle ... -> won; hearts at 0 -> lost.
- All player-facing text is English. Ghost data: 3 clues, from vague to almost-the-answer.
- Tests must be data-driven (use `ghosts[...]`, not hard-coded ghost names or counts).
  `src/data/ghosts.test.ts` checks every fatal/partial key against the judge; keep it passing.

## Models (voxel GLBs)

- 1 voxel = 0.1 m. Origin at the feet, characters face +Z, Y is up.
- Part nodes by name: `Body`, `Head`, `ArmR`, `ArmL`, `LegR`, `LegL` (jiangshi has no legs).
  Pivots are at the joints, so rotating a node rotates around its joint. Look parts up with
  `scene.getObjectByName(...)`.
- Root node extras: `{ voxelSize, palette }`; each part node extras: `{ voxels: [cx, cy, cz, paletteIdx, ...] }`.
- GLBs are final assets. Do not regenerate or replace them without asking; if a model must change,
  it is redone in Blender and re-exported with the same node names and extras.

## R3F conventions

- Hooks only inside components. Never call a hook at module level.
- No React state updates inside `useFrame`. Mutate refs/objects. Inside `useFrame`, read zustand with
  `useX.getState()`, not the hook (the hook would re-render every frame).
- Create `Vector3` and other constants outside components.
- Do not let `useFrame` and a React prop write the same property. Animate a wrapper `<group>` instead
  (see Ghost.tsx: `useIdle` writes y, `useReaction` writes x/z, Leva position/rotation sit on the inner group).
- Leva vectors: use `{ x, y, z }` objects as `value` (arrays come back as arrays, no `.x`).
- R3F silently ignores unknown props. If something does not move, check the spelling first.
- Shadows need all three: Canvas `shadows`, light `castShadow`, mesh `castShadow`/`receiveShadow`.
- Instanced meshes that move their instances need `frustumCulled={false}`.
- Subscriptions (`store.subscribe`) must be cleaned up in the `useEffect` return.

## Code style (match the existing files)

4-space indent, single quotes, no semicolons. Use `import type` for types. Match the formatting of
the surrounding file rather than reformatting it.

## Working with the owner (Boss)

- Talk in Thai with English technical terms. Concise, mobile-friendly. Be direct and honest;
  do not flatter. Say plainly when an idea or a result is not good.
- He is learning R3F/Three.js while building this. Default to teaching: explain the concept,
  give small hints or a fill-in-the-blank skeleton (`___`), then review his code.
  Give the full code only when he asks ("ขอเต็ม", "ขอเฉลย") and then just give it.
- When he pastes code, first say whether it is correct, then name the exact bug and why
  (typos, wrong direction in a condition, hooks rules, missing ref). Do not rewrite what works.
- Do not write to his machine unless he links a folder; give code and commands in chat.

## Schedule (2026)

- Done by 24 Oct: scene, lights, locked camera + shake, retro pass, game logic + tests, HUD/dialog,
  idle and attack/recoil animation
- 24-27 Oct: VFX (voxel shatter, projectile, Dracula sunbeam, camera shake/flash)
- 28-30 Oct: title screen, paper-style UI, audio, mobile layout, performance
- 31 Oct - 1 Nov: test, deploy (Vercel/Netlify), submit
Scope is locked: 5 ghosts, one stage (palette swaps), VFX limited to projectile, voxel shatter,
and sunbeam. Mummy/medusa/pontianak only if there is spare time. If the loop is not solid by the
checkpoints, cut ghosts before cutting polish.

## Known TODOs

- Pixelation `granularity` is in screen pixels, so the look changes with screen size. Defaults ~8;
  higher makes faces unreadable. Better long-term: low `dpr` + `image-rendering: pixelated`.
- Repeated answers give no feedback; show "You already tried that." (needs `submit` to report it).
- Disable Next until the shatter animation finishes; sequence beam/projectile before the shatter.
- Per-ghost pose (position/rotation) is shared from Leva; move to ghost data if models differ.
- Remove or hide Leva (`<Leva hidden />`) before submission; keep `DEBUG_CAMERA = false`.
- Bundle is ~1.5 MB (three.js); the Vite chunk warning is ignored until the polish phase.
