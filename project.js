// 1. Despot some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. check if the user won
// 6. give the user their winnings
// 7. play again

const prompt = require("prompt-sync")();

let chalk;
(async () => {
  chalk = (await import('chalk')).default;

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount, try again.");
    } else {
      return numberDepositAmount;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3): ");
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("Invalid number of lines, try again.");
    } else {
      return numberOfLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the bet per line: ");
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log("Invalid bet, try again.");
    } else {
      return numberBet;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;
    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }
  return winnings;
};

const printRows = (rows) => {
    const border = "+---+---+---+";
    console.log(border);
    for (const row of rows) {
      let rowString = "|";
      for (const symbol of row) {
        rowString += ` ${symbol} |`;
      }
      console.log(rowString);
      console.log(border);
    }
  };

  const printHeader = () => {
    console.clear();
    console.log(chalk.cyan.bold("====================================="));
    console.log(chalk.cyan.bold("      WELCOME TO SLOT MACHINE!       "));
    console.log(chalk.cyan.bold("====================================="));
  };

  const printGoodbye = () => {
    console.log(chalk.yellow.bold("\nThanks for playing! Goodbye!\n"));
  };

  const game = () => {
    printHeader();
    let balance = deposit();

    while (true) {
      console.log(chalk.green.bold("\n-------------------------------------"));
      console.log("Your current balance: " + chalk.yellow(`$${balance}`));
      const numberOfLines = getNumberOfLines();
      const bet = getBet(balance, numberOfLines);
      console.log(
        chalk.blue(
          `\nBetting $${bet} on ${numberOfLines} line${numberOfLines > 1 ? "s" : ""}...`
        )
      );
      balance -= bet * numberOfLines;
      console.log(chalk.gray("\nSpinning...\n"));
      const reels = spin();
      const rows = transpose(reels);
      printRows(rows);
      const winnings = getWinnings(rows, bet, numberOfLines);
      balance += winnings;
      if (winnings > 0) {
        console.log(chalk.greenBright.bold(`\nYou won $${winnings}! 🎉`));
      } else {
        console.log(chalk.redBright.bold("\nNo win this time. Try again!"));
      }

      if (balance <= 0) {
        console.log(chalk.red.bold("\nYou ran out of money!"));
        break;
      }

      const playAgain = prompt(chalk.magenta("\nDo you want to play again (y/n)? "));

      if (playAgain.toLowerCase() != "y") break;
      printHeader();
    }
    printGoodbye();
  };

  game();
})();