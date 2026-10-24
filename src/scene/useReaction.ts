import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3, type Group } from 'three'
import { useGame } from '../game/store'
import { useShake } from './CameraRig'

type Kind = 'attack' | 'recoil'
const DURATION: Record<Kind, number> = { attack: 0.5, recoil: 0.35 }

export function useReaction(ref: RefObject<Group | null>, toward: [number, number, number])
{
    const dir = useMemo(() => new Vector3(...toward).normalize(), [toward])
    const anim = useRef<{ kind: Kind; t: number; hit: boolean } | null>(null)

    // ฟังเหตุการณ์: มีคำตอบใหม่เพิ่มเข้ามา
    useEffect(() =>
    {
        return useGame.subscribe((state, prev) =>
        {
            if (state.attempts.length <= prev.attempts.length) return

            const last = state.attempts[state.attempts.length - 1]
            if (last.verdict === 'wrong')
                anim.current = { kind: 'attack', t: 0, hit: false }
            if (last.verdict === 'partial')
                anim.current = { kind: 'recoil', t: 0, hit: false }
        })
    }, [])

    useFrame((_, dt) =>
    {
        const a = anim.current
        const group = ref.current
        if (!a || !group) return

        a.t += dt
        const p = Math.min(a.t / DURATION[a.kind], 1) 
        const k = Math.sin(Math.PI * p)        

        const dist = a.kind === 'attack' ? 2 : -0.4   

        group.position.x = dir.x * dist * k
        group.position.z = dir.z * dist * k

        if (a.kind === 'attack' && !a.hit && p >= 0.5) {
            a.hit = true
            useShake.getState().add(0.5)
        }

        if (p >= 1) {
            group.position.x = 0
            group.position.z = 0
            anim.current = null
        }
    })
}