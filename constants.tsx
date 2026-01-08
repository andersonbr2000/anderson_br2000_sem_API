
import React from 'react';
import { TeamColor } from './types';

export const COLORS: TeamColor[] = ['Azul', 'Preto', 'Branco', 'Amarelo'];

export const getColorStyles = (color: TeamColor) => {
  switch (color) {
    case 'Azul':
      return 'bg-blue-600 text-white';
    case 'Preto':
      return 'bg-black text-white';
    case 'Branco':
      return 'bg-white text-gray-800 border border-gray-300';
    case 'Amarelo':
      return 'bg-yellow-400 text-gray-900';
    default:
      return 'bg-gray-200';
  }
};

export const getBadgeStyles = (color: TeamColor) => {
  switch (color) {
    case 'Azul':
      return 'bg-blue-100 text-blue-800';
    case 'Preto':
      return 'bg-gray-800 text-white';
    case 'Branco':
      return 'bg-gray-100 text-gray-800 border border-gray-200';
    case 'Amarelo':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100';
  }
};
