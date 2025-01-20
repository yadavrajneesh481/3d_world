// 'use client' tells Next.js this is a client-side component
'use client';

import React, { useRef, useEffect } from 'react';
import { Player, CodingTaskWithPosition } from '../types/game';

// The props our canvas component expects
interface GameCanvasProps {
    players: Player[];
    currentPlayer: Player;
    onMove: (x: number, y: number) => void;
    tasks: CodingTaskWithPosition[];
    onTaskInteract: (taskId: string) => void;
}

// The main canvas component
const GameCanvas: React.FC<GameCanvasProps> = ({
    players,
    currentPlayer,
    onMove,
    tasks,
    onTaskInteract,
}) => {
    // Reference to the canvas element
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Draw game state
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw tasks
        tasks.forEach(task => {
            ctx.fillStyle = task.completed ? '#4CAF50' : '#2196F3';
            ctx.beginPath();
            ctx.arc(task.x, task.y, 20, 0, Math.PI * 2);
            ctx.fill();
            
            // Add 'E' text to indicate interaction
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('E', task.x, task.y);
        });

        // Draw players
        players.forEach(player => {
            ctx.fillStyle = player.color || (player.id === currentPlayer.id ? '#FF0000' : '#00FF00');
            ctx.beginPath();
            ctx.arc(player.x, player.y, 15, 0, Math.PI * 2);
            ctx.fill();
        });
    }, [players, tasks, currentPlayer.id]);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const speed = 5;
            let newX = currentPlayer.x;
            let newY = currentPlayer.y;

            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    newY -= speed;
                    break;
                case 's':
                case 'arrowdown':
                    newY += speed;
                    break;
                case 'a':
                case 'arrowleft':
                    newX -= speed;
                    break;
                case 'd':
                case 'arrowright':
                    newX += speed;
                    break;
                case 'e':
                    // Check if player is near any task
                    const nearbyTask = tasks.find(task => {
                        const distance = Math.sqrt(
                            Math.pow(task.x - currentPlayer.x, 2) + 
                            Math.pow(task.y - currentPlayer.y, 2)
                        );
                        return distance < 50; // Interaction radius
                    });
                    
                    if (nearbyTask && !nearbyTask.completed) {
                        onTaskInteract(nearbyTask.id);
                    }
                    break;
            }

            // Update position if changed
            if (newX !== currentPlayer.x || newY !== currentPlayer.y) {
                onMove(newX, newY);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentPlayer, onMove, tasks, onTaskInteract]);

    // Render a canvas element
    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-gray-300 bg-gray-100"
        />
    );
};

export default GameCanvas;
