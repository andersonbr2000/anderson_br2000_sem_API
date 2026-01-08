
import React from 'react';
import { Match, Team } from '../types';
import { getBadgeStyles } from '../constants';

interface FinalMatchProps {
  match: Match;
  teams: Team[];
  onUpdateScore: (homeScore: number | null, awayScore: number | null) => void;
}

const FinalMatch: React.FC<FinalMatchProps> = ({ match, teams, onUpdateScore }) => {
  const getTeamById = (id: string) => teams.find(t => t.id === id);
  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);

  if (!homeTeam || !awayTeam) return null;

  const winner = (match.homeScore !== null && match.awayScore !== null) 
    ? (match.homeScore > match.awayScore ? homeTeam : (match.awayScore > match.homeScore ? awayTeam : null))
    : null;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl shadow-xl border-2 border-yellow-400 p-8 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
      
      <div className="inline-block px-4 py-1 bg-yellow-500 text-white text-[10px] font-bold uppercase rounded-full mb-6 tracking-widest animate-pulse">
        Grande Final
      </div>

      <div className="flex flex-col md:flex-row items-center justify-around gap-8">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-4">
          <div className={`w-24 h-24 rounded-full shadow-lg flex items-center justify-center border-4 border-white ${getBadgeStyles(homeTeam.color).split(' ').shift() === 'bg-gray-800' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
             <span className="text-4xl">🛡️</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-gray-900">{homeTeam.name}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${getBadgeStyles(homeTeam.color)}`}>
              {homeTeam.color}
            </span>
          </div>
          <input 
            type="number" 
            min="0"
            placeholder="0"
            value={match.homeScore ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : parseInt(e.target.value);
              onUpdateScore(val, match.awayScore);
            }}
            className="w-20 h-20 text-center text-4xl border-4 border-yellow-200 rounded-2xl font-black focus:border-yellow-500 focus:ring-0 outline-none transition bg-white"
          />
        </div>

        {/* VS */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl font-black text-yellow-600 italic">VS</span>
          {winner && (
            <div className="mt-4 flex flex-col items-center animate-bounce">
              <span className="text-4xl">🏆</span>
              <span className="text-sm font-black text-yellow-700 uppercase">Campeão!</span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-4">
          <div className={`w-24 h-24 rounded-full shadow-lg flex items-center justify-center border-4 border-white ${getBadgeStyles(awayTeam.color).split(' ').shift() === 'bg-gray-800' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
             <span className="text-4xl">🛡️</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-gray-900">{awayTeam.name}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${getBadgeStyles(awayTeam.color)}`}>
              {awayTeam.color}
            </span>
          </div>
          <input 
            type="number" 
            min="0"
            placeholder="0"
            value={match.awayScore ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : parseInt(e.target.value);
              onUpdateScore(match.homeScore, val);
            }}
            className="w-20 h-20 text-center text-4xl border-4 border-yellow-200 rounded-2xl font-black focus:border-yellow-500 focus:ring-0 outline-none transition bg-white"
          />
        </div>
      </div>

      {winner && (
        <div className="mt-10 p-4 bg-yellow-500 rounded-xl text-white font-black text-2xl shadow-inner">
          {winner.name.toUpperCase()} É O GRANDE CAMPEÃO!
        </div>
      )}
    </div>
  );
};

export default FinalMatch;
