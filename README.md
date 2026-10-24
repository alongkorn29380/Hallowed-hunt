# Hallowed Hunt

A 3D, Pokémon-style battle game about folklore monsters. An exorcist faces five ghosts from around the world. You don't pick from a menu. You **type** what you would use against each ghost, guided by clues in your Ghost Book.

Built with React, TypeScript, Vite and React Three Fiber.

> **Status:** work in progress. See [Roadmap](#roadmap).

## How to play

1. Press **Start**. A ghost appears opposite your exorcist.
2. Type an item or action into "What will you use?" and press **Use**.
3. The game judges your answer:

   | Verdict | Message | Effect |
   | --- | --- | --- |
   | Fatal | "It's super effective!" | The ghost is defeated. |
   | Partial | "It had a little effect..." | The ghost recoils. You lose nothing. |
   | Wrong | "It had no effect." | You lose a heart, the ghost attacks, and the next clue unlocks. |

4. You have **5 hearts** across the whole run, and you win one back (up to 5) each time you defeat a ghost. If they reach 0, it's game over.
5. Repeating an answer you already tried is ignored. It costs no heart and isn't logged again.
6. Defeat all five ghosts to win.

### The ghosts

| Ghost | Region |
| --- | --- |
| Werewolf | Europe |
| Kappa | Japan |
| Dracula | Romania |
| Jiangshi | China |
| Golem | Czech Republic |

Each ghost has three clues, which unlock one at a time as you make wrong guesses. Each also has one or more fatal answers and a list of partial answers. The solutions are in [src/data/ghosts.ts](src/data/ghosts.ts), so no spoilers here.

## Getting started

Requires Node.js and npm.

```bash
npm install
npm run dev       # start the dev server with HMR
npm run build     # type-check (tsc -b) and build to dist/
npm run preview   # serve the production build
npm run lint      # ESLint
npx vitest run    # unit tests (judge + store)
```

A [Leva](https://github.com/pmndrs/leva) debug panel (collapsed, top-right) lets you tweak the camera, exorcist and ghost transforms, and a pixelation post-effect at runtime.

## Project structure

```
public/models/          GLB models (exorcist + one per ghost)
src/
  App.tsx               Canvas, lights, camera rig, post-processing, dialog box
  main.tsx              React entry point
  data/
    types.ts            GhostData / Fatal / Vfx types
    ghosts.ts           The five ghosts: clues, fatal and partial answers
  game/
    judge.ts            Normalises input and returns fatal / partial / wrong / empty
    store.ts            Zustand store: phase, hearts, ghost index, clues, attempts
    *.test.ts           Vitest tests for judge and store
  scene/
    Experience.tsx      Two platforms: exorcist (left) and current ghost (right)
    Exorcist.tsx        Loads and shadows the exorcist model, with a warm point light
    Ghost.tsx           Loads the ghost model for the current id
    Light.tsx           Hemisphere light plus two directional lights
    CameraRig.tsx       Gentle camera sway and screen shake (trauma-based)
    RetroPass.tsx       Optional pixelation post-effect (off by default)
    useIdle.tsx         Idle bobbing for the ghost and Head/ArmL/ArmR nodes
    useReaction.ts      Ghost lunges on a wrong answer and recoils on a partial one
  ui/
    DialogBox.tsx       Title, answer form, and win/lose screens
    BattleHUD.tsx       Ghost name, hearts and Ghost Book clues
```

## How it works

- **Judging** ([judge.ts](src/game/judge.ts)): input and keywords are lower-cased and stripped to `[a-z0-9]`. A keyword matches if it equals the input exactly. Keywords of 4 or more characters also match as a substring, so "a silver bullet please" still counts, while short keys like `sun` need an exact match.
- **State** ([store.ts](src/game/store.ts)): one Zustand store with phases `title → battle → ghostDown → won | lost`.
- **Scene reacts to state**: `useReaction` subscribes to the store and animates the ghost and shakes the camera when a new attempt is recorded.
- **Models**: GLB files are loaded with drei's `useGLTF`. Animation targets nodes named `Head`, `ArmL` and `ArmR` when present.

## Tech stack

React 19 · TypeScript · Vite · three.js · @react-three/fiber · @react-three/drei · @react-three/postprocessing · Zustand · Leva · Vitest · ESLint

## Roadmap

- VFX: voxel shatter on defeat, projectile, Dracula sunbeam (planned in `src/vfx/`)
- Title screen, paper-style UI, audio, mobile layout, performance
- Hide Leva (`<Leva hidden />`) before submission

## Notes

- GLB models are final assets. The generator scripts were removed, so `npm run models` no longer works.
- `howler` is installed but not used yet (audio is planned).
- The `beam` and `projectile` values exist in the ghost data, but their effects are not rendered yet.
- `node_modules/` and `dist/` are committed to git. Consider adding a `.gitignore`.
