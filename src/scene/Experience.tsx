import Exorcist from "./Exorcist"
import Ghost from "./Ghost"

export default function Experience()
{
    return (
        <>
            <group position = { [5, 0.8, 1] }>
                <mesh position-y = { -0.15 } receiveShadow>
                    <cylinderGeometry args = { [1.5, 1.6, 0.3, 32] } />
                    <meshStandardMaterial color = "#5C4E7C" />
                </mesh>
                <Ghost id = "dracula" />
            </group>

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