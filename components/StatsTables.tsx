
import React from 'react';
import { TeamStats, Team } from '../types';

interface StatsTablesProps {
  stats: TeamStats[];
  teams: Team[];
}

const StatsTables: React.FC<StatsTablesProps> = ({ stats, teams }) => {
  const getTeamById = (id: string) => teams.find(t => t.id === id);

  // Sorted by Goal Difference
  const sortedByGD = [...stats].sort((a, b) => b.goalDifference - a.goalDifference);

  // Sorted by Efficiency
  const sortedByEfficiency = [...stats].sort((a, b) => b.efficiency - a.efficiency);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-tight">Saldo de Gols e Ataque</h3>
        </div>
        <table className="w-full text-xs text-left">
          <thead className="text-gray-400 font-semibold uppercase bg-gray-50/50">
            <tr>
              <th className="px-4 py-2">Equipe</th>
              <th className="px-4 py-2 text-center">GP</th>
              <th className="px-4 py-2 text-center">GC</th>
              <th className="px-4 py-2 text-center">SG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedByGD.map(s => {
              const team = getTeamById(s.teamId);
              if (!team) return null;
              return (
                <tr key={s.teamId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{team.name}</td>
                  <td className="px-4 py-2 text-center text-green-600">{s.goalsFor}</td>
                  <td className="px-4 py-2 text-center text-red-600">{s.goalsAgainst}</td>
                  <td className="px-4 py-2 text-center font-bold text-gray-800">{s.goalDifference}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-tight">Rendimento (%)</h3>
        </div>
        <table className="w-full text-xs text-left">
          <thead className="text-gray-400 font-semibold uppercase bg-gray-50/50">
            <tr>
              <th className="px-4 py-2">Equipe</th>
              <th className="px-4 py-2 text-center">Aproveitamento</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedByEfficiency.map(s => {
              const team = getTeamById(s.teamId);
              if (!team) return null;
              return (
                <tr key={s.teamId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{team.name}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${s.efficiency}%` }}></div>
                      </div>
                      <span className="font-bold">{s.efficiency.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.efficiency >= 70 ? '🔥' : s.efficiency >= 40 ? '⚽' : '⚠️'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsTables;
