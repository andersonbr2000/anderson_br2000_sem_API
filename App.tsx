
import React, { useState, useMemo, useEffect } from 'react';
import { Team, Match, TeamColor, TeamStats } from './types';
import { COLORS } from './constants';
import TeamSetup from './components/TeamSetup';
import MatchList from './components/MatchList';
import Standings from './components/Standings';
import StatsTables from './components/StatsTables';
import FinalMatch from './components/FinalMatch';

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [finalMatch, setFinalMatch] = useState<Match | null>(null);

  // Generate the round-robin schedule (Turno and Returno)
  const generateSchedule = (selectedTeams: Team[]) => {
    // CRITICAL FIX: Ensure teams state is updated before starting
    setTeams(selectedTeams);
    
    const schedule: Match[] = [];
    const t = selectedTeams;

    // A balanced round-robin for 4 teams to minimize idle time:
    // Round 1: 1-2, 3-4
    // Round 2: 1-3, 2-4
    // Round 3: 1-4, 2-3

    const roundRobin = [
      { r: 1, pairings: [[0, 1], [2, 3]] },
      { r: 2, pairings: [[0, 2], [1, 3]] },
      { r: 3, pairings: [[0, 3], [1, 2]] },
    ];

    // Turno (First Leg)
    roundRobin.forEach(round => {
      round.pairings.forEach(([hIdx, aIdx], pIdx) => {
        schedule.push({
          id: `t1-r${round.r}-p${pIdx}`,
          homeTeamId: t[hIdx].id,
          awayTeamId: t[aIdx].id,
          homeScore: null,
          awayScore: null,
          round: round.r,
          isReturno: false
        });
      });
    });

    // Returno (Second Leg - Swap Home/Away)
    roundRobin.forEach(round => {
      round.pairings.forEach(([hIdx, aIdx], pIdx) => {
        schedule.push({
          id: `t2-r${round.r + 3}-p${pIdx}`,
          homeTeamId: t[aIdx].id,
          awayTeamId: t[hIdx].id,
          homeScore: null,
          awayScore: null,
          round: round.r + 3,
          isReturno: true
        });
      });
    });

    setMatches(schedule);
    setIsStarted(true);
  };

  const updateScore = (matchId: string, homeScore: number | null, awayScore: number | null) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, homeScore, awayScore } : m));
  };

  const updateFinalScore = (homeScore: number | null, awayScore: number | null) => {
    if (finalMatch) {
      setFinalMatch({ ...finalMatch, homeScore, awayScore });
    }
  };

  // Calculate standings
  const stats: TeamStats[] = useMemo(() => {
    const teamStatsMap: Record<string, TeamStats> = {};

    teams.forEach(t => {
      teamStatsMap[t.id] = {
        teamId: t.id,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        efficiency: 0
      };
    });

    matches.forEach(m => {
      if (m.homeScore === null || m.awayScore === null) return;

      const home = teamStatsMap[m.homeTeamId];
      const away = teamStatsMap[m.awayTeamId];

      if (!home || !away) return; // Defensive check

      home.played += 1;
      away.played += 1;
      home.goalsFor += m.homeScore;
      home.goalsAgainst += m.awayScore;
      away.goalsFor += m.awayScore;
      away.goalsAgainst += m.homeScore;

      if (m.homeScore > m.awayScore) {
        home.won += 1;
        home.points += 3;
        away.lost += 1;
      } else if (m.homeScore < m.awayScore) {
        away.won += 1;
        away.points += 3;
        home.lost += 1;
      } else {
        home.drawn += 1;
        away.drawn += 1;
        home.points += 1;
        away.points += 1;
      }
    });

    return Object.values(teamStatsMap).map(s => {
      s.goalDifference = s.goalsFor - s.goalsAgainst;
      s.efficiency = s.played > 0 ? (s.points / (s.played * 3)) * 100 : 0;
      return s;
    }).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  }, [teams, matches]);

  // Handle Final Logic
  const allMatchesFinished = matches.length > 0 && matches.every(m => m.homeScore !== null && m.awayScore !== null);

  useEffect(() => {
    if (allMatchesFinished && stats.length >= 2 && !finalMatch) {
      setFinalMatch({
        id: 'final-match',
        homeTeamId: stats[0].teamId,
        awayTeamId: stats[1].teamId,
        homeScore: null,
        awayScore: null,
        round: 7,
        isReturno: false,
        isFinal: true
      });
    }
  }, [allMatchesFinished, stats, finalMatch]);

  const handleReset = () => {
    setTeams([]);
    setMatches([]);
    setIsStarted(false);
    setFinalMatch(null);
  };

  // Do not render anything if isStarted is true but teams are not yet ready (safety for async state)
  if (isStarted && teams.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-green-700 text-white py-6 shadow-md mb-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🏆 Torneio das Cores</h1>
            <p className="text-green-100">Gerenciador de Campeonato de Futebol</p>
          </div>
          {isStarted && (
            <button 
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition shadow"
            >
              Novo Torneio
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4">
        {!isStarted ? (
          <TeamSetup onComplete={generateSchedule} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  Tabela de Confrontos (Turno e Returno)
                </h2>
                <MatchList matches={matches} teams={teams} onUpdateScore={updateScore} />
              </section>

              {finalMatch && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-600">
                    <span className="bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">★</span>
                    A Grande Final
                  </h2>
                  <FinalMatch match={finalMatch} teams={teams} onUpdateScore={updateFinalScore} />
                </section>
              )}
            </div>

            <div className="lg:col-span-5 space-y-8">
              <section className="sticky top-4">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  Classificação Geral
                </h2>
                <Standings stats={stats} teams={teams} />
                
                <div className="mt-8">
                   <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                    Estatísticas e Rendimento
                  </h2>
                  <StatsTables stats={stats} teams={teams} />
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
