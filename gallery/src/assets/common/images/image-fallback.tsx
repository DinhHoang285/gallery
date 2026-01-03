'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { shimmer, toBase64 } from '@lib/file';

interface IProps {
  options?: any;
  alt: string;
  src: string;
  fallbackSrc?: string;
  onClick?: () => void;
}

export default function ImageWithFallback({
  src,
  alt,
  options = {},
  onClick,
  fallbackSrc = '/no-image.jpg'
}: IProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setAttempted(false);
  }, [src, fallbackSrc]);

  const opts = {
    width: 500,
    height: 500,
    sizes: '(max-width: 768px) 100vw, (max-width: 2100px) 20vw',
    loading: options.priority ? 'eager' : 'lazy',
    ...options,
  };

  const handleError = () => {
    if (!attempted) {
      setAttempted(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image
      alt={alt || 'image'}
      src={imgSrc}
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(opts.width, opts.height))}`}
      onError={handleError}
      onClick={onClick}
      {...opts}
    />
  );
}
