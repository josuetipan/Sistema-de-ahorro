// Átomo: avatar de usuario con imagen o iniciales
export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-base' };

export function Avatar({ src, alt = '', name = '', size = 'md' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return <img src={src} alt={alt || name} className={`rounded-full object-cover ${sizes[size]}`} />;
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary-600 font-semibold text-white ${sizes[size]}`}
    >
      {initials || '?'}
    </div>
  );
}
