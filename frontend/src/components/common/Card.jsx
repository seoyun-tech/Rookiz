import { twMerge } from 'tailwind-merge';

/**
 * Content Card Component
 */
export function Card({ title, image, size = 'md', className, children, onClick }) {
  const sizeStyles = {
    lg: 'w-full aspect-[2/1] rounded-4xl p-10',
    md: 'w-full aspect-[4/3] rounded-3xl p-6',
    sm: 'w-full aspect-square rounded-2xl p-4',
  };

  const titleStyles = {
    lg: 'text-2xl md:text-5xl font-black md:leading-10 font-sans',
    md: 'text-xl md:text-4xl font-extrabold md:leading-8 font-sans',
    sm: 'text-lg md:text-2xl font-bold md:leading-6 font-sans',
  };

  return (
    <div 
      onClick={onClick}
      className={twMerge(
        'relative overflow-hidden bg-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow group',
        sizeStyles[size],
        className
      )}
    >
      {/* Background Image */}
      {image && (
        <img 
          src={image} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
      )}
      
      {/* Overlay for readability - Matching Figma Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end text-white">
        <h3 className={twMerge(titleStyles[size], 'truncate')}>{title}</h3>
        {children}
      </div>
    </div>
  );
}
