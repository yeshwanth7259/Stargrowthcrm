import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const StarGrowthHubLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Star Logo Graphic */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Star Outline Path */}
          <path
            d="M50 8 
               L61.8 33.2 
               L89.1 36.5 
               L69.1 55.2 
               L74.4 82.2 
               L50 68.8 
               L25.6 82.2 
               L30.9 55.2 
               L10.9 36.5 
               L38.2 33.2 
               Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Dynamic Red Swoosh / Arc Stroke sweeping across top-left ray */}
          <path
            d="M 12 40 
               C 18 18, 35 8, 55 10 
               C 72 12, 88 18, 96 14 
               C 80 26, 60 28, 42 26 
               C 26 24, 18 30, 12 40 Z"
            fill="#E11D48"
          />

          {/* Inner Accent Lines */}
          <path
            d="M50 20 L50 65 M30 38 L70 38 M20 70 L80 70"
            stroke="#E11D48"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`${textSizes[size]} font-black tracking-wider text-white uppercase font-sans`}>
              STAR GROWTH HUB
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase block">
            Digital Marketing Agency
          </span>
        </div>
      )}
    </div>
  );
};
