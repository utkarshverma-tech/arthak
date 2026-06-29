import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";

interface ArthakLoaderProps {
  size?: number | string;
  speed?: number; // duration in seconds of the shine sweep
  loop?: boolean;
  className?: string;
  logoSrc?: string;
}

export function ArthakLoader({
  size = 46, // Increased default size slightly
  speed = 1.5,
  loop = true,
  className = "",
  logoSrc = logoImg,
}: ArthakLoaderProps) {
  // Convert size to numeric height in pixels
  const heightVal = typeof size === "number" ? size : parseInt(String(size), 10) || 46;
  
  // Dynamic scale factor based on the base height of 40px
  const scale = heightVal / 40;
  
  // Calculate proportionate dimensions to crop and center the padded logo
  const containerWidth = 124 * scale; // Increased slightly for width padding
  const containerHeight = heightVal;
  const imgLeft = -42 * scale; // Centered to match AuthModal offsets exactly and prevent left crop
  const imgHeight = 150 * scale; // Scaled up slightly for bolder presence

  return (
    <div
      className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{
        width: "100%",
        height: `${containerHeight}px`,
      }}
    >
      {/* Base Logo Container (Gently breathes to stay organic) */}
      <motion.div
        animate={{
          scale: [0.99, 1.01, 0.99],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative overflow-hidden"
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
        }}
      >
        {/* Dimmed Base Logo Layer */}
        <img
          src={logoSrc}
          alt="ARTHAK loader base"
          className="absolute max-w-none object-contain opacity-70"
          style={{
            height: `${imgHeight}px`,
            width: "auto",
            left: `${imgLeft}px`,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />

        {/* Shiny Masked Logo Layer */}
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: `url(${logoSrc})`,
            WebkitMaskSize: `auto ${imgHeight}px`,
            WebkitMaskPosition: `${imgLeft}px 50%`,
            WebkitMaskRepeat: "no-repeat",
            maskImage: `url(${logoSrc})`,
            maskSize: `auto ${imgHeight}px`,
            maskPosition: `${imgLeft}px 50%`,
            maskRepeat: "no-repeat",
          }}
        >
          {/* Animated Shine Gradient Stripe (Sweeps Left-to-Right) */}
          <motion.div
            className="absolute inset-0 transform-gpu"
            style={{
              width: "200%",
              height: "100%",
              left: "-50%",
              background: "linear-gradient(105deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.7) 40%, #14b8a6 50%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0) 80%)",
              willChange: "transform",
            }}
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: speed,
              ease: "easeInOut",
              repeat: loop ? Infinity : 0,
              repeatDelay: 0.3,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
