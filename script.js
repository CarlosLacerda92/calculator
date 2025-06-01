let calculationData = {
    number1  : '',
    number2  : '',
    operation: null
}

let calculator = document.querySelector('#calculator');
let display    = document.querySelector('#visor');

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
    if (!calculationData.operation) {
        calculationData.number1 += number;
        printIntoDisplay(calculationData.number1);
    }
    else {
        calculationData.number2 += number;
        printIntoDisplay(calculationData.number2);
    }
}

function handleOperationClick(operationSelected) {

    const operations = ['+', '-', '*', '/'];

    if (operations.includes(operationSelected)) {
        calculationData.operation = operationSelected;
        return;
    }

    switch (operationSelected) {

        case 'backspace':

            let displayContent = display.textContent;

            displayContent      = displayContent.substring(0, (displayContent.length - 1));
            display.textContent = displayContent || '0';

            calculationData[calculationData.operation ? 'number2' : 'number1'] = displayContent;

            break;
    }
}

function printIntoDisplay(content) {
    display.textContent = content;
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