import { useGLTF } from "@react-three/drei"
import Exorcist from "./Exorcist"
import Ghost from "./Ghost"
import VoxelShatter from "../vfx/VoxelShatter"
import Projectile from "../vfx/Projectile"
import SunBeam from "../vfx/SunBeam"
import { ghosts } from "../data/ghosts"
import { useGame } from "../game/store"

const GHOST_POS: [number, number, number] = [5, 0.8, 1]

function GhostShatter({ id }: { id: string })
{
    const { scene } = useGLTF(`./models/ghosts/${id}.glb`)
    return <VoxelShatter scene = { scene } floorY = { GHOST_POS[1] } />
}

export default function Experience()
{
    const ghostIndex = useGame ((s) => s.ghostIndex)
    const phase = useGame ((s) => s.phase)
    const impact = useGame ((s) => s.impact)
    const vfx = useGame ((s) => s.lastVfx)
    const ghost = ghosts[ghostIndex]
    const shattering = phase === 'ghostDown' && impact
    const ghostGone = shattering || phase === 'won'

    return (
        <>
            <group position = { GHOST_POS }>
                <mesh position-y = { -0.15 } receiveShadow>
                    <cylinderGeometry args = { [1.5, 1.6, 0.3, 32] } />
                    <meshStandardMaterial color = "#5C4E7C" />
                </mesh>
                <Ghost id = { ghost.id } hidden = { ghostGone } />
            </group>

            {/* outside the ghost group: voxel positions are already in world space */}
            {phase === 'ghostDown' && vfx === 'projectile' && !impact && <Projectile key = { `projectile-${ghost.id}` } id = { ghost.id } />}
            {phase === 'ghostDown' && vfx === 'beam' && <SunBeam key = { `beam-${ghost.id}` } />}
            {shattering && <GhostShatter key = { `shatter-${ghost.id}` } id = { ghost.id } />}

            <group position = { [-2, 0, 2] }>
                <mesh position-y = { -0.15 } receiveShadow>
                    <cylinderGeometry args = { [1.5, 1.6, 0.3, 32] } />
                    <meshStandardMaterial color = "#4A3F66" />
                </mesh>
                <Exorcist />
            </group>
        </>
    )
}
