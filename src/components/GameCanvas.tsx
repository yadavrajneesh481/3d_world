// 'use client' tells Next.js this is a client-side component
'use client';

import React, { useEffect, useRef } from 'react';
import { Player } from '../types/game';

// The props our canvas component expects
interface GameCanvasProps {
    players: Player[];         // List of all players
    currentPlayer: Player | null;  // The current client's player
}

// The main canvas component
const GameCanvas: React.FC<GameCanvasProps> = ({ players, currentPlayer }) => {
    // Reference to the canvas element
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // This effect runs whenever the players array changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear previous frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw each player on the canvas
        players.forEach((player) => {
            // Draw player as a circle
            ctx.beginPath();
            ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
            // Impostors are red, crewmates are blue
            ctx.fillStyle = player.role === 'impostor' ? 'red' : 'blue';
            ctx.fill();
            ctx.closePath();

            // Draw player's username below their circle
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText(player.username, player.x, player.y + 30);
        });
    }, [players]);  // Re-run this code when players change

    // Render a canvas element
    return (
        <canvas
            ref={canvasRef}
            width={800}     // Canvas width
            height={600}    // Canvas height
            className="border border-gray-300"  // Add a border using Tailwind
        />
    );
};

export default GameCanvas;
