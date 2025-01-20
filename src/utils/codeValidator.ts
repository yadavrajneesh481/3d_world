/**
 * Interface defining the structure of validation results
 * Contains overall success status, any errors, and individual test results
 */
interface ValidationResult {
    success: boolean;              // Whether all tests passed
    error?: string;               // Any error message if validation failed
    testResults: {
        input: string;
        expectedOutput: string;
        actualOutput: string;
        passed: boolean;
    }[];
}

/**
 * Validates user-submitted code against a set of test cases
 * @param code - The JavaScript code to validate
 * @param testCases - Array of test cases with input and expected output
 * @returns ValidationResult containing test results and any errors
 */
export function validateCode(code: string, testCases: { input: string; expectedOutput: string }[]): ValidationResult {
    try {
        // Create a safe evaluation context using Function constructor
        // This provides a sandbox for running the code without direct eval
        const evalContext = new Function('code', `
            try {
                // Execute the code and extract the function name
                ${code}
                return { 
                    success: true, 
                    function: eval(code.match(/function\\s+(\\w+)/)[1]) 
                };
            } catch (error) {
                return { 
                    success: false, 
                    error: error.message 
                };
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

        // Get the actual function to test
        const testFunction = result.function;

        // Run each test case
        const testResults = testCases.map(testCase => {
            try {
                // Convert numeric strings to actual numbers
                // This helps with type coercion in JavaScript
                const input = testCase.input.match(/^-?\d+$/) 
                    ? parseInt(testCase.input) 
                    : testCase.input;

                // Run the test case and convert result to string for comparison
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
                // If the function throws an error during execution
                return {
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: `Error: ${error.message}`,
                    passed: false
                };
            }
        });

        // Check if all tests passed
        const allTestsPassed = testResults.every(result => result.passed);

        return {
            success: allTestsPassed,
            testResults
        };
    } catch (error) {
        // Handle any unexpected errors during validation
        return {
            success: false,
            error: `Evaluation Error: ${error.message}`,
            testResults: []
        };
    }
}
