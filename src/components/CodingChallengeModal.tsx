/**
 * CodingChallengeModal Component
 * 
 * A modal dialog that presents coding challenges to players.
 * Features:
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

// Props interface for the modal component
interface CodingChallengeModalProps {
    task: CodingTask;             // The current coding task to solve
    onClose: () => void;          // Callback when modal is closed
    onSubmit: (code: string) => void;  // Callback when code is successfully validated
}

const CodingChallengeModal: React.FC<CodingChallengeModalProps> = ({
    task,
    onClose,
    onSubmit,
}) => {
    // State management
    const [code, setCode] = useState(task.boilerplateCode);
    const [editorHeight, setEditorHeight] = useState(200);
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-3xl flex flex-col" style={{ maxHeight: '90vh' }}>
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Coding Challenge</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Challenge Description */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">{task.question}</h3>
                            <p className="text-gray-600">{task.description}</p>
                        </div>
                        
                        {/* Test Cases Display */}
                        <div className="bg-gray-100 p-4 rounded-lg">
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
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
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
                                className="rounded-lg overflow-hidden"
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
                                    className="border rounded-lg"
                                />
                            </ResizableBox>
                        </div>

                        {/* Test Results Section */}
                        {validationResults && (
                            <div className={`p-4 rounded-lg ${
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

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 bg-white rounded-b-lg">
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
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
        </div>
    );
};

export default CodingChallengeModal;
