// Custom hook for handling player movement
import { useEffect, useCallback } from 'react';
import { Player } from '../types/game';

// Movement speed in pixels per frame
const MOVEMENT_SPEED = 5;

// Canvas boundaries
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_RADIUS = 20;

interface UsePlayerMovementProps {
    player: Player | null;
    onMove: (newX: number, newY: number) => void;
}

export const usePlayerMovement = ({ player, onMove }: UsePlayerMovementProps) => {
    // Handle keyboard movement
    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (!player) return;

        let newX = player.x;
        let newY = player.y;

        // Update position based on key press
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
                newY = Math.max(PLAYER_RADIUS, player.y - MOVEMENT_SPEED);
                break;
            case 'ArrowDown':
            case 's':
                newY = Math.min(CANVAS_HEIGHT - PLAYER_RADIUS, player.y + MOVEMENT_SPEED);
                break;
            case 'ArrowLeft':
            case 'a':
                newX = Math.max(PLAYER_RADIUS, player.x - MOVEMENT_SPEED);
                break;
            case 'ArrowRight':
            case 'd':
                newX = Math.min(CANVAS_WIDTH - PLAYER_RADIUS, player.x + MOVEMENT_SPEED);
                break;
            default:
                return;
        }

        // Only update if position changed
        if (newX !== player.x || newY !== player.y) {
            onMove(newX, newY);
        }
    }, [player, onMove]);

    // Set up keyboard event listeners
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);
};
