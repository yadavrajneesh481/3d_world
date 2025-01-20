// 'use client' tells Next.js this is a client-side component
'use client';

import React, { useRef, useEffect, useState } from 'react';
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
    const [isClient, setIsClient] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    // Set isClient to true on mount and handle resize
    useEffect(() => {
        setIsClient(true);
        
        const updateDimensions = () => {
            const container = canvasRef.current?.parentElement;
            if (container) {
                setDimensions({
                    width: container.clientWidth,
                    height: container.clientHeight
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Draw game state
    useEffect(() => {
        if (!isClient) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        // Clear canvas
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);

        // Draw grid for better visualization
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 1;
        const gridSize = 50;
        
        for (let x = 0; x < dimensions.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, dimensions.height);
            ctx.stroke();
        }
        
        for (let y = 0; y < dimensions.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(dimensions.width, y);
            ctx.stroke();
        }

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

        // Draw other players
        players.forEach(player => {
            if (player.id !== currentPlayer.id) {
                ctx.fillStyle = player.color || '#00FF00';
                ctx.beginPath();
                ctx.arc(player.x, player.y, 15, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Draw current player last (on top)
        ctx.fillStyle = currentPlayer.color || '#FF0000';
        ctx.beginPath();
        ctx.arc(currentPlayer.x, currentPlayer.y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Draw player role text
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(currentPlayer.role, currentPlayer.x, currentPlayer.y);

        // Debug info
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`Position: (${Math.round(currentPlayer.x)}, ${Math.round(currentPlayer.y)})`, 10, 10);
        ctx.fillText(`Canvas Size: ${dimensions.width}x${dimensions.height}`, 10, 30);

    }, [players, tasks, currentPlayer, dimensions, isClient]);

    // Handle keyboard input
    useEffect(() => {
        if (!isClient) return;

        const handleKeyPress = (e: KeyboardEvent) => {
            const speed = 5;
            let newX = currentPlayer.x;
            let newY = currentPlayer.y;

            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    newY = Math.max(15, newY - speed);
                    break;
                case 's':
                case 'arrowdown':
                    newY = Math.min(dimensions.height - 15, newY + speed);
                    break;
                case 'a':
                case 'arrowleft':
                    newX = Math.max(15, newX - speed);
                    break;
                case 'd':
                case 'arrowright':
                    newX = Math.min(dimensions.width - 15, newX + speed);
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
    }, [currentPlayer, onMove, tasks, onTaskInteract, dimensions, isClient]);

    // Don't render anything on server
    if (!isClient) {
        return <div className="w-full h-full bg-gray-100" />;
    }

    // Render a canvas element
    return (
        <div className="relative w-full h-full">
            <canvas
                ref={canvasRef}
                className="w-full h-full bg-white"
                style={{ touchAction: 'none' }}
            />
        </div>
    );
};

export default GameCanvas;
