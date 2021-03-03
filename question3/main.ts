export class Connect4 {
  board: object;
  turn: number;  // either 0 or 1 where 0 is p1, 1 is p2
  private _finished: boolean;

  constructor() {
    this.board = {
      col0: {
        ind: 0,
        values: [-1, -1, -1, -1, -1, -1]
      },
      col1: {
        ind: 0,
        values: [-1, -1, -1, -1, -1, -1]
      },
      col2: {
        ind: 0,
        values: [-1, -1, -1, -1, -1, -1]
      },
      col3: {
        ind: 0,
        values: [-1, -1, -1, -1, -1, -1]
      },
      col4: {
        ind: 0,
        values: [-1, -1, -1, -1, -1, -1]
      },
      col5: {
        ind: 0,
        values: [-1, -1, -1, -1, -1, -1]
      },
      col6: {
        ind: 0,
        values: [-1, -1, -1, -1, -1, -1]
      },
    }
    this.turn = 0; // represents player 1
    this._finished = false;
  }
  
  private getRow(rowNum: number): object{
    const row = [];
    // loop through 7 times to get the entire row
    for (let i = 0; i < 7; i++) row.push(this.board[`col${i}`].values[rowNum]);
    return row;
  }

  private getDiagStartLocation(rowNum: number, colNum: number, isRight: boolean): object {
    let toZero;
    let startLocation;
    if (isRight) {
      if (rowNum > colNum) toZero = colNum;
      else toZero = rowNum;
      startLocation = {
        row: rowNum - toZero,
        col: colNum - toZero
      }
    } else {
      toZero = rowNum;
      startLocation = {
        row: rowNum - toZero,
        col: colNum + toZero > 6 ? 6 : colNum + toZero
      }
    }
    return startLocation;
  }

  private getRanges(): object {
    return {
      row: {
        min: 0,
        max: 5
      },
      col: {
        min: 0,
        max: 6
      }
    }
  }

  private getLeftDiag(rowNum: number, colNum: number): number[] {
    const ranges = this.getRanges();
    const startLocation = this.getDiagStartLocation(rowNum, colNum, false);
    const leftDiag = [];
    let i = startLocation["row"], j = startLocation["col"];
    while (i < ranges["row"]["max"] + 1 && j > ranges["col"]["min"] - 1) {
      leftDiag.push(this.board[`col${j}`].values[i]);
      i++;
      j--;
    }
    return leftDiag;
  }
  private getRightDiag(rowNum: number, colNum: number): number[] {
    const ranges = this.getRanges();
    const startLocation = this.getDiagStartLocation(rowNum, colNum, true);
    const rightDiag = [];
    let i = startLocation["row"], j = startLocation["col"];
    while (i < ranges["row"]["max"] + 1 && j < ranges["col"]["max"] + 1) {
      rightDiag.push(this.board[`col${j}`].values[i]);
      i++;
      j++;
    }
    return rightDiag;
  }

  private getDiag(rowNum: number, colNum: number): number[][] {
    return [this.getLeftDiag(rowNum, colNum), this.getRightDiag(rowNum, colNum)];
  }

  private wonByRow(colNum: number, player: number): boolean {
    const rowNumToCheck = this.board[`col${colNum}`].ind;
    const rowToCheck = this.getRow(rowNumToCheck);
    let hasWon = false;
    let i = 0;
    while (!hasWon && i < 4) {
      const first = rowToCheck[i];
      const second = rowToCheck[i + 1];
      const third = rowToCheck[i + 2];
      const fourth = rowToCheck[i + 3];
      if (first !== -1 && first === second && second === third && third === fourth) hasWon = true;
      i++;
    }
    return hasWon;
  }

  private wonByColumn(colNum: number, player: number): boolean {
    const colToCheck = this.board[`col${colNum}`];
    let indCopy = colToCheck.ind;
    let hasWon = false;
    const winnerToCheck = player;
    let numPieces = 0;

    // check the 4 spots going down
    if (indCopy > 2) {
      while (indCopy > -1 && numPieces < 4) {
        if (colToCheck.values[indCopy] !== winnerToCheck) indCopy = -1;
        else {
          numPieces++;
          if (numPieces === 4) {
            hasWon = true;
          }
          indCopy--;
        }
      }
    }
    return hasWon;
  }

  private wonByDiagonal(colNum: number, player: number): boolean {
    const rowNumToCheck = this.board[`col${colNum}`].ind;
    const diagsToCheck = this.getDiag(rowNumToCheck, colNum);
    let hasWon = false;
    let j = 0;
    while(!hasWon && j < 2) {
      let i = 0;
      const diagArrLength = diagsToCheck[j].length;
      if (diagArrLength < 4) j++;
      else {
        while (!hasWon && i < 4) {
          const first = diagsToCheck[j][i];
          const second = diagsToCheck[j][i + 1];
          const third = diagsToCheck[j][i + 2];
          const fourth = diagsToCheck[j][i + 3];
          if (first !== -1 && first === second && second === third && third === fourth) hasWon = true;
          i++;
        }
        j++;
      }
    }
    return hasWon;
  }

  private isColFull(colNum: number): boolean {
    const colToCheck = this.board[`col${colNum}`];
    let isFull = false;
    if (!(colToCheck.ind < 6)) isFull = true;
    return isFull;
  }

  private makeMove(colNum: number): string {
    let move;
    if (this.isColFull(colNum)) {
      move = "Column full!";
    } else {
      // add the move to the board
      const colToChange = this.board[`col${colNum}`];
      colToChange.values[colToChange.ind] = this.turn;
      if (this.wonByRow(colNum, this.turn) || this.wonByColumn(colNum, this.turn) || this.wonByDiagonal(colNum, this.turn)) {
        move = `Player ${this.turn + 1} wins!`;
        this._finished = true;
      }
      else move = `Player ${this.turn + 1} has a turn`;
      
      if (this.turn) this.turn = 0;
      else this.turn = 1;
      colToChange.ind++;
    }
    return move;
  }
  
  play(col: number): string{
    let moveResult;
    if (this._finished) {
      moveResult = "Game has finished!"
    }
    else {
      moveResult = this.makeMove(col);
    }
    return moveResult;
  }
}