
import React, { useState } from 'react';
import { Team, TeamColor } from '../types';
import { COLORS, getColorStyles } from '../constants';

interface TeamSetupProps {
  onComplete: (teams: Team[]) => void;
}

const TeamSetup: React.FC<TeamSetupProps> = ({ onComplete }) => {
  const [selections, setSelections] = useState<Partial<Record<number, TeamColor>>>({});
  const [names, setNames] = useState<Record<number, string>>({
    0: 'Time 1',
    1: 'Time 2',
    2: 'Time 3',
    3: 'Time 4'
  });

  const handleColorSelect = (index: number, color: TeamColor) => {
    // Check if color is already taken
    const alreadyTaken = Object.entries(selections).some(
      ([idx, val]) => val === color && parseInt(idx) !== index
    );
    
    if (alreadyTaken) return;

    setSelections(prev => ({
      ...prev,
      [index]: color
    }));
  };

  const handleNameChange = (index: number, name: string) => {
    setNames(prev => ({ ...prev, [index]: name }));
  };

  const isComplete = Object.keys(selections).length === 4;

  const handleSubmit = () => {
    if (!isComplete) return;
    const finalTeams: Team[] = [0, 1, 2, 3].map(i => ({
      id: `team-${i}`,
      name: names[i] || `Equipe ${i + 1}`,
      color: selections[i] as TeamColor
    }));
    onComplete(finalTeams);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Inscrição de Equipes</h2>
      <p className="text-gray-600 mb-8">Defina o nome e escolha uma cor para cada um dos 4 times. Cores não podem ser repetidas.</p>
      
      <div className="space-y-6">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nome da Equipe {index + 1}</label>
              <input 
                type="text" 
                value={names[index]}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="Digite o nome..."
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Escolha a Cor</label>
              <div className="flex gap-2">
                {COLORS.map(color => {
                  const isSelected = selections[index] === color;
                  const isTaken = Object.entries(selections).some(([idx, val]) => val === color && parseInt(idx) !== index);
                  
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(index, color)}
                      disabled={isTaken}
                      title={isTaken ? 'Cor já selecionada' : color}
                      className={`
                        w-10 h-10 rounded-full transition-all transform hover:scale-110
                        ${getColorStyles(color)}
                        ${isSelected ? 'ring-4 ring-green-500 scale-110 shadow-lg' : ''}
                        ${isTaken ? 'opacity-20 cursor-not-allowed scale-90' : 'cursor-pointer'}
                        flex items-center justify-center
                      `}
                    >
                      {isSelected && <span className="text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isComplete}
        className={`
          w-full mt-8 py-4 rounded-xl font-bold text-lg transition shadow-lg
          ${isComplete ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
        `}
      >
        Começar Torneio
      </button>
    </div>
  );
};

export default TeamSetup;
