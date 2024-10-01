import React from "react";
import { motion } from "framer-motion";

const WavyDivider = ({ position }) => {
  const isRight = position === "right";
  return (
    <div
      className={`absolute h-full w-16 ${
        isRight ? "left-0" : "right-0"
      } top-0 overflow-hidden`}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <linearGradient
            id="gradient"
            x1={isRight ? "100%" : "0%"}
            y1="0%"
            x2={isRight ? "0%" : "100%"}
            y2="0%"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,1)" />
          </linearGradient>
          <mask id="mask">
            <rect x="0" y="0" width="100" height="100" fill="url(#gradient)" />
          </mask>
        </defs>
        <motion.path
          d={
            isRight
              ? "M70,0 Q0,25 70,50 T50,100 L0,100 L0,0 Z"
              : "M30,0 Q100,25 30,50 T50,100 L100,100 L100,0 Z"
          }
          fill="#ffffff"
          mask="url(#mask)"
          initial={{
            d: isRight
              ? "M70,0 Q0,25 70,50 T50,100 L0,100 L0,0 Z"
              : "M30,0 Q100,25 30,50 T50,100 L100,100 L100,0 Z",
          }}
          animate={{
            d: isRight
              ? [
                  "M70,0 Q0,25 70,50 T50,100 L0,100 L0,0 Z",
                  "M80,0 Q10,35 60,50 T40,100 L0,100 L0,0 Z",
                  "M60,0 Q-10,15 80,50 T60,100 L0,100 L0,0 Z",
                  "M70,0 Q0,25 70,50 T50,100 L0,100 L0,0 Z",
                ]
              : [
                  "M30,0 Q100,25 30,50 T50,100 L100,100 L100,0 Z",
                  "M20,0 Q90,35 40,50 T60,100 L100,100 L100,0 Z",
                  "M40,0 Q110,15 20,50 T40,100 L100,100 L100,0 Z",
                  "M30,0 Q100,25 30,50 T50,100 L100,100 L100,0 Z",
                ],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 10,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};

export default WavyDivider;
