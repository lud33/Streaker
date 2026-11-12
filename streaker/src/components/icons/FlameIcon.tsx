import { cn } from '@/lib/utils';

interface FlameIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export function FlameIcon({ className, size = 24, animated = true }: FlameIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(animated && 'animate-flame', className)}
    >
      <defs>
        <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="hsl(17 100% 50%)" />
          <stop offset="50%" stopColor="hsl(25 100% 55%)" />
          <stop offset="100%" stopColor="hsl(38 92% 50%)" />
        </linearGradient>
        <filter id="flameGlow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M12 23C16.1421 23 19.5 19.6421 19.5 15.5C19.5 13.5 18.5 11.5 17 10C16.5 9.5 16 8.5 16 7.5C16 6.5 16.5 5 17 4C14.5 5 13 6.5 12 8C11 6.5 10 5.5 8 4.5C8.5 5.5 8.5 6.5 8 7.5C7.5 8.5 6.5 9.5 6 10C4.5 11.5 4 13 4 15C4 19.4183 7.58172 23 12 23Z"
        fill="url(#flameGradient)"
        filter="url(#flameGlow)"
      />
      <path
        d="M12 23C14.2091 23 16 20.9853 16 18.5C16 17.5 15.5 16.5 15 16C14.7 15.7 14.5 15.2 14.5 14.5C14.5 14 14.7 13.5 15 13C13.5 13.5 12.5 14.5 12 15.5C11.5 14.5 11 14 10 13.5C10.2 14 10.2 14.5 10 15C9.8 15.5 9.3 15.8 9 16C8.5 16.5 8 17.5 8 18.5C8 20.9853 9.79086 23 12 23Z"
        fill="hsl(45 100% 60%)"
        opacity="0.9"
      />
    </svg>
  );
}
