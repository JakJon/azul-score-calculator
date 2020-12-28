import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./board.scss";
import { threadId } from "worker_threads";
import { render } from "@testing-library/react";
import Tile from "../tile/tile";


const Board = () => {
  const [score, setScore] = useState(0);
  const [rowTiles, setRowTiles] = useState(0);
  const [columnTiles, setColumnTiles] = useState(0);
  const [boardValues, setBoardValues] = useState<boolean[][]>(createEmptyBoard());

  function createEmptyBoard(): boolean[][] {
        let board: boolean[][] = []

        for (let y = 0; y < 5; y++) {
            board![y] = [];
            for (let x = 0; x < 5; x++) {
                board![y][x] = false;
            }
        }
        return board;
    }

    function activateTile(y: number, x: number): void {
        let board = boardValues;
        board[y][x] = !board[y][x];
        setBoardValues(board);
        console.log(boardValues);
    }

    function startOver(): void {
      window.location.reload();
    }

    function calcRoundScore(): void {
      setScore(calcRowAndIndividualTileScores() + calcColumnScores());
    }

    //Looks for individual tiles and consecutive rows
    function calcRowAndIndividualTileScores(): number {
      let totalRowsScore = 0;

      for (let y = 0; y < 5; y++) {
        let rowScore = 0;
        for (let x = 0; x < 5; x++) {
          let checkLeft = x !== 0;
          let checkRight = x !== 4;
          let checkUp = y !== 0;
          let checkDown = y !== 4;

          if (boardValues[y][x]) {
            if (checkLeft) {
              if (boardValues[y][x-1]) {
                checkRight = false;
              } 
            }
            if (checkRight) {
              if (!boardValues[y][x+1]) {
                if (checkUp) {
                  if (!boardValues[y-1][x]) {
                    if (checkDown) {
                      if (!boardValues[y+1][x]) {
                        // Individual active tile
                        rowScore++;
                      }
                    } else if (y === 4) {
                      // Individual active tile in bottom row
                      rowScore++;
                    }
                  }
                } else if (y === 0) {
                  if (!boardValues[y+1][x]) {
                    // Individual active tile in top row
                    rowScore++;
                  }
                }
              } else {
                // Consecutive active tiles
                rowScore += 2;
                if (x+2 !== 5 ){
                  if (boardValues[y][x+2]) {
                    rowScore++;
                    if (x+3 !== 5) {
                      if (boardValues[y][x+3]) {
                        rowScore++;
                        if (x+4 !== 5) {
                          if (boardValues[y][x+4]) {
                            rowScore++;
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else if (x === 4) {
              if (!boardValues[y][x-1]) {
                if (checkUp) {
                  if (!boardValues[y-1][x]) {
                    if (checkDown) {
                      if (!boardValues[y+1][x]) {
                        // Individual active tile in right column
                        rowScore++;
                      }
                    } else if (y === 4) {
                      // Individual active tile in bottom row and right column
                      rowScore++;
                    }
                  }
                } else if (y === 0) {
                  if (!boardValues[y+1][x]) {
                    // Individual active tile in top row and right column
                    rowScore++;
                  }
                }
              }
            }
          }
        }
        totalRowsScore += rowScore;
      }
      return totalRowsScore;
    }

    function calcColumnScores(): number {
      let totalColumnsScore = 0;
      for (let y = 0; y < 5; y++) {
        let columnScore = 0;
        for (let x = 0; x < 5; x++) {
          let checkUp = y !== 0;
          let checkDown = true;

          if (checkUp) {
            if (boardValues[y-1][x]) {
              checkDown = false;
            }
          }
          if (checkDown) {
            if (boardValues[y][x]) {
              if (y+1 !== 5) {
                if (boardValues[y+1][x]) {
                  columnScore+= 2;
                  if (y+2 !== 5) {
                    if (boardValues[y+2][x]) {
                      columnScore++;
                      if (y+3 !== 5) {
                        if (boardValues[y+3][x]) {
                          columnScore++;
                          if (y+4 !== 5) {
                            if (boardValues[y+4][x]) {
                              columnScore++;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        totalColumnsScore += columnScore;
      }
      return totalColumnsScore;
    }

    function gameScore(): void {
      setBoardValues(createEmptyBoard());
    }
    
  return (
    <div className="board-container">
      <h1>Total Score: {score}</h1>
      <table>
        <tbody>
          <tr>
            <div onClick={() => activateTile(0,0)}><Tile active={boardValues[0][0]} color="blue"/></div>
            <div onClick={() => activateTile(0,1)}><Tile active={boardValues[0][1]} color="orange"/></div>
            <div onClick={() => activateTile(0,2)}><Tile active={boardValues[0][2]} color="red"/></div>
            <div onClick={() => activateTile(0,3)}><Tile active={boardValues[0][3]} color="black"/></div>
            <div onClick={() => activateTile(0,4)}><Tile active={boardValues[0][4]} color="teal"/></div>
          </tr>
          <tr>
            <div onClick={() => activateTile(1,0)}><Tile active={boardValues[1][0]} color="teal"/></div>
            <div onClick={() => activateTile(1,1)}><Tile active={boardValues[1][1]} color="blue"/></div>
            <div onClick={() => activateTile(1,2)}><Tile active={boardValues[1][2]} color="orange"/></div>
            <div onClick={() => activateTile(1,3)}><Tile active={boardValues[1][3]} color="red"/></div>
            <div onClick={() => activateTile(1,4)}><Tile active={boardValues[1][4]} color="black"/></div>
          </tr>
          <tr>
            <div onClick={() => activateTile(2,0)}><Tile active={boardValues[2][0]} color="black"/></div>
            <div onClick={() => activateTile(2,1)}><Tile active={boardValues[2][1]} color="teal"/></div>
            <div onClick={() => activateTile(2,2)}><Tile active={boardValues[2][2]} color="blue"/></div>
            <div onClick={() => activateTile(2,3)}><Tile active={boardValues[2][3]} color="orange"/></div>
            <div onClick={() => activateTile(2,4)}><Tile active={boardValues[2][4]} color="red"/></div>
          </tr>
          <tr>
            <div onClick={() => activateTile(3,0)}><Tile active={boardValues[3][0]} color="red"/></div>
            <div onClick={() => activateTile(3,1)}><Tile active={boardValues[3][1]} color="black"/></div>
            <div onClick={() => activateTile(3,2)}><Tile active={boardValues[3][2]} color="teal"/></div>
            <div onClick={() => activateTile(3,3)}><Tile active={boardValues[3][3]} color="blue"/></div>
            <div onClick={() => activateTile(3,4)}><Tile active={boardValues[3][4]} color="orange"/></div>
          </tr>
          <tr>
            <div onClick={() => activateTile(4,0)}><Tile active={boardValues[4][0]} color="orange"/></div>
            <div onClick={() => activateTile(4,1)}><Tile active={boardValues[4][1]} color="red"/></div>
            <div onClick={() => activateTile(4,2)}><Tile active={boardValues[4][2]} color="black"/></div>
            <div onClick={() => activateTile(4,3)}><Tile active={boardValues[4][3]} color="teal"/></div>
            <div onClick={() => activateTile(4,4)}><Tile active={boardValues[4][4]} color="blue"/></div>
          </tr>
        </tbody>
      </table>
      <div className="floor-section">
        <h2>Amount of Tiles on Floor</h2>
        <select>
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
        </select>
      </div>
      <div className="option-section">
        <h3 onClick={() => calcRoundScore()} className="teal-option">End Round</h3>
        <h3 onClick={() => gameScore()} className="red-option">End Game</h3>
        <h3 onClick={() => startOver()} className="orange-option">Start Over</h3>
      </div>
    </div>
  );
}

export default Board;
