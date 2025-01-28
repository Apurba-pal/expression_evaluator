import React, { useState } from 'react';
import './App.css'; // Import your CSS file

function App() {
    const [expression, setExpression] = useState('');
    const [expressionType, setExpressionType] = useState('postfix');
    const [steps, setSteps] = useState([]);
    const [result, setResult] = useState('');

    const operators = "+-*/^";

    function convertAndEvaluate() {
        const stack = [];

        // Function to convert postfix to infix
        function convertPostfixToInfix(postfixExpression) {
            const tokens = postfixExpression.split(" ");
            const conversionSteps = [];

            for (let token of tokens) {
                if (!operators.includes(token)) {
                    stack.push(token);
                    conversionSteps.push(["Push", token, stack.filter((value, index, self) => self.indexOf(value) === index).join(" ")]);
                } else {
                    const operand2 = stack.pop();
                    const operand1 = stack.pop();
                    const result = `(${operand1} ${token} ${operand2})`;
                    stack.push(result);
                    conversionSteps.push(["Pop", operand1, operand2, stack.filter((value, index, self) => self.indexOf(value) === index).join(" ")]);
                }
            }

            if (stack.length === 1) {
                return {
                    infixExpression: stack[0],
                    steps: conversionSteps,
                };
            } else {
                return {
                    infixExpression: "Invalid postfix expression",
                    steps: conversionSteps,
                };
            }
        }

        // Function to convert prefix to infix
        function convertPrefixToInfix(prefixExpression) {
            const tokens = prefixExpression.split(" ");
            const conversionSteps = [];

            for (let i = tokens.length - 1; i >= 0; i--) {
                const token = tokens[i];
                if (operators.includes(token)) {
                    const operand1 = stack.pop();
                    const operand2 = stack.pop();
                    const result = `(${operand1} ${token} ${operand2})`;
                    stack.push(result);
                    conversionSteps.push(["Pop", operand2, operand1, stack.filter((value, index, self) => self.indexOf(value) === index).join(" ")]);
                } else {
                    stack.push(token);
                    conversionSteps.push(["Push", token, stack.filter((value, index, self) => self.indexOf(value) === index).join(" ")]);
                }
            }

            if (stack.length === 1) {
                return {
                    infixExpression: stack[0],
                    steps: conversionSteps,
                };
            } else {
                return {
                    infixExpression: "Invalid prefix expression",
                    steps: conversionSteps,
                };
            }
        }

        let infixExpression = "";
        let conversionSteps = [];

        if (expressionType === "postfix") {
            const postfixResult = convertPostfixToInfix(expression);
            infixExpression = postfixResult.infixExpression;
            conversionSteps = postfixResult.steps;
        } else if (expressionType === "prefix") {
            const prefixResult = convertPrefixToInfix(expression);
            infixExpression = prefixResult.infixExpression;
            conversionSteps = prefixResult.steps;
        }

        setSteps(conversionSteps);

        // Evaluate the infix expression
        setResult(eval(infixExpression));
    }

    return (
        <div className="container">
            <h1>Expression Converter and Evaluator</h1>

            <input type="text" id="expression" placeholder="Enter an expression" value={expression} onChange={(e) => setExpression(e.target.value)} />
            <h2>select the type of the provided expression:  </h2>
            <div className="select-radio">
                <div className="p-radio">
                    <input type="radio" id="postfixRadio" name="expressionType" value="postfix" checked={expressionType === 'postfix'} onChange={() => setExpressionType('postfix')} />
                    <label htmlFor="postfixRadio">Postfix</label>
                </div>
                <div className="p-radio">
                    <input type="radio" id="prefixRadio" name="expressionType" value="prefix" checked={expressionType === 'prefix'} onChange={() => setExpressionType('prefix')} />
                    <label htmlFor="prefixRadio">Prefix</label>
                </div>
            </div>

            <button onClick={convertAndEvaluate}>Convert and Evaluate</button>

            <div className="output-area">
                <h2 className="left">Conversion Steps: </h2>
                <table>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Operand</th>
                            <th>Stack</th>
                            <th>Expression</th>
                        </tr>
                    </thead>
                    <tbody>
                        {steps.map((step, index) => (
                            <tr key={index}>
                                <td>{step[0]}</td>
                                <td>{step[1]}</td>
                                <td>{step[2]}</td>
                                <td>{step[3] === undefined ? "-" : step[3]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h2 className="left">Result: </h2>
                <p>{result}</p>
            </div>
        </div>
    );
}

export default App;
