'use client';

/**
 * CodingChallengePanel Component
 * 
 * A side panel that presents coding challenges to players.
 * Features:
 * - Split screen layout with game view
 * - Syntax-highlighted code editor
 * - Real-time code validation
 * - Test case display and results
 * - Resizable editor
 */

import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { CodingTask } from '../types/game';
import { validateCode } from '../utils/codeValidator';

interface CodingChallengePanelProps {
    task: CodingTask;             // The current coding task to solve
    onClose: () => void;          // Callback when panel is closed
    onSubmit: (code: string) => void;  // Callback when code is successfully validated
    isOpen: boolean;              // Whether the panel is open
}

const CodingChallengePanel: React.FC<CodingChallengePanelProps> = ({
    task,
    onClose,
    onSubmit,
    isOpen
}) => {
    // State management
    const [code, setCode] = useState(task.boilerplateCode);
    const [editorHeight, setEditorHeight] = useState(300);
    const [validationResults, setValidationResults] = useState<{
        success: boolean;
        error?: string;
        testResults: {
            input: string;
            expectedOutput: string;
            actualOutput: string;
            passed: boolean;
        }[];
    } | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    // Reset code and validation results when task changes
    useEffect(() => {
        setCode(task.boilerplateCode);
        setValidationResults(null);
    }, [task.boilerplateCode]);

    // Handle code submission and validation
    const handleSubmit = () => {
        setIsValidating(true);
        try {
            // Validate the code against test cases
            const results = validateCode(code, task.testCases);
            setValidationResults(results);
            
            // Only call onSubmit if all tests pass
            if (results.success) {
                onSubmit(code);
            }
        } catch (error) {
            setValidationResults({
                success: false,
                error: `Unexpected error: ${error.message}`,
                testResults: []
            });
        }
        setIsValidating(false);
    };

    // Calculate code statistics
    const stats = {
        characters: code.length,
        lines: code.split('\n').length,
        words: code.split(/\s+/).filter(word => word.length > 0).length
    };

    if (!isOpen) return null;

    return (
        <div className="fixed left-0 top-0 h-full w-1/2 bg-white shadow-lg flex flex-col">
            {/* Panel Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold">Coding Challenge</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                    {/* Challenge Description */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{task.question}</h3>
                        <p className="text-gray-600">{task.description}</p>
                    </div>
                    
                    {/* Test Cases Display */}
                    <div className="bg-gray-100 p-3 rounded">
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

                    {/* Hint Box */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                        <p className="text-yellow-700">
                            <span className="font-bold">Hint:</span> {task.hintComment}
                        </p>
                    </div>

                    {/* Code Editor Section */}
                    <div>
                        {/* Code Statistics */}
                        <div className="mb-2 text-sm text-gray-600 flex justify-between items-center">
                            <div className="space-x-4">
                                <span>Lines: {stats.lines}</span>
                                <span>Characters: {stats.characters}</span>
                                <span>Words: {stats.words}</span>
                            </div>
                            <div className="text-xs">
                                ↔️ Drag bottom edge to resize
                            </div>
                        </div>

                        {/* Resizable Code Editor */}
                        <ResizableBox
                            width={Infinity}
                            height={editorHeight}
                            minConstraints={[Infinity, 100]}
                            maxConstraints={[Infinity, 500]}
                            onResize={(e, { size }) => {
                                setEditorHeight(size.height);
                            }}
                            resizeHandles={['s']}
                            className="rounded overflow-hidden"
                        >
                            <CodeMirror
                                value={code}
                                height={`${editorHeight}px`}
                                theme={oneDark}
                                extensions={[javascript({ jsx: true })]}
                                onChange={(value) => {
                                    setCode(value);
                                    setValidationResults(null);
                                }}
                                className="border rounded"
                            />
                        </ResizableBox>
                    </div>

                    {/* Test Results Section */}
                    {validationResults && (
                        <div className={`p-3 rounded ${
                            validationResults.success 
                                ? 'bg-green-50 border-l-4 border-green-400' 
                                : 'bg-red-50 border-l-4 border-red-400'
                        }`}>
                            <h4 className="font-semibold mb-2">Test Results:</h4>
                            {validationResults.error ? (
                                <p className="text-red-600">{validationResults.error}</p>
                            ) : (
                                <ul className="space-y-2">
                                    {validationResults.testResults.map((result, index) => (
                                        <li key={index} className="font-mono text-sm">
                                            <div className={`p-2 rounded ${
                                                result.passed ? 'bg-green-100' : 'bg-red-100'
                                            }`}>
                                                <div>Input: {result.input}</div>
                                                <div>Expected: {result.expectedOutput}</div>
                                                <div>Actual: {result.actualOutput}</div>
                                                <div className={`font-bold ${
                                                    result.passed ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {result.passed ? '✓ Passed' : '✗ Failed'}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Panel Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isValidating}
                        className={`px-4 py-2 rounded ${
                            isValidating
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                    >
                        {isValidating ? 'Validating...' : 'Submit Solution'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodingChallengePanel;
