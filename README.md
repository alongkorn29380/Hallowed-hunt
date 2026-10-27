# Hallowed Hunt

A 3D, Pokémon-style battle game about folklore monsters. An exorcist faces ten ghosts from around the world. You don't pick from a menu. You **type** what you would use against each ghost, guided by clues in your Ghost Book.

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
5. Repeating an answer you already tried costs no heart and isn't logged again; the game tells you ("You already tried that.").
6. Partial answers chip away at the ghost's HP bar, but only a fatal answer finishes it.
7. Defeat all ten ghosts to win. At the end, click a banished ghost to open its card (3D portrait, weakness and clues).

### The ghosts

| Ghost | Region |
| --- | --- |
| Werewolf | Europe |
| Kappa | Japan |
| Dracula | Romania |
| Jiangshi | China |
| Golem | Czech Republic |
| Oni | Japan |
| Krasue | Thailand |
| Medusa | Greece |
| Fairy | Ireland |
| Sphinx | Egypt |

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

A [Leva](https://github.com/pmndrs/leva) debug panel exists for tweaking the camera, exorcist and ghost transforms, and a pixelation post-effect. It is hidden (`<Leva hidden />` in `App.tsx`); switch it back to `<Leva collapsed />` while developing.

The production build uses relative asset paths (`base: './'`), so the contents of `dist/` can be hosted at the root or in a sub-folder. Any static host works (for example Vercel or Netlify with build command `npm run build` and output directory `dist`).

Music is generated in the browser with the Web Audio API (no audio files). It starts when you press **Start**; use the **♪** button (bottom left) to mute.

## Project structure

```
public/models/          GLB models (exorcist + one per ghost)
src/
  App.tsx               Canvas, lights, camera rig, post-processing, dialog box
  main.tsx              React entry point
  data/
    types.ts            GhostData / Fatal / Vfx types
    ghosts.ts           The ten ghosts: clues, fatal and partial answers
  game/
    judge.ts            Normalises input and returns fatal / partial / wrong / empty
    store.ts            Zustand store: phase, hearts, ghost index, clues, attempts
    ghostHp.ts          Ghost health bar value (partial answers chip away at it)
    *.test.ts           Vitest tests for judge, store and ghost HP
  audio/
    music.ts            Procedural background music (Web Audio) and mute flag
  vfx/
    VoxelShatter.tsx    Ghost breaks into voxels when defeated
    Projectile.tsx      Per-ghost projectile shapes
    SunBeam.tsx         Column of light for beam kills
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
    DialogBox.tsx       Answer form and battle messages
    BattleHUD.tsx       Ghost name, HP bar, hearts and Ghost Book clues
    TitleScreen.tsx     Title screen
    EndScreen.tsx       Win and lose screens
    GhostCard.tsx       Card with a 3D portrait, weakness and clues
    MuteButton.tsx      Music on/off
    ui.css              Paper-style design
```

## How it works

- **Judging** ([judge.ts](src/game/judge.ts)): input and keywords are lower-cased and stripped to `[a-z0-9]`. A keyword matches if it equals the input exactly. Keywords of 4 or more characters also match as a substring, so "a silver bullet please" still counts, while short keys like `sun` need an exact match.
- **State** ([store.ts](src/game/store.ts)): one Zustand store with phases `title → battle → ghostDown → won | lost`.
- **Scene reacts to state**: `useReaction` subscribes to the store and animates the ghost and shakes the camera when a new attempt is recorded.
- **Models**: GLB files are loaded with drei's `useGLTF`. Animation targets nodes named `Head`, `ArmL` and `ArmR` when present.

## Tech stack

React 19 · TypeScript · Vite · three.js · @react-three/fiber · @react-three/drei · @react-three/postprocessing · Zustand · Leva · Vitest · ESLint

## Notes

- GLB models are final assets. The generator scripts were removed, so `npm run models` no longer works.
- `howler` is installed but not used (the music is synthesised, not played from a file).
- The layout targets desktop browsers; there is no mobile layout.
- Possible next steps: sound effects, a mirror-flash effect for Medusa, a cue when a defeated ghost returns a heart.
