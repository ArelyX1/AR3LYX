import React from "react";

interface MarqueeProps {
  text?: string[];
  separator?: string;
  speed?: number;
}

export const Marquee: React.FC<MarqueeProps> = ({
  text = ["AR3LYX", 
    "I luv ts", 
    "event on the 14th", 
    "ヾ(*ゝω・*)ノヾ(*ゝω・*)ノヾ(*ゝω・*)ノヾ(*ゝω・*)ノ",
    "this is made with React & Astro",
    "✮✮✮✮✮✮✮",
    "strudel is open source",
    "LONG LIVE OPEN SOURCE",
    "=^◕⩊◕^==^◕⩊◕^==^◕⩊◕^==^◕⩊◕^="
],
  speed = 30,
  separator = " • ",
}) => {
  const totalText = text.join(separator) + separator;

  return (
    <>
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: scroll-left linear infinite;
          }
        `}
      </style>

      <div className="w-full overflow-hidden bg-[#1a1a1a] py-[15px] border-y border-[#00ff00] sticky top-0 z-[100]">
        <div
          className="flex w-max animate-marquee"
          style={{ animationDuration: `${speed}s` }}
        >
          {/* Duplicamos el contenido para que el loop sea infinito y sin saltos */}
          <span className="whitespace-nowrap text-[16px] text-[#00ff00] font-medium pr-5">
            {totalText}
          </span>
          <span className="whitespace-nowrap text-[16px] text-[#00ff00] font-medium pr-5">
            {totalText}
          </span>
        </div>
      </div>
    </>
  );
};