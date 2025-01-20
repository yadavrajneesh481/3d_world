'use client';

import React, { useState } from 'react';
import GameCanvas from '../../components/GameCanvas';
import { Player, GameState } from '../../types/game';

const GamePage: React.FC = () => {
    // Initialize game state
    const [gameState, setGameState] = useState<GameState>({
        players: [
            {
                id: '1',
                x: 100,
                y: 100,
                role: 'crewmate',
                username: 'Player 1'
            },
            {
                id: '2',
                x: 200,
                y: 200,
                role: 'impostor',
                username: 'Player 2'
            }
        ],
        currentPlayer: null,
        gameStatus: 'waiting',
        codingTasks: []
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Code Among Us</h1>
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <GameCanvas 
                    players={gameState.players}
                    currentPlayer={gameState.currentPlayer}
                />
            </div>
        </div>
    );
};

export default GamePage;
