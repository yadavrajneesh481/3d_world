// This defines what a player in our game looks like
export interface Player {
    id: string;          // Unique identifier for each player
    x: number;           // Player's horizontal position on screen
    y: number;           // Player's vertical position on screen
    role: 'impostor' | 'crewmate';  // Player can only be either impostor or crewmate
    username: string;    // Player's display name
}

// This tracks the overall state of our game
export interface GameState {
    players: Player[];   // List of all players in the game
    currentPlayer: Player | null;  // The player that this client controls
    gameStatus: 'waiting' | 'playing' | 'ended';  // Current game phase
    codingTasks: CodingTask[];    // List of coding challenges to solve
}

// Structure for our coding challenges
export interface CodingTask {
    id: string;          // Unique identifier for each task
    question: string;    // The coding question to solve
    description: string; // Detailed description of the task
    testCases: TestCase[];  // List of test cases to verify solution
    completed: boolean;     // Whether this task is done
}

// Structure for test cases to verify coding solutions
export interface TestCase {
    input: string;         // Input for the coding challenge
    expectedOutput: string;  // Expected output for that input
}
