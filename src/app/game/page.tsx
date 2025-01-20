'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { GameProvider, useGame } from '../../contexts/GameContext';
import { CodingTaskWithPosition } from '../../types/game';

// Dynamically import components with no SSR
const GameCanvas = dynamic(() => import('../../components/GameCanvas'), { ssr: false });
const CodingChallengePanel = dynamic(() => import('../../components/CodingChallengePanel'), { ssr: false });

const GameContent = () => {
    const { state, dispatch } = useGame();
    const [isClient, setIsClient] = useState(false);
    const [showCodingChallenge, setShowCodingChallenge] = useState(false);
    const [activeTask, setActiveTask] = useState<CodingTaskWithPosition | null>(null);

    // Set isClient to true on mount
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Movement handling
    const handleMove = useCallback((newX: number, newY: number) => {
        dispatch({
            type: 'UPDATE_PLAYER_POSITION',
            playerId: state.currentPlayer.id,
            position: { x: newX, y: newY }
        });
    }, [dispatch, state.currentPlayer.id]);

    // Handle task interaction
    const handleTaskInteract = (taskId: string) => {
        const task = state.codingTasks.find(t => t.id === taskId);
        if (task && !task.completed) {
            setActiveTask(task);
            setShowCodingChallenge(true);
        }
    };

    // Handle task completion
    const handleTaskComplete = (code: string) => {
        if (activeTask) {
            dispatch({
                type: 'COMPLETE_TASK',
                taskId: activeTask.id,
                playerId: state.currentPlayer.id
            });
            setShowCodingChallenge(false);
            setActiveTask(null);
        }
    };

    // Don't render anything on server
    if (!isClient) {
        return <div className="w-full h-screen bg-gray-100" />;
    }

    return (
        <div className="relative w-full h-screen bg-gray-100">
            {/* Game Canvas takes full width when panel is closed, half width when open */}
            <div className={`absolute top-0 ${showCodingChallenge ? 'right-0 w-1/2' : 'inset-0'} h-full transition-all duration-300`}>
                <GameCanvas 
                    players={state.players}
                    currentPlayer={state.currentPlayer}
                    onMove={handleMove}
                    tasks={state.codingTasks}
                    onTaskInteract={handleTaskInteract}
                />
            </div>

            {/* Game Stats Overlay */}
            <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
                <p className="text-sm text-gray-600">Role: {state.currentPlayer.role}</p>
                <p className="text-sm text-gray-600">
                    Tasks: {state.codingTasks.filter(t => t.completed).length}/{state.codingTasks.length}
                </p>
                <p className="text-sm text-gray-600">
                    Game Status: {state.gameStatus}
                </p>
                {state.winner && (
                    <p className="text-sm font-bold text-green-600">
                        Winner: {state.winner}
                    </p>
                )}
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

const GamePage = () => (
    <GameProvider>
        <GameContent />
    </GameProvider>
);

export default GamePage;
