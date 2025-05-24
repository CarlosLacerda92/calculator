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