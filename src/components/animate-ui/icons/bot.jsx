'use client';;
import * as React from 'react';
import { motion } from 'motion/react';

import { getVariants, useAnimateIconContext, IconWrapper } from '@/components/animate-ui/icons/icon';

const animations = {
  default: {
    path1: {},
    rect: {},
    path2: {},
    path3: {},

    path4: {
      initial: {
        x: 0,
        y: 0,
      },
      animate: {
        x: [0, -1.5, 1.5, 0],
        y: [0, 1.5, 1.5, 0],
        transition: {
          ease: 'easeInOut',
          duration: 1.3,
        },
      },
    },

    path5: {
      initial: {
        x: 0,
        y: 0,
      },
      animate: {
        x: [0, -1.5, 1.5, 0],
        y: [0, 1.5, 1.5, 0],
        transition: {
          ease: 'easeInOut',
          duration: 1.3,
        },
      },
    }
  },

  blink: {
    path1: {},
    rect: {},
    path2: {},
    path3: {},

    path4: {
      initial: {
        scaleY: 1,
      },
      animate: {
        scaleY: [1, 0.5, 1],
        transition: {
          ease: 'easeInOut',
          duration: 0.6,
        },
      },
    },

    path5: {
      initial: {
        scaleY: 1,
      },
      animate: {
        scaleY: [1, 0.5, 1],
        transition: {
          ease: 'easeInOut',
          duration: 0.6,
        },
      },
    }
  },

  wink: {
    path1: {},
    rect: {},
    path2: {},
    path3: {},

    path4: {
      initial: {
        scaleY: 1,
      },
      animate: {
        scaleY: [1, 0.5, 1],
        transition: {
          ease: 'easeInOut',
          duration: 0.6,
        },
      },
    },

    path5: {}
  },

  happy: {
    head: {
      initial: { rotate: 0, x: 0, y: 0 },
      animate: {
        rotate: [0, 1.4, -1.4, 1.4, -1.4, 0.8, -0.8, 0],
        x: [0, 0.5, -0.5, 0.5, -0.5, 0.3, -0.3, 0],
        y: [0, -0.3, 0.3, -0.3, 0.3, -0.2, 0.2, 0],
        transition: {
          ease: 'easeInOut',
          duration: 2.2,
          times: [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.85, 1],
        },
      },
    },

    path1: {},
    rect: {},
    path2: {},
    path3: {},

    path4: {
      initial: { d: 'M15 13 L15 14 L15 15' },
      animate: {
        d: [
          'M15 13 L15 14 L15 15',
          'M14 14.4 L15 13.4 L16 14.4',
          'M14 14.4 L15 13.4 L16 14.4',
          'M15 13 L15 14 L15 15',
        ],
        transition: {
          ease: 'easeInOut',
          duration: 2.2,
          times: [0, 0.18, 0.85, 1],
        },
      },
    },

    path5: {
      initial: { d: 'M9 13 L9 14 L9 15' },
      animate: {
        d: [
          'M9 13 L9 14 L9 15',
          'M8 14.4 L9 13.4 L10 14.4',
          'M8 14.4 L9 13.4 L10 14.4',
          'M9 13 L9 14 L9 15',
        ],
        transition: {
          ease: 'easeInOut',
          duration: 2.2,
          times: [0, 0.18, 0.85, 1],
        },
      },
    },
  },
};

function IconComponent({ size, pauseMouseTracking, ...props }) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);
  const eyeRef = React.useRef(null);

  React.useEffect(() => {
    const el = eyeRef.current;
    if (!el) return;
    // CSS transition handles smooth following — no rAF needed
    el.style.transition = 'transform 0.16s ease-out';

    if (pauseMouseTracking) {
      el.style.transform = 'translate(0px, 0px)';
      return;
    }

    const onMove = (e) => {
      // normalize to -1..1, clamp to ±2px in SVG CSS space
      const nx = ((e.clientX / window.innerWidth)  * 2 - 1) * 2;
      const ny = ((e.clientY / window.innerHeight) * 2 - 1) * 2;
      el.style.transform = `translate(${nx}px, ${ny}px)`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [pauseMouseTracking]);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <motion.g
        variants={variants.head}
        initial="initial"
        animate={controls}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <motion.path
          d="M12 8V4H8"
          variants={variants.path1}
          initial="initial"
          animate={controls} />
        <motion.rect
          width={16}
          height={12}
          x={4}
          y={8}
          rx={2}
          variants={variants.rect}
          initial="initial"
          animate={controls} />
        <motion.path
          d="M2 14h2"
          variants={variants.path2}
          initial="initial"
          animate={controls} />
        <motion.path
          d="M20 14h2"
          variants={variants.path3}
          initial="initial"
          animate={controls} />
        <g ref={eyeRef}>
          <motion.path
            d="M15 13 L15 14 L15 15"
            variants={variants.path4}
            initial="initial"
            animate={controls} />
          <motion.path
            d="M9 13 L9 14 L9 15"
            variants={variants.path5}
            initial="initial"
            animate={controls} />
        </g>
      </motion.g>
    </motion.svg>
  );
}

function Bot(props) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { animations, Bot, Bot as BotIcon };
