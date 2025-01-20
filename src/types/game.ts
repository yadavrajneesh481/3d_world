// Player role types
export type PlayerRole = 'crewmate' | 'impostor';

// Game status types
export type GameStatus = 'waiting' | 'starting' | 'in-progress' | 'meeting' | 'completed';

// Meeting phase types
export type MeetingPhase = 'discussion' | 'voting' | null;

// Player interface
export interface Player {
    id: string;
    x: number;
    y: number;
    color: string;
    role: PlayerRole;
    username?: string;
    isAlive?: boolean;
}

// Meeting state interface
export interface MeetingState {
    caller: string | null;
    phase: MeetingPhase;
    timeRemaining: number;
    votes: Record<string, string | 'skip'>;
    reportLocation?: { x: number; y: number };
}

// Test case for coding challenges
export interface TestCase {
    input: string;
    expectedOutput: string;
}

// Base coding task interface
export interface CodingTask {
    id: string;
    question: string;
    description: string;
    boilerplateCode: string;
    testCases: TestCase[];
    hintComment: string;
    completed: boolean;
}

// Coding task with position for game map
export interface CodingTaskWithPosition extends CodingTask {
    x: number;
    y: number;
}

// Game state interface
export interface GameState {
    players: Player[];
    currentPlayer: Player;
    gameStatus: GameStatus;
    codingTasks: CodingTaskWithPosition[];
    meeting: MeetingState | null;
    sabotaged?: boolean;
    winner?: 'crewmates' | 'impostors';
}

// Game settings interface
export interface GameSettings {
    maxPlayers: number;
    numImpostors: number;
    taskCompletionGoal: number;
    emergencyMeetings: number;
    discussionTime: number;
    votingTime: number;
    killCooldown: number;
    reportDistance: number;
}

// Game action types
export type GameAction = 
    | { type: 'JOIN_GAME'; player: Player }
    | { type: 'LEAVE_GAME'; playerId: string }
    | { type: 'START_GAME' }
    | { type: 'COMPLETE_TASK'; taskId: string; playerId: string }
    | { type: 'SABOTAGE'; location: { x: number; y: number } }
    | { type: 'REPORT_BODY'; reporterId: string; location: { x: number; y: number } }
    | { type: 'CALL_MEETING'; callerId: string }
    | { type: 'START_VOTING' }
    | { type: 'CAST_VOTE'; voterId: string; suspectId: string | 'skip' }
    | { type: 'END_MEETING'; ejectedId?: string }
    | { type: 'KILL_PLAYER'; targetId: string }
    | { type: 'UPDATE_PLAYER_POSITION'; playerId: string; position: { x: number; y: number } }
    | { type: 'END_GAME'; winner: 'crewmates' | 'impostors' };

// Constants for game mechanics
export const INTERACTION_DISTANCE = 50;  // Distance within which a player can interact with tasks
export const KILL_DISTANCE = 100;       // Distance within which an impostor can kill
export const REPORT_DISTANCE = 150;     // Distance within which a player can report a body
