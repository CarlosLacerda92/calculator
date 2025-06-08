let calculationData = {
    number1   : '',
    number2   : '',
    operation : '',
    lastResult: '',
}

const calculator          = document.querySelector('#calculator');
const operationDisplay    = document.querySelector('#operation');
const resultDisplay       = document.querySelector('#result');
const floatingPointButton = document.querySelector('button[data-content="fPoint"]');

calculator.addEventListener('click', (event) => {

    const element = event.target.closest('button');

    if (element instanceof Element === false) {
        return;
    }

    if (element.tagName.toLowerCase() !== 'button') {
        return;
    }

    const elementContent = element.dataset.content.trim();

    if (typeof +elementContent === 'number' && !isNaN(+elementContent)) {
        handleNumberClick(elementContent);
    }
    else {
        handleOperationClick(elementContent);
    }
});

document.addEventListener('keydown', (event) => {
    
    let keyPressed    = event.key;
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.', 'Enter', 'Backspace', 'Escape'];

    if (!allowedKeys.includes(keyPressed)) {
        return;
    }

    if (keyPressed === '.') {
        keyPressed = 'fPoint';
    }

    if (keyPressed === 'Enter') {
        keyPressed = 'equals';
    }

    if (keyPressed === 'Backspace') {
        keyPressed = 'backspace';
    }

    if (keyPressed === 'Escape') {
        keyPressed = 'clearAll';
    }
    
    const clickEvent = new Event('click', {
        bubbles: true,
    });

    document.querySelector(`button[data-content="${keyPressed}"]`).dispatchEvent(clickEvent);
});

const observerForResultDisplay = new MutationObserver(() => {

    const textContent = resultDisplay.textContent;
    let fontSize      = '4rem';

    if (textContent.length > 6 && textContent.length <= 9) {
        fontSize = '3rem';
    }

    if (textContent.length > 9) {
        fontSize = '1.5rem';
    }

    resultDisplay.style.fontSize = fontSize;

    floatingPointButton.disabled = textContent.includes('.');
});

observerForResultDisplay.observe(resultDisplay, {
    childList    : true,
    characterData: true,
    subtree      : true,
});

function handleNumberClick(number) {

    const isZero            = ['0', '00'].includes(number);
    const isInitialZero     = +resultDisplay.textContent === 0;
    const startsWithZeroDot = resultDisplay.textContent.startsWith('0.');
    const targetNumber      = calculationData.operation ? 'number2' : 'number1';

    if (calculationData[targetNumber].toString().length >= 8) {
        return;
    }

    if (!startsWithZeroDot && isZero && (isInitialZero || (!calculationData.number2 && calculationData.operation))) {

        calculationData[targetNumber] = '0';

        if (calculationData.operation) {
            printIntoDisplay(resultDisplay, '0');
        }

        return;
    }

    if (isInitialZero && !startsWithZeroDot) {
        calculationData[targetNumber] = '';
    }

    calculationData[targetNumber] += number;
    printIntoDisplay(resultDisplay, calculationData[targetNumber]);
}

function handleOperationClick(operationSelected) {

    const operations = ['+', '-', '*', '/'];

    if (operations.includes(operationSelected)) {

        if (!calculationData.number1 && !calculationData.number2 && !calculationData.operation && calculationData.lastResult) {
            calculationData.number1 = calculationData.lastResult;
        }
        else if (calculationData.number1 && calculationData.number2 && calculationData.operation) {
            operate();
            calculationData.number1 = calculationData.lastResult;
        }
        else if (!calculationData.number1) {
            calculationData.number1 = '0';
        }

        //  This section converts a malformed float number (e.g. 9. to 9)
        calculationData.number1 = fixMalformedFloat(calculationData.number1);
        printIntoDisplay(resultDisplay, calculationData.number1);

        calculationData.operation = operationSelected;

        printIntoDisplay(operationDisplay, `${calculationData.number1} ${calculationData.operation}`);

        return;
    }

    const extraOperations = {
        'backspace': undoLastInput,
        'clearAll' : clearEverything,
        'fPoint'   : addFloatingPoint,
        'equals'   : operate,
    }

    extraOperations[operationSelected]();
}

function printIntoDisplay(container, content) {
    container.textContent = content;
}

function undoLastInput() {

    let displayContent = resultDisplay.textContent;

    displayContent = displayContent.substring(0, (displayContent.length - 1));
    resultDisplay.textContent = displayContent || '0';

    calculationData[calculationData.operation ? 'number2' : 'number1'] = displayContent; 
}

function clearCalculationData() {

    //  Could have used for...in here instead.
    Object.keys(calculationData).forEach((key) => {
        calculationData[key] = '';
    })
}

function clearOperationDisplay() {
    operationDisplay.innerHTML = '&nbsp';
}

function clearResultDisplay() {
    printIntoDisplay(resultDisplay, '0');
}

function clearAllDisplays() {
    clearOperationDisplay();
    clearResultDisplay();
}

function clearEverything() {
    clearAllDisplays();
    clearCalculationData();
}

function addFloatingPoint() {

    const targetNumber = calculationData.operation ? 'number2' : 'number1';

    if (calculationData[targetNumber].includes('.')) {
        return;
    }

    calculationData[targetNumber] += calculationData[targetNumber] ? '.' : '0.';

    printIntoDisplay(resultDisplay, calculationData[targetNumber]);
}

function fixMalformedFloat(number) {

    const floatNumber = number.split('.');

    if (floatNumber.length <= 1 || (floatNumber.length > 1 && floatNumber[1].length > 0)) {
        return number;
    }

    return floatNumber[0];
}

function validateNumber(number) {

    if (!['number', 'string'].includes(typeof number)) {
        return false;
    }

    if (number === '') {
        return false;
    }

    return Number.isFinite(+number)
}

function add(number1, number2) {
    return number1 + number2;
}

function subtract(number1, number2) {
    return number1 - number2;
}

function multiply(number1, number2) {
    return number1 * number2;
}

function divide(number1, number2) {
    return number1 / number2;
}

function operate() {

    try {
        const number1   = fixMalformedFloat(calculationData.number1);
        const number2   = fixMalformedFloat(calculationData.number2);
        const operation = calculationData.operation;

        if (!validateNumber(number1) || !validateNumber(number2)) {
            throw new TypeError('Both numbers must be valid!')
        }

        const a    = +number1;
        const b    = +number2;
        let result = null;

        if (operation === '/' && b === 0) {
            clearEverything();
            throw new Error('Cannot divide by zero.')
        }

        //  Object that stores a reference to each basic math operation
        const operations = {
            "+": add,
            "-": subtract,
            "*": multiply,
            "/": divide,
        }
        
        //  Define the operation to be run based on the argument (operation) sent by the user
        const operatorFunction = operations[operation];

        if (!operatorFunction) {
            throw new Error(`Unsupported operation: "${operation}". Use one of ${Object.keys(operations).join(', ')}`);
        }

        result = operatorFunction(a, b);

        const resultString = result.toString();

        //  If the result has too many digits after the floating point, round it until only 6 digits are left.
        if (resultString.includes('.')) {
            
            const numberOfDecimals = resultString.split('.')[1].length;
            
            if (numberOfDecimals > 6) {
                result = result.toFixed(6);
            }
        }

        printIntoDisplay(operationDisplay, `${number1} ${operation} ${number2} =`);
        printIntoDisplay(resultDisplay, result.toString());

        clearCalculationData();

        calculationData.lastResult = result.toString();
    }
    catch (error) {
        const errorMessage = `Something went wrong: ${error.message}`;
        alert(errorMessage);
        console.error(errorMessage);
    }
}