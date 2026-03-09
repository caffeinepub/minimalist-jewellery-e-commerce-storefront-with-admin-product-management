import { ReactNode, useEffect, useState } from 'react';

interface MotionFadeProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function MotionFade({ children, delay = 0, className = '' }: MotionFadeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  );
}
