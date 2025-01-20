import { GameState, GameActionWithPosition, MeetingState } from '../types/game';

/**
 * Calculate the most voted player from the votes
 * @param votes Record of player votes
 * @returns The ID of the most voted player or undefined if skipped/tied
 */
function calculateVoteResult(votes: Record<string, string | 'skip'>): string | undefined {
    const voteCounts = Object.values(votes).reduce((acc, vote) => {
        if (!acc[vote]) acc[vote] = 0;
        acc[vote]++;
        return acc;
    }, {} as Record<string, number>);

    // Find the highest vote count
    let maxVotes = 0;
    let mostVoted: string | undefined;
    let isTied = false;

    Object.entries(voteCounts).forEach(([playerId, count]) => {
        if (count > maxVotes) {
            maxVotes = count;
            mostVoted = playerId;
            isTied = false;
        } else if (count === maxVotes) {
            isTied = true;
        }
    });

    // Return undefined if tied or skipped
    return (!isTied && mostVoted !== 'skip') ? mostVoted : undefined;
}

/**
 * Check if the game should end based on the current state
 * @param state Current game state
 * @returns Winner if game should end, undefined otherwise
 */
function checkGameEnd(state: GameState): 'crewmates' | 'impostors' | undefined {
    const alivePlayers = state.players.filter(p => p.isAlive !== false);
    const aliveCrewmates = alivePlayers.filter(p => p.role === 'crewmate');
    const aliveImpostors = alivePlayers.filter(p => p.role === 'impostor');

    // Impostors win if they equal or outnumber crewmates
    if (aliveImpostors.length >= aliveCrewmates.length) {
        return 'impostors';
    }

    // Crewmates win if all impostors are dead
    if (aliveImpostors.length === 0) {
        return 'crewmates';
    }

    // Crewmates also win if all tasks are completed
    if (state.codingTasks.every(task => task.completed)) {
        return 'crewmates';
    }

    return undefined;
}

export function gameReducer(state: GameState, action: GameActionWithPosition): GameState {
    switch (action.type) {
        case 'UPDATE_PLAYER_POSITION': {
            const updatedPlayers = state.players.map(player =>
                player.id === action.playerId
                    ? { ...player, x: action.position.x, y: action.position.y }
                    : player
            );
            
            const updatedCurrentPlayer = 
                state.currentPlayer.id === action.playerId
                    ? { ...state.currentPlayer, x: action.position.x, y: action.position.y }
                    : state.currentPlayer;

            return {
                ...state,
                players: updatedPlayers,
                currentPlayer: updatedCurrentPlayer
            };
        }

        case 'JOIN_GAME':
            return {
                ...state,
                players: [...state.players, { ...action.player, isAlive: true }]
            };

        case 'LEAVE_GAME':
            return {
                ...state,
                players: state.players.filter(player => player.id !== action.playerId)
            };

        case 'START_GAME':
            return {
                ...state,
                gameStatus: 'in-progress',
                players: state.players.map(p => ({ ...p, isAlive: true }))
            };

        case 'COMPLETE_TASK': {
            const updatedTasks = state.codingTasks.map(task => 
                task.id === action.taskId ? { ...task, completed: true } : task
            );

            const newState = {
                ...state,
                codingTasks: updatedTasks
            };

            // Check if crewmates won by completing all tasks
            const winner = checkGameEnd(newState);
            if (winner) {
                return {
                    ...newState,
                    gameStatus: 'completed',
                    winner
                };
            }

            return newState;
        }

        case 'KILL_PLAYER': {
            const updatedPlayers = state.players.map(player =>
                player.id === action.targetId
                    ? { ...player, isAlive: false }
                    : player
            );

            const newState = {
                ...state,
                players: updatedPlayers
            };

            // Check if impostors won by killing enough crewmates
            const winner = checkGameEnd(newState);
            if (winner) {
                return {
                    ...newState,
                    gameStatus: 'completed',
                    winner
                };
            }

            return newState;
        }

        case 'CALL_MEETING':
        case 'REPORT_BODY': {
            const meeting: MeetingState = {
                caller: action.type === 'CALL_MEETING' ? action.callerId : action.reporterId,
                phase: 'discussion',
                timeRemaining: 45, // Discussion time in seconds
                votes: {},
                ...(action.type === 'REPORT_BODY' ? { reportLocation: action.location } : {})
            };

            return {
                ...state,
                gameStatus: 'meeting',
                meeting
            };
        }

        case 'START_VOTING': {
            if (!state.meeting) return state;

            return {
                ...state,
                meeting: {
                    ...state.meeting,
                    phase: 'voting',
                    timeRemaining: 30 // Voting time in seconds
                }
            };
        }

        case 'CAST_VOTE': {
            if (!state.meeting) return state;

            const newVotes = {
                ...state.meeting.votes,
                [action.voterId]: action.suspectId
            };

            return {
                ...state,
                meeting: {
                    ...state.meeting,
                    votes: newVotes
                }
            };
        }

        case 'END_MEETING': {
            if (!state.meeting) return state;

            // If an ejectedId was provided, mark that player as dead
            const updatedPlayers = action.ejectedId
                ? state.players.map(player =>
                    player.id === action.ejectedId
                        ? { ...player, isAlive: false }
                        : player
                )
                : state.players;

            const newState = {
                ...state,
                players: updatedPlayers,
                gameStatus: 'in-progress',
                meeting: null
            };

            // Check if the game should end after the ejection
            const winner = checkGameEnd(newState);
            if (winner) {
                return {
                    ...newState,
                    gameStatus: 'completed',
                    winner
                };
            }

            return newState;
        }

        case 'END_GAME':
            return {
                ...state,
                gameStatus: 'completed',
                winner: action.winner
            };

        default:
            return state;
    }
}
