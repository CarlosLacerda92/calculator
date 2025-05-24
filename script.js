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

    if (!validateNumber(number1) || !validateNumber(number2)) {
        return false;
    }

    return number1 + number2;
}

function subtract(number1, number2) {

    if (!validateNumber(number1) || !validateNumber(number2)) {
        return false;
    }

    return number1 - number2;
}

function multiply(number1, number2) {

    if (!validateNumber(number1) || !validateNumber(number2)) {
        return false;
    }

    return number1 * number2;
}

function divide(number1, number2) {

    if (!validateNumber(number1) || !validateNumber(number2)) {
        return false;
    }

    return number1 / number2;
}