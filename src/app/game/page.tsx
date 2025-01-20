'use client';

import React, { useState, useCallback } from 'react';
import GameCanvas from '../../components/GameCanvas';
import { Player, GameState } from '../../types/game';
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
        codingTasks: []
    });

    // Set current player (in real game, this would come from authentication)
    const currentPlayer = gameState.players[0];

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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Code Among Us</h1>
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <GameCanvas 
                    players={gameState.players}
                    currentPlayer={currentPlayer}
                />
            </div>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Use arrow keys or WASD to move</p>
                <p className="text-sm text-gray-600">Your role: {currentPlayer.role}</p>
            </div>
        </div>
    );
};

export default GamePage;
