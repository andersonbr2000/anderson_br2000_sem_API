
export type TeamColor = 'Azul' | 'Preto' | 'Branco' | 'Amarelo';

export interface Team {
  id: string;
  name: string;
  color: TeamColor;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  round: number;
  isReturno: boolean;
  isFinal?: boolean;
}

export interface TeamStats {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  efficiency: number;
}
