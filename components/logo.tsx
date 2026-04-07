import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-12',
};

/**
 * Logo component - Replace the SVG with your own logo
 * You can use an Image component with your logo file or inline SVG
 */
export function Logo({ className, size = 'md' }: LogoProps): React.ReactElement {
  return (
    <div
      className={cn('flex items-center gap-2 font-bold text-white', sizeClasses[size], className)}
    >
      {/* Placeholder logo - Replace with your own */}
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand/70 flex items-center justify-center shrink-0">
        <span className="text-white font-bold text-sm">A</span>
      </div>
      <span className="tracking-tight">MyApp</span>
    </div>
  );
}
