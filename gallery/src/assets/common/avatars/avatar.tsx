/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styles from './avatar.module.scss';
import ImageWithFallback from '../images/image-fallback';

interface IProps {
  size: string;
  src: string;
  name: string;
  className?: string;
  border?: boolean;
  reSize?: boolean;
}

const colors = [
  '#b84a00', '#a84300', '#c27c0e',
  '#1e8449', '#229954', '#117a65',
  '#1a5276', '#21618c', '#148f77',
  '#6c3483', '#7d3c98', '#5d4037'
];

export default function AvatarCustom({
  size, src, name, className, border, reSize
}: IProps) {
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const stringToColor = (str: string) => {
    if (typeof str !== 'string') {
      return getRandomColor();
    }

    const index = Math.abs(
      str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % colors.length;
    return colors[index];
  };

  const backgroundColor = stringToColor(name);

  return (
    <div
      className={classNames(
        styles['avatar-box'],
        { [styles['avatar-border']]: border },
        'avatar-box',
        className
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {src ? (
        <ImageWithFallback
          options={{
            width: size,
            height: size
          }}
          src={src}
          alt="avatar"
        />
      ) : (
        <div
          className={`${styles['circle-avatar']} ${!name ? styles['profile-name-text-n-a'] : null}`}
          style={{
            backgroundColor,
            fontSize: `${Number(size) - 20}px`,
            paddingTop: '10%'
          }}
        >
          {name ? name.charAt(0) : 'N/A'}
        </div>
      )}
    </div>
  );
}
