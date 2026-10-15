import { EffectComposer, Pixelation } from '@react-three/postprocessing'
import { useControls } from 'leva'

export default function RetroPass()
{
    const { enabled, granularity } = useControls('Retro', {
        enabled: false,
        granularity: 
        {
            value: 6,
            min: 1,
            max: 20,
            step: 1
        }
    })

    if (!enabled) return null

    return (
        <EffectComposer>
            <Pixelation granularity = { granularity } />
        </EffectComposer>
    )
}