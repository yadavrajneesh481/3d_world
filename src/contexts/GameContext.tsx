'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, GameAction, Player, GameSettings } from '../types/game';
import { gameReducer } from '../reducers/gameReducer';

// Default game settings
const DEFAULT_SETTINGS: GameSettings = {
    maxPlayers: 10,
    numImpostors: 2,
    taskCompletionGoal: 8,
    emergencyMeetings: 1,
    discussionTime: 45,
    votingTime: 30
};

// Initial game state
const initialState: GameState = {
    players: [],
    currentPlayer: {
        id: '1',
        x: 100,
        y: 100,
        color: '#FF0000',
        role: 'crewmate'
    },
    gameStatus: 'waiting',
    codingTasks: [
        {
            id: '1',
            x: 200,
            y: 200,
            question: 'Double the Number',
            description: 'Write a function that takes a number as input and returns its double.',
            boilerplateCode: 'function doubleNumber(num) {\n  // Write your code here\n  \n}',
            testCases: [
                { input: '2', expectedOutput: '4' },
                { input: '-3', expectedOutput: '-6' },
                { input: '0', expectedOutput: '0' },
            ],
            hintComment: 'Multiply the input number by 2',
            completed: false
        },
        {
            id: '2',
            x: 300,
            y: 300,
            question: 'Greet User',
            description: 'Complete the function to return a greeting message.',
            boilerplateCode:
`function greetUser(name) {
    // TODO: Return "Hello, [name]!"
    return "Hello, " + 
}`,
            hintComment: 'Add the name parameter and an exclamation mark',
            testCases: [
                { input: 'Alice', expectedOutput: 'Hello, Alice!' },
                { input: 'Bob', expectedOutput: 'Hello, Bob!' }
            ],
            completed: false
        },
        {
            id: '3',
            x: 400,
            y: 200,
            question: 'Is Even Number',
            description: 'Complete the function to check if a number is even.',
            boilerplateCode:
`function isEven(num) {
    // TODO: Return true if num is even, false otherwise
    // Hint: Use the modulo operator %
    return num 
}`,
            hintComment: 'A number is even if dividing by 2 has no remainder',
            testCases: [
                { input: '4', expectedOutput: 'true' },
                { input: '7', expectedOutput: 'false' },
                { input: '0', expectedOutput: 'true' }
            ],
            completed: false
        }
    ]
};

interface GameContextType {
    state: GameState;
    settings: GameSettings;
    dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const [settings] = React.useState(DEFAULT_SETTINGS);

    // Initialize current player in players array
    useEffect(() => {
        if (state.players.length === 0) {
            dispatch({ type: 'JOIN_GAME', player: state.currentPlayer });
        }
    }, []);

    // Game loop effect
    useEffect(() => {
        if (state.gameStatus === 'in-progress') {
            const gameLoop = setInterval(() => {
                // Check win conditions
                const tasksCompleted = state.codingTasks.filter(task => task.completed).length;
                if (tasksCompleted >= settings.taskCompletionGoal) {
                    dispatch({ type: 'END_GAME', winner: 'crewmates' });
                }
                
                // Add more game loop logic here
            }, 1000);

            return () => clearInterval(gameLoop);
        }
    }, [state.gameStatus, state.codingTasks, settings.taskCompletionGoal]);

    return (
        <GameContext.Provider value={{ state, settings, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
