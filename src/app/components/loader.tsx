"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Wrap Next.js Image in motion()
const MotionImage = motion(Image);

export default function LogoAnimation() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/onboarding"); // Redirect after animation
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="flex items-center gap-6">
        {/* Left Logo */}
        <MotionImage
          src="/AudioreadLogo.png"
          alt="Left Logo"
          width={100}
          height={100}
          initial={{ x: -200, opacity: 0 }}
          animate={{ 
            x: [-20, -30, -20], // slide in, then move slightly closer
            opacity: [0, 1, 1],
            scale: [1, 1.1, 1], // zoom in & out
           }}
          transition={{
            x: { duration: 1, ease: "easeOut" }, // slide in once
            opacity: { duration: 1 },
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        {/* Right Logo */}
        <MotionImage
          src="/dulogo.png"
          alt="Right Logo"
          width={70}
          height={70}
          initial={{ x: 200, opacity: 0 }}
          animate={{
            x: [20, 30, 20], // slide in, then move slightly closer
            opacity: [0, 1, 1],
            scale: [1, 1.1, 1], // zoom in & out
          }}
           transition={{
            x: { duration: 1, ease: "easeOut" }, // slide in once
            opacity: { duration: 1 },
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      </div>
    </div>
  );
}