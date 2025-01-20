'use client';

import React from 'react';
import { CodingTask as CodingTaskType } from '../types/game';

interface CodingTaskProps {
    task: CodingTaskType;
    position: { x: number; y: number };
    isNearby: boolean;
    onInteract: () => void;
}

const CodingTask: React.FC<CodingTaskProps> = ({ task, position, isNearby, onInteract }) => {
    // Draw the task on canvas
    const draw = (ctx: CanvasRenderingContext2D) => {
        // Draw task icon (a laptop emoji-like shape)
        ctx.beginPath();
        ctx.rect(position.x - 15, position.y - 15, 30, 20);
        ctx.fillStyle = task.completed ? '#4CAF50' : '#2196F3';
        ctx.fill();
        ctx.closePath();

        // Draw screen part
        ctx.beginPath();
        ctx.rect(position.x - 10, position.y - 12, 20, 14);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.closePath();

        // If player is nearby, show interaction hint
        if (isNearby && !task.completed) {
            ctx.font = '12px Arial';
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.fillText('Press E to solve', position.x, position.y + 30);
        }
    };

    return null; // This component doesn't render DOM elements, only draws on canvas
};

export default CodingTask;
