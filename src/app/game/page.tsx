'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Player, GameState, CodingTaskWithPosition } from '../../types/game';
import { usePlayerMovement } from '../../hooks/usePlayerMovement';

// Dynamically import components with no SSR
const GameCanvas = dynamic(() => import('../../components/GameCanvas'), { ssr: false });
const CodingChallengePanel = dynamic(() => import('../../components/CodingChallengePanel'), { ssr: false });

const GamePage = () => {
    const [isClient, setIsClient] = useState(false);

    // Set isClient to true on mount
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Player and game state management
    const [currentPlayer, setCurrentPlayer] = useState<Player>({
        id: '1',
        x: 100,
        y: 100,
        color: '#FF0000',
        role: 'crewmate'
    });

    const [gameState, setGameState] = useState<GameState>({
        players: [currentPlayer],
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

    // Movement handling
    const handleMove = useCallback((newX: number, newY: number) => {
        setCurrentPlayer(prev => ({
            ...prev,
            x: newX,
            y: newY
        }));
    }, []);

    // Task interaction state
    const [showCodingChallenge, setShowCodingChallenge] = useState(false);
    const [activeTask, setActiveTask] = useState<CodingTaskWithPosition | null>(null);

    // Handle task interaction
    const handleTaskInteract = (taskId: string) => {
        const task = gameState.codingTasks.find(t => t.id === taskId);
        if (task && !task.completed) {
            setActiveTask(task);
            setShowCodingChallenge(true);
        }
    };

    // Handle task completion
    const handleTaskComplete = (code: string) => {
        if (activeTask) {
            setGameState(prev => ({
                ...prev,
                codingTasks: prev.codingTasks.map(task =>
                    task.id === activeTask.id ? { ...task, completed: true } : task
                )
            }));
            setShowCodingChallenge(false);
            setActiveTask(null);
        }
    };

    // Don't render anything on server
    if (!isClient) {
        return <div className="w-full h-screen bg-gray-100" />;
    }

    return (
        <div className="relative w-full h-screen">
            {/* Game Canvas takes full width when panel is closed, half width when open */}
            <div className={`absolute top-0 ${showCodingChallenge ? 'right-0 w-1/2' : 'inset-0'} h-full transition-all duration-300`}>
                <GameCanvas 
                    players={gameState.players}
                    currentPlayer={currentPlayer}
                    onMove={handleMove}
                    tasks={gameState.codingTasks}
                    onTaskInteract={handleTaskInteract}
                />
            </div>

            {/* Game Stats Overlay */}
            <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
                <p className="text-sm text-gray-600">Role: {currentPlayer.role}</p>
                <p className="text-sm text-gray-600">
                    Tasks: {gameState.codingTasks.filter(t => t.completed).length}/{gameState.codingTasks.length}
                </p>
            </div>

            {/* Coding Challenge Panel */}
            {activeTask && (
                <CodingChallengePanel
                    task={activeTask}
                    onClose={() => {
                        setShowCodingChallenge(false);
                        setActiveTask(null);
                    }}
                    onSubmit={handleTaskComplete}
                    isOpen={showCodingChallenge}
                />
            )}
        </div>
    );
};

export default GamePage;
