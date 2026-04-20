import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function GlassCard({ 
  children, 
  className, 
  glowOnHover = false, 
  padding = 'md',
  ...props 
}: GlassCardProps) {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-12'
  };

  return (
    <motion.div
      className={cn(
        'glass-card relative overflow-hidden',
        paddingMap[padding],
        glowOnHover && 'hover:shadow-[0_12px_32px_rgba(0,0,0,0.06),0_0_20px_rgba(255,49,49,0.05)] hover:border-red-500/20',
        className
      )}
      {...props}
    >
      {/* Subtle top reflection */}
      <div 
        className="absolute top-0 left-0 right-0 h-px" 
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} 
      />
      {children}
    </motion.div>
  );
}

export function GlassPanel({ 
  children, 
  className, 
  ...props 
}: Omit<GlassCardProps, 'glowOnHover'>) {
  return (
    <motion.div
      className={cn(
        'glass',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
