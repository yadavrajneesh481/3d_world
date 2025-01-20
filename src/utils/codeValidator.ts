interface ValidationResult {
    success: boolean;
    error?: string;
    testResults: {
        input: string;
        expectedOutput: string;
        actualOutput: string;
        passed: boolean;
    }[];
}

export function validateCode(code: string, testCases: { input: string; expectedOutput: string }[]): ValidationResult {
    try {
        // Create a safe evaluation context
        const evalContext = new Function('code', `
            try {
                ${code}
                return { success: true, function: eval(code.match(/function\\s+(\\w+)/)[1]) };
            } catch (error) {
                return { success: false, error: error.message };
            }
        `);

        // Get the function from the code
        const result = evalContext(code);
        if (!result.success) {
            return {
                success: false,
                error: `Syntax Error: ${result.error}`,
                testResults: []
            };
        }

        const testFunction = result.function;
        const testResults = testCases.map(testCase => {
            try {
                // Parse input based on type
                const input = testCase.input.match(/^-?\d+$/) 
                    ? parseInt(testCase.input) 
                    : testCase.input;

                // Run the test case
                const actualOutput = String(testFunction(input));
                const expectedOutput = testCase.expectedOutput;
                const passed = actualOutput === expectedOutput;

                return {
                    input: testCase.input,
                    expectedOutput,
                    actualOutput,
                    passed
                };
            } catch (error) {
                return {
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: `Error: ${error.message}`,
                    passed: false
                };
            }
        });

        const allTestsPassed = testResults.every(result => result.passed);

        return {
            success: allTestsPassed,
            testResults
        };
    } catch (error) {
        return {
            success: false,
            error: `Evaluation Error: ${error.message}`,
            testResults: []
        };
    }
}
