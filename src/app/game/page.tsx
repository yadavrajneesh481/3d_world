'use client';

import React, { useState, useCallback } from 'react';
import GameCanvas from '../../components/GameCanvas';
import CodingChallengeModal from '../../components/CodingChallengeModal';
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
                question: 'FizzBuzz',
                description: 'Write a function that returns "Fizz" for numbers divisible by 3, "Buzz" for numbers divisible by 5, and "FizzBuzz" for numbers divisible by both.',
                testCases: [
                    { input: '3', expectedOutput: 'Fizz' },
                    { input: '5', expectedOutput: 'Buzz' },
                    { input: '15', expectedOutput: 'FizzBuzz' }
                ],
                completed: false
            },
            {
                id: 'task2',
                x: 500,
                y: 400,
                question: 'Palindrome Check',
                description: 'Write a function that checks if a given string is a palindrome (reads the same forwards and backwards).',
                testCases: [
                    { input: 'racecar', expectedOutput: 'true' },
                    { input: 'hello', expectedOutput: 'false' }
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Code Among Us</h1>
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <GameCanvas 
                    players={gameState.players}
                    currentPlayer={currentPlayer}
                    tasks={gameState.codingTasks}
                    onTaskInteract={handleTaskInteract}
                />
            </div>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Use arrow keys or WASD to move</p>
                <p className="text-sm text-gray-600">Press E to interact with tasks</p>
                <p className="text-sm text-gray-600">Your role: {currentPlayer.role}</p>
                <p className="text-sm text-gray-600">
                    Tasks completed: {gameState.codingTasks.filter(t => t.completed).length}/{gameState.codingTasks.length}
                </p>
            </div>

            {activeTask && (
                <CodingChallengeModal
                    task={activeTask}
                    onClose={() => setActiveTask(null)}
                    onSubmit={handleTaskSubmit}
                />
            )}
        </div>
    );
};

export default GamePage;
