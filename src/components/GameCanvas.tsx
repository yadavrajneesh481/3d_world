// 'use client' tells Next.js this is a client-side component
'use client';

import React, { useEffect, useRef } from 'react';
import { Player, CodingTaskWithPosition, INTERACTION_DISTANCE } from '../types/game';

// The props our canvas component expects
interface GameCanvasProps {
    players: Player[];         // List of all players
    currentPlayer: Player | null;  // The current client's player
    tasks: CodingTaskWithPosition[];  // List of coding tasks
    onTaskInteract: (taskId: string) => void;  // Callback when player interacts with a task
}

// The main canvas component
const GameCanvas: React.FC<GameCanvasProps> = ({ 
    players, 
    currentPlayer, 
    tasks,
    onTaskInteract 
}) => {
    // Reference to the canvas element
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Calculate distance between two points
    const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    // Handle keyboard input for task interaction
    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'e' && currentPlayer) {
            // Check if player is near any task
            const nearbyTask = tasks.find(task => 
                !task.completed && 
                getDistance(currentPlayer.x, currentPlayer.y, task.x, task.y) <= INTERACTION_DISTANCE
            );

            if (nearbyTask) {
                onTaskInteract(nearbyTask.id);
            }
        }
    };

    // This effect runs whenever the players or tasks array changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear previous frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw tasks
        tasks.forEach(task => {
            // Draw task icon (a laptop emoji-like shape)
            ctx.beginPath();
            ctx.rect(task.x - 15, task.y - 15, 30, 20);
            ctx.fillStyle = task.completed ? '#4CAF50' : '#2196F3';
            ctx.fill();
            ctx.closePath();

            // Draw screen part
            ctx.beginPath();
            ctx.rect(task.x - 10, task.y - 12, 20, 14);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.closePath();

            // If player is nearby, show interaction hint
            if (currentPlayer && 
                !task.completed && 
                getDistance(currentPlayer.x, currentPlayer.y, task.x, task.y) <= INTERACTION_DISTANCE
            ) {
                ctx.font = '12px Arial';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.fillText('Press E to solve', task.x, task.y + 30);
            }
        });

        // Draw each player
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
    }, [players, tasks, currentPlayer]);

    // Set up keyboard event listeners
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentPlayer, tasks]);

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
