import React, { forwardRef } from 'react';

export interface AvatarParts {
  root: SVGSVGElement | null;
  head: SVGGElement | null;
  armLeft: SVGGElement | null;
  armRight: SVGGElement | null;
  eyes: SVGGElement | null;
  mouth: SVGPathElement | null;
  laptop: SVGGElement | null;
  codeNodes: SVGGElement | null;
}

interface PlaceholderAvatarProps {
  partsRef?: React.MutableRefObject<AvatarParts>;
  className?: string;
}

const PlaceholderAvatar = forwardRef<SVGSVGElement, PlaceholderAvatarProps>(
  ({ partsRef: propPartsRef, className }, forwardedRef) => {
    const dummyRef = React.useRef<AvatarParts>({
      root: null,
      head: null,
      armLeft: null,
      armRight: null,
      eyes: null,
      mouth: null,
      laptop: null,
      codeNodes: null,
    });
    const partsRef = propPartsRef || dummyRef;

    return (
      <svg
        id="avatar-root"
        ref={(el) => {
          partsRef.current.root = el;
          if (typeof forwardedRef === 'function') forwardedRef(el);
          else if (forwardedRef) forwardedRef.current = el;
        }}
        viewBox="0 0 220 240"
        width="160"
        height="175"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="avatarGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Soft ground shadow */}
        <ellipse cx="110" cy="225" rx="55" ry="10" fill="hsl(var(--foreground))" opacity="0.1" />

        {/* Floating Code/Data Nodes Background Effect */}
        <g id="avatar-code-nodes" ref={(el) => { partsRef.current.codeNodes = el; }}>
          <circle cx="45" cy="60" r="4" fill="hsl(var(--primary))" opacity="0.6" className="animate-pulse" />
          <circle cx="175" cy="50" r="5" fill="hsl(var(--secondary))" opacity="0.7" />
          <circle cx="185" cy="110" r="3" fill="hsl(var(--accent))" opacity="0.8" />
          <path d="M 45 60 L 75 80 M 175 50 L 145 75" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
        </g>

        {/* Developer Body / Hoodie */}
        <g filter="url(#shadow)">
          {/* Torso / Jacket */}
          <path
            d="M 60 145 C 60 120, 160 120, 160 145 L 168 215 C 168 220, 52 220, 52 215 Z"
            fill="hsl(var(--secondary))"
          />
          {/* Collar / V-neck Accent */}
          <path d="M 95 130 L 110 152 L 125 130 Z" fill="hsl(var(--background-secondary))" />
          {/* Inner Shirt Accent */}
          <path d="M 100 130 L 110 144 L 120 130 Z" fill="hsl(var(--primary))" />
        </g>

        {/* Left Arm — pivots from shoulder (65, 140) */}
        <g
          id="avatar-arm-left"
          ref={(el) => { partsRef.current.armLeft = el; }}
          style={{ transformOrigin: '65px 140px' }}
        >
          <path
            d="M 65 140 Q 40 165 52 195 Q 60 200 68 185 Q 55 160 75 145 Z"
            fill="hsl(var(--secondary))"
          />
          {/* Hand */}
          <circle cx="54" cy="196" r="7" fill="hsl(34, 45%, 80%)" />
        </g>

        {/* Right Arm — pivots from shoulder (155, 140) */}
        <g
          id="avatar-arm-right"
          ref={(el) => { partsRef.current.armRight = el; }}
          style={{ transformOrigin: '155px 140px' }}
        >
          <path
            d="M 155 140 Q 180 165 168 195 Q 160 200 152 185 Q 165 160 145 145 Z"
            fill="hsl(var(--secondary))"
          />
          {/* Hand */}
          <circle cx="166" cy="196" r="7" fill="hsl(34, 45%, 80%)" />
        </g>

        {/* Laptop Desk Setup (Foreground interactive element) */}
        <g id="avatar-laptop" ref={(el) => { partsRef.current.laptop = el; }}>
          {/* Laptop Base */}
          <path d="M 70 200 L 150 200 L 160 208 L 60 208 Z" fill="hsl(var(--foreground))" opacity="0.85" />
          {/* Laptop Screen */}
          <rect x="75" y="155" width="70" height="44" rx="4" fill="hsl(25, 15%, 15%)" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
          {/* Code Glow on Screen */}
          <rect x="80" y="160" width="60" height="34" rx="2" fill="hsl(220, 25%, 10%)" />
          <line x1="84" y1="166" x2="115" y2="166" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
          <line x1="84" y1="173" x2="128" y2="173" stroke="hsl(var(--secondary))" strokeWidth="2" strokeLinecap="round" />
          <line x1="84" y1="180" x2="105" y2="180" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" />
          <circle cx="132" cy="184" r="2.5" fill="hsl(var(--primary))" className="animate-ping" />
        </g>

        {/* Head Group — pivots from neck (110, 125) */}
        <g
          id="avatar-head"
          ref={(el) => { partsRef.current.head = el; }}
          style={{ transformOrigin: '110px 100px' }}
        >
          {/* Neck */}
          <rect x="102" y="115" width="16" height="15" rx="4" fill="hsl(34, 45%, 78%)" />

          {/* Ears */}
          <circle cx="62" cy="92" r="7" fill="hsl(34, 45%, 78%)" />
          <circle cx="158" cy="92" r="7" fill="hsl(34, 45%, 78%)" />

          {/* Face Base */}
          <rect x="65" y="55" width="90" height="70" rx="35" fill="hsl(34, 45%, 82%)" />

          {/* Hair (Modern Stylized Cut) */}
          <path
            d="M 62 70 C 60 38, 90 28, 110 28 C 135 28, 160 38, 158 70 C 150 48, 130 40, 110 40 C 90 40, 70 48, 62 70 Z"
            fill="hsl(25, 20%, 15%)"
          />
          {/* Hair Bangs Accent */}
          <path
            d="M 70 58 C 85 45, 105 52, 115 46 C 130 52, 145 48, 152 62 C 140 54, 120 54, 110 56 C 95 56, 80 52, 70 58 Z"
            fill="hsl(25, 25%, 22%)"
          />

          {/* Cheeks */}
          <circle cx="80" cy="100" r="7" fill="hsl(var(--primary))" opacity="0.35" />
          <circle cx="140" cy="100" r="7" fill="hsl(var(--primary))" opacity="0.35" />

          {/* Glasses Frame (Dev Signature) */}
          <rect x="75" y="80" width="28" height="20" rx="5" fill="none" stroke="hsl(25, 20%, 12%)" strokeWidth="2.5" />
          <rect x="117" y="80" width="28" height="20" rx="5" fill="none" stroke="hsl(25, 20%, 12%)" strokeWidth="2.5" />
          <line x1="103" y1="88" x2="117" y2="88" stroke="hsl(25, 20%, 12%)" strokeWidth="2.5" />

          {/* Eyes Group — inside glasses */}
          <g
            id="avatar-eyes"
            ref={(el) => { partsRef.current.eyes = el; }}
            style={{ transformOrigin: '110px 90px' }}
          >
            <circle cx="89" cy="90" r="4.5" fill="hsl(25, 20%, 12%)" />
            <circle cx="131" cy="90" r="4.5" fill="hsl(25, 20%, 12%)" />
            {/* Catchlights */}
            <circle cx="90.5" cy="88.5" r="1.5" fill="#FFFFFF" />
            <circle cx="132.5" cy="88.5" r="1.5" fill="#FFFFFF" />
          </g>

          {/* Mouth */}
          <path
            id="avatar-mouth"
            ref={(el) => { partsRef.current.mouth = el; }}
            d="M 98 108 Q 110 116 122 108"
            stroke="hsl(25, 20%, 12%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    );
  }
);

PlaceholderAvatar.displayName = 'PlaceholderAvatar';

export default PlaceholderAvatar;

