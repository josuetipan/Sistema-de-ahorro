import { useRef } from 'react';

import { NavIcon } from '@shared/ui/atoms/NavIcon';



const SIZE_CLASS = {

  sm: 'h-8 w-8 text-xs',

  md: 'h-12 w-12 text-base',

  lg: 'h-28 w-28 text-2xl',

} as const;



interface PerfilAvatarProps {

  nombre: string;

  fotoPerfil?: string;

  size?: keyof typeof SIZE_CLASS;

  layout?: 'circle' | 'card';

  editable?: boolean;

  onFotoChange?: (dataUrl: string) => void;

  className?: string;

}



export function PerfilAvatar({

  nombre,

  fotoPerfil,

  size = 'md',

  layout = 'circle',

  editable = false,

  onFotoChange,

  className = '',

}: PerfilAvatarProps) {

  const inputRef = useRef<HTMLInputElement>(null);

  const inicial = nombre.charAt(0).toUpperCase();

  const isCard = layout === 'card';



  const abrirSelector = () => {

    if (editable) inputRef.current?.click();

  };



  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if (!file || !onFotoChange) return;



    const reader = new FileReader();

    reader.onload = () => {

      if (typeof reader.result === 'string') onFotoChange(reader.result);

    };

    reader.readAsDataURL(file);

    e.target.value = '';

  };



  return (

    <div className={`relative shrink-0 ${isCard ? 'h-full w-full' : ''} ${className}`}>

      <button

        type="button"

        onClick={abrirSelector}

        disabled={!editable}

        className={[

          'group relative overflow-hidden motion-safe-transition',

          isCard

            ? 'h-full w-full min-h-[16rem] rounded-xl bg-slate-50'

            : ['rounded-full ring-2 ring-slate-200', SIZE_CLASS[size]].join(' '),

          editable

            ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2'

            : 'cursor-default',

          !isCard && editable ? 'hover:ring-emerald-400' : '',

        ].join(' ')}

        aria-label={editable ? 'Subir foto de perfil' : `Foto de ${nombre}`}

      >

        {fotoPerfil ? (

          <img

            src={fotoPerfil}

            alt={`Foto de ${nombre}`}

            className="h-full w-full object-cover"

          />

        ) : isCard ? (

          <span className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-400">

            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">

              <NavIcon name="upload" size={24} />

            </span>

            <span className="text-sm font-medium text-slate-500">Subir imagen</span>

            <span className="text-xs text-slate-400">JPG, PNG o WebP</span>

          </span>

        ) : (

          <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-emerald-100 font-semibold text-blue-700">

            {inicial}

          </span>

        )}

        {editable && fotoPerfil && (

          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 text-white opacity-0 motion-safe-transition group-hover:bg-black/40 group-hover:opacity-100">

            <NavIcon name="upload" size={isCard ? 28 : size === 'lg' ? 22 : 16} />

            {isCard && <span className="text-sm font-medium">Cambiar imagen</span>}

          </span>

        )}

      </button>

      {editable && (

        <input

          ref={inputRef}

          type="file"

          accept="image/jpeg,image/png,image/webp"

          className="sr-only"

          onChange={onFileChange}

        />

      )}

    </div>

  );

}

