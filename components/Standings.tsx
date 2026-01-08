
import React from 'react';
import { TeamStats, Team } from '../types';
import { getBadgeStyles } from '../constants';

interface StandingsProps {
  stats: TeamStats[];
  teams: Team[];
}

const Standings: React.FC<StandingsProps> = ({ stats, teams }) => {
  const getTeamById = (id: string) => teams.find(t => t.id === id);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 text-center">Pos</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3 text-center">P</th>
            <th className="px-4 py-3 text-center">J</th>
            <th className="px-4 py-3 text-center">V</th>
            <th className="px-4 py-3 text-center">E</th>
            <th className="px-4 py-3 text-center">D</th>
            <th className="px-4 py-3 text-center">SG</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {stats.map((stat, idx) => {
            const team = getTeamById(stat.teamId);
            if (!team) return null;
            return (
              <tr key={stat.teamId} className={`${idx < 2 ? 'bg-green-50/30' : ''} hover:bg-gray-50 transition`}>
                <td className="px-4 py-4 text-center font-bold text-gray-400">
                   {idx + 1}º
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{team.name}</span>
                    <span className={`w-fit mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${getBadgeStyles(team.color)}`}>
                      {team.color}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center font-bold text-green-700">{stat.points}</td>
                <td className="px-4 py-4 text-center text-gray-600">{stat.played}</td>
                <td className="px-4 py-4 text-center text-gray-600">{stat.won}</td>
                <td className="px-4 py-4 text-center text-gray-600">{stat.drawn}</td>
                <td className="px-4 py-4 text-center text-gray-600">{stat.lost}</td>
                <td className="px-4 py-4 text-center font-semibold text-gray-800">
                  {stat.goalDifference > 0 ? `+${stat.goalDifference}` : stat.goalDifference}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="bg-gray-50 p-3 text-[10px] text-gray-400 font-medium border-t border-gray-100 italic">
        * Os 2 primeiros colocados avançam para a Grande Final.
      </div>
    </div>
  );
};

export default Standings;
