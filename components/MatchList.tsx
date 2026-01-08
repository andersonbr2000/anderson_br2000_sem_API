
import React from 'react';
import { Match, Team } from '../types';
import { getBadgeStyles } from '../constants';

interface MatchListProps {
  matches: Match[];
  teams: Team[];
  onUpdateScore: (matchId: string, homeScore: number | null, awayScore: number | null) => void;
}

const MatchList: React.FC<MatchListProps> = ({ matches, teams, onUpdateScore }) => {
  const getTeamById = (id: string) => teams.find(t => t.id === id);

  // Group matches by round
  const rounds = Array.from(new Set(matches.map(m => m.round))).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {rounds.map(roundNum => (
        <div key={roundNum} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-700">Rodada {roundNum} {roundNum > 3 ? '(Returno)' : '(Turno)'}</h3>
            <span className="text-xs font-semibold text-gray-400 uppercase">Todos jogam</span>
          </div>
          <div className="divide-y divide-gray-100">
            {matches.filter(m => m.round === roundNum).map(match => {
              const homeTeam = getTeamById(match.homeTeamId);
              const awayTeam = getTeamById(match.awayTeamId);

              if (!homeTeam || !awayTeam) return null;

              return (
                <div key={match.id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Home Team */}
                  <div className="flex-1 flex items-center justify-end gap-3 w-full sm:w-auto">
                    <span className="font-semibold text-gray-800 text-right">{homeTeam.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getBadgeStyles(homeTeam.color)}`}>
                      {homeTeam.color}
                    </span>
                  </div>

                  {/* Score Inputs */}
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      min="0"
                      value={match.homeScore ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : parseInt(e.target.value);
                        onUpdateScore(match.id, val, match.awayScore);
                      }}
                      className="w-12 h-10 text-center border-2 border-gray-200 rounded-lg font-bold focus:border-green-500 focus:ring-0 outline-none transition"
                    />
                    <span className="font-bold text-gray-400">X</span>
                    <input 
                      type="number" 
                      min="0"
                      value={match.awayScore ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : parseInt(e.target.value);
                        onUpdateScore(match.id, match.homeScore, val);
                      }}
                      className="w-12 h-10 text-center border-2 border-gray-200 rounded-lg font-bold focus:border-green-500 focus:ring-0 outline-none transition"
                    />
                  </div>

                  {/* Away Team */}
                  <div className="flex-1 flex items-center justify-start gap-3 w-full sm:w-auto">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getBadgeStyles(awayTeam.color)}`}>
                      {awayTeam.color}
                    </span>
                    <span className="font-semibold text-gray-800 text-left">{awayTeam.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchList;
