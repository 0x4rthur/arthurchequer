import { useEffect } from 'react';
import { useSpring } from 'motion/react';

export function useBotEyeOffset() {
  const eyeX = useSpring(0, { stiffness: 140, damping: 22 });
  const eyeY = useSpring(0, { stiffness: 140, damping: 22 });

  useEffect(() => {
    const onMove = (e) => {
      // normalize to -1..1 then clamp to ±1.4 SVG units
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      eyeX.set(nx * 1.4);
      eyeY.set(ny * 1.4);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [eyeX, eyeY]);

  return { eyeX, eyeY };
}
