'use client';

import React, { useState, useEffect } from 'react';
import { Player } from '../types/game';

interface EmergencyMeetingProps {
    /**
     * List of all players in the game
     */
    players: Player[];
    
    /**
     * The current player's ID
     */
    currentPlayerId: string;
    
    /**
     * Time remaining for discussion/voting in seconds
     */
    timeRemaining: number;
    
    /**
     * Whether the meeting is in discussion or voting phase
     */
    phase: 'discussion' | 'voting';
    
    /**
     * Callback when a player casts a vote
     */
    onVote: (suspectId: string | 'skip') => void;
    
    /**
     * Callback when the meeting ends
     */
    onMeetingEnd: () => void;
}

/**
 * EmergencyMeeting component handles the meeting interface where players can discuss and vote
 */
const EmergencyMeeting: React.FC<EmergencyMeetingProps> = ({
    players,
    currentPlayerId,
    timeRemaining,
    phase,
    onVote,
    onMeetingEnd
}) => {
    // Track who has voted
    const [votes, setVotes] = useState<Record<string, string | 'skip'>>({});
    
    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle voting
    const handleVote = (suspectId: string | 'skip') => {
        if (votes[currentPlayerId]) return; // Can't vote twice
        
        const newVotes = { ...votes, [currentPlayerId]: suspectId };
        setVotes(newVotes);
        onVote(suspectId);
    };

    // Check if meeting should end
    useEffect(() => {
        if (timeRemaining <= 0 || Object.keys(votes).length === players.length) {
            onMeetingEnd();
        }
    }, [timeRemaining, votes, players.length, onMeetingEnd]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">
                        {phase === 'discussion' ? 'Emergency Meeting!' : 'Time to Vote!'}
                    </h2>
                    <p className="text-xl text-red-600 font-mono">
                        {formatTime(timeRemaining)}
                    </p>
                </div>

                {phase === 'voting' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {players.map(player => (
                            <button
                                key={player.id}
                                onClick={() => handleVote(player.id)}
                                disabled={!!votes[currentPlayerId]}
                                className={`
                                    p-4 rounded-lg text-center transition-colors
                                    ${votes[currentPlayerId] === player.id 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-100 hover:bg-gray-200'}
                                    ${votes[currentPlayerId] && votes[currentPlayerId] !== player.id 
                                        ? 'opacity-50' 
                                        : ''}
                                `}
                            >
                                <div className="w-8 h-8 rounded-full mx-auto mb-2" 
                                     style={{ backgroundColor: player.color }} 
                                />
                                <p>{player.username || `Player ${player.id}`}</p>
                                {player.id === currentPlayerId && <span>(You)</span>}
                                <div className="mt-2">
                                    {Object.values(votes).filter(v => v === player.id).length} votes
                                </div>
                            </button>
                        ))}
                        
                        {/* Skip vote button */}
                        <button
                            onClick={() => handleVote('skip')}
                            disabled={!!votes[currentPlayerId]}
                            className={`
                                p-4 rounded-lg text-center transition-colors
                                ${votes[currentPlayerId] === 'skip' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-100 hover:bg-gray-200'}
                                ${votes[currentPlayerId] && votes[currentPlayerId] !== 'skip' 
                                    ? 'opacity-50' 
                                    : ''}
                            `}
                        >
                            <p className="font-bold">Skip Vote</p>
                            <div className="mt-2">
                                {Object.values(votes).filter(v => v === 'skip').length} votes
                            </div>
                        </button>
                    </div>
                )}

                {phase === 'discussion' && (
                    <div className="text-center text-lg">
                        <p>Discuss who might be the impostor!</p>
                        <p className="text-sm text-gray-600 mt-2">
                            Voting begins in {formatTime(timeRemaining)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmergencyMeeting;
