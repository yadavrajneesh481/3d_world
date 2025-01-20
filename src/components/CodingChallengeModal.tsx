'use client';

import React, { useState, useEffect } from 'react';
import { CodingTask } from '../types/game';

interface CodingChallengeModalProps {
    task: CodingTask;
    onClose: () => void;
    onSubmit: (code: string) => void;
}

const CodingChallengeModal: React.FC<CodingChallengeModalProps> = ({
    task,
    onClose,
    onSubmit,
}) => {
    const [code, setCode] = useState(task.boilerplateCode);

    // Reset code when task changes
    useEffect(() => {
        setCode(task.boilerplateCode);
    }, [task.boilerplateCode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(code);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Coding Challenge</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">{task.question}</h3>
                    <p className="text-gray-600 mb-4">{task.description}</p>
                    
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2">Test Cases:</h4>
                        <ul className="space-y-2">
                            {task.testCases.map((testCase, index) => (
                                <li key={index} className="font-mono text-sm">
                                    Input: {testCase.input}
                                    <br />
                                    Expected Output: {testCase.expectedOutput}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <p className="text-yellow-700">
                            <span className="font-bold">Hint:</span> {task.hintComment}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-64 p-4 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                            style={{ whiteSpace: 'pre' }}
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Submit Solution
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CodingChallengeModal;
