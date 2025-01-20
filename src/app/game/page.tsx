'use client';

import React, { useState, useCallback } from 'react';
import GameCanvas from '../../components/GameCanvas';
import CodingChallengePanel from '../../components/CodingChallengeModal';
import { Player, GameState, CodingTaskWithPosition } from '../../types/game';
import { usePlayerMovement } from '../../hooks/usePlayerMovement';

const GamePage: React.FC = () => {
    // Initialize game state
    const [gameState, setGameState] = useState<GameState>({
        players: [
            {
                id: '1',
                x: 100,
                y: 100,
                role: 'crewmate',
                username: 'You'
            },
            {
                id: '2',
                x: 200,
                y: 200,
                role: 'impostor',
                username: 'Bot'
            }
        ],
        currentPlayer: null,
        gameStatus: 'playing',
        codingTasks: [
            {
                id: 'task1',
                x: 300,
                y: 300,
                question: 'Double the Number',
                description: 'Complete the function to return double the input number.',
                boilerplateCode: 
`function doubleNumber(num) {
    // TODO: Return double the input number
    return 
}`,
                hintComment: 'Multiply the input number by 2',
                testCases: [
                    { input: '5', expectedOutput: '10' },
                    { input: '0', expectedOutput: '0' },
                    { input: '-3', expectedOutput: '-6' }
                ],
                completed: false
            },
            {
                id: 'task2',
                x: 500,
                y: 400,
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
                id: 'task3',
                x: 200,
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
    });

    // Set current player (in real game, this would come from authentication)
    const currentPlayer = gameState.players[0];

    // State for active coding task
    const [activeTask, setActiveTask] = useState<CodingTaskWithPosition | null>(null);

    // Handle player movement
    const handlePlayerMove = useCallback((newX: number, newY: number) => {
        setGameState(prev => ({
            ...prev,
            players: prev.players.map(player => 
                player.id === currentPlayer.id 
                    ? { ...player, x: newX, y: newY }
                    : player
            )
        }));
    }, [currentPlayer.id]);

    // Use our movement hook
    usePlayerMovement({
        player: currentPlayer,
        onMove: handlePlayerMove
    });

    // Handle task interaction
    const handleTaskInteract = (taskId: string) => {
        const task = gameState.codingTasks.find(t => t.id === taskId);
        if (task) {
            setActiveTask(task);
        }
    };

    // Handle task submission
    const handleTaskSubmit = (code: string) => {
        // In a real game, we would validate the code against test cases here
        if (activeTask) {
            setGameState(prev => ({
                ...prev,
                codingTasks: prev.codingTasks.map(task =>
                    task.id === activeTask.id
                        ? { ...task, completed: true }
                        : task
                )
            }));
            setActiveTask(null);
        }
    };

    const [showCodingChallenge, setShowCodingChallenge] = useState(false);
    const [currentTask, setCurrentTask] = useState<CodingTaskWithPosition>({
        id: '1',
        question: 'Double the Number',
        description: 'Write a function that takes a number as input and returns its double.',
        boilerplateCode: 'function doubleNumber(num) {\n  // Write your code here\n  \n}',
        testCases: [
            { input: '2', expectedOutput: '4' },
            { input: '-3', expectedOutput: '-6' },
            { input: '0', expectedOutput: '0' },
        ],
        hintComment: 'Multiply the input number by 2',
        x: 0,
        y: 0
    });

    const handleTaskComplete = (code: string) => {
        console.log('Task completed with code:', code);
        setShowCodingChallenge(false);
    };

    // Function to trigger coding challenge (called from GameCanvas)
    const triggerCodingChallenge = () => {
        setShowCodingChallenge(true);
    };

    return (
        <div className="relative w-full h-screen">
            {/* Game Canvas takes full width when panel is closed, half width when open */}
            <div className={`absolute top-0 ${showCodingChallenge ? 'right-0 w-1/2' : 'inset-0'} h-full transition-all duration-300`}>
                <GameCanvas 
                    players={gameState.players}
                    currentPlayer={currentPlayer}
                    tasks={gameState.codingTasks}
                    onTaskInteract={handleTaskInteract}
                    onTriggerTask={triggerCodingChallenge}
                />
            </div>

            {/* Coding Challenge Panel */}
            <CodingChallengePanel
                task={currentTask}
                onClose={() => setShowCodingChallenge(false)}
                onSubmit={handleTaskComplete}
                isOpen={showCodingChallenge}
            />
        </div>
    );
};

export default GamePage;
