let calculationData = {
    number1  : '',
    number2  : '',
    operation: '',
}

const calculator       = document.querySelector('#calculator');
const operationDisplay = document.querySelector('#operation');
const resultDisplay    = document.querySelector('#result');

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

function handleNumberClick(number) {

    const isZero        = ['0', '00'].includes(number);
    const isInitialZero = +resultDisplay.textContent === 0;
    const targetNumber  = calculationData.operation ? 'number2' : 'number1';

    if (isZero && (isInitialZero || (!calculationData.number2 && calculationData.operation))) {

        calculationData[targetNumber] = '0';

        if (calculationData.operation) {
            printIntoDisplay(resultDisplay, '0');
        }

        return;
    }

    if (isInitialZero) {
        calculationData[targetNumber] = '';
    }

    calculationData[targetNumber] += number;
    printIntoDisplay(resultDisplay, calculationData[targetNumber]);
}

function handleOperationClick(operationSelected) {

    const operations = ['+', '-', '*', '/'];

    if (operations.includes(operationSelected)) {
        calculationData.operation = operationSelected;
        printIntoDisplay(operationDisplay, `${calculationData.number1} ${calculationData.operation}`);
        return;
    }

    const extraOperations = {
        'backspace': undoLastInput,
        'clearAll' : clearAllEntries,
        'fPoint'   : addFloatingPoint,
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

function clearAllEntries() {

    operationDisplay.innerHTML = '&nbsp;';
    printIntoDisplay(resultDisplay, '0');

    Object.keys(calculationData).forEach((key) => {
        calculationData[key] = '';
    })
}

function addFloatingPoint() {

    const targetNumber = calculationData.operation ? 'number2' : 'number1';

    if (calculationData[targetNumber].includes('.')) {
        return;
    }

    calculationData[targetNumber] += '.';

    printIntoDisplay(resultDisplay, calculationData[targetNumber]);
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

function operate(number1, number2, operation) {

    if (!validateNumber(number1) || !validateNumber(number2)) {
        throw new TypeError('Both numbers must be valid!')
    }

    const a = +number1;
    const b = +number2;

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

    return operatorFunction(a, b);
}

/* try {
    operate(5, '*', '-');
}
catch(error) {
    const errorMessage = `Something went wrong: ${error.message}`;
    alert(errorMessage);
    console.error(errorMessage);
} */