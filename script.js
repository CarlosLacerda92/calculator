function validateNumber(number) {

    if (!['number', 'string'].includes(typeof number)) {
        return false;
    }

    if (number === '') {
        return false;
    }

    number = +number;

    if (!Number.isFinite(number)) {
        return false
    }

    return number;
}