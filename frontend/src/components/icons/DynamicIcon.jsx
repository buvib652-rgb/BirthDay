import React from 'react';
import HeartIcon from './HeartIcon';
import LoveHeartsIcon from './LoveHeartsIcon';
import SparkleIcon from './SparkleIcon';
import RoseIcon from './RoseIcon';
import GiftIcon from './GiftIcon';
import CakeIcon from './CakeIcon';
import LoveLetterIcon from './LoveLetterIcon';

export default function DynamicIcon({ name, size = '1em', className = '', style = {} }) {
  if (!name) return null;

  const key = String(name).trim();

  switch (key) {
    case '❤️':
    case '♥️':
    case 'heart':
    case 'love':
      return <HeartIcon size={size} className={className} style={style} />;

    case '💕':
    case '💖':
    case '💗':
    case '💞':
    case 'hearts':
      return <LoveHeartsIcon size={size} className={className} style={style} />;

    case '💓':
    case 'heartbeat':
      return <HeartIcon size={size} className={className} style={style} animated />;

    case '✨':
    case '💫':
    case 'sparkle':
      return <SparkleIcon size={size} className={className} style={style} />;

    case '🌹':
    case 'rose':
    case 'flower':
      return <RoseIcon size={size} className={className} style={style} />;

    case '🎁':
    case 'gift':
      return <GiftIcon size={size} className={className} style={style} />;

    case '🎂':
    case 'cake':
      return <CakeIcon size={size} className={className} style={style} />;

    case '💌':
    case 'envelope':
    case 'letter':
    case '💬':
    case '📞':
      return <LoveLetterIcon size={size} className={className} style={style} />;

    case '🌸':
    case '🌺':
      return <RoseIcon size={size} className={className} style={style} />;

    case '💝':
      return <HeartIcon size={size} color="#ff4d6d" className={className} style={style} />;

    case '😊':
    case '😄':
      return <SparkleIcon size={size} color="#ffb703" className={className} style={style} />;

    case '💪':
      return <SparkleIcon size={size} color="#ff758c" className={className} style={style} />;

    case '🧠':
      return <SparkleIcon size={size} color="#e0aaff" className={className} style={style} />;

    case '🌙':
      return <SparkleIcon size={size} color="#f0f3f4" className={className} style={style} />;

    case '🎵':
    case '🎶':
      return <SparkleIcon size={size} color="#b8c0ff" className={className} style={style} />;

    case '🦋':
      return <SparkleIcon size={size} color="#70d6ff" className={className} style={style} />;

    case '🤳':
    case '📸':
      return <SparkleIcon size={size} color="#ffd166" className={className} style={style} />;

    case '🌧️':
      return <SparkleIcon size={size} color="#a0c4ff" className={className} style={style} />;

    case '⭐':
      return <SparkleIcon size={size} color="#ffd700" className={className} style={style} />;

    case '🌍':
      return <SparkleIcon size={size} color="#9bf6ff" className={className} style={style} />;

    case '🎬':
      return <SparkleIcon size={size} color="#ffc6ff" className={className} style={style} />;

    default:
      // Fallback: render an elegant sparkle icon if unknown string
      return <SparkleIcon size={size} className={className} style={style} />;
  }
}
