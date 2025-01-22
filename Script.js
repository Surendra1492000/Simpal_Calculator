const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

function handleNumber(number) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = number;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? number : displayValue + number;
    }

    updateDisplay();
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator, waitingForSecondOperand } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const currentValue = firstOperand || 0;
        const result = performCalculation[operator](currentValue, inputValue);

        calculator.displayValue = String(result);
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;

    updateDisplay();
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '^': (firstOperand, secondOperand) => Math.pow(firstOperand, secondOperand),
    '=': (firstOperand, secondOperand) => secondOperand
};

function handleFunction(func) {
    const { displayValue } = calculator;
    const inputValue = parseFloat(displayValue);

    let result;
    switch (func) {
        case 'sqrt':
            result = Math.sqrt(inputValue);
            break;
        case 'sin':
            result = Math.sin(inputValue);
            break;
        case 'cos':
            result = Math.cos(inputValue);
            break;
        case 'tan':
            result = Math.tan(inputValue);
            break;
        default:
            result = displayValue;
    }

    calculator.displayValue = String(result);
    updateDisplay();
}

function handleDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        updateDisplay();
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }

    updateDisplay();
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    updateDisplay();
}

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    const { value } = target;

    if (!target.matches('button')) {
        return;
    }

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '^':
        case '=':
            handleOperator(value);
            break;
        case '.':
            handleDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        case 'sqrt':
        case 'sin':
        case 'cos':
        case 'tan':
            handleFunction(value);
            break;
        default:
            if (Number.isInteger(parseFloat(value))) {
                handleNumber(value);
            }
    }
});

