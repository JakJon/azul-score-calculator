import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./board.scss";
import { threadId } from "worker_threads";
import { render } from "@testing-library/react";
import Tile from "../tile/tile";


const Board = () => {
  const [score, setScore] = useState(0);
  const [scorePrefix, setScorePrefix] = useState("Total")
  const [boardValues, setBoardValues] = useState<boolean[][]>(createEmptyBoard());
  const [roundCount, setRoundCount] = useState(1);
  const [floorMessage, setFloorMessage] = useState("");
  const [gameEnded, setGameEnded] = useState(false);
  const [completedRow, setCompletedRow] = useState(false);
  const [endPrompt, setEndPrompt] = useState(false);
  const [startOverPrompt, setStartOverPrompt] = useState(false);

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
    }

    function startOver(): void {
      window.location.reload();
    }

    function calcRoundScore(): void {
      if(calcRowAndIndividualTileScores() + calcColumnScores() + score - calcFloorScore() >= 0) {
        setScore(calcRowAndIndividualTileScores() + calcColumnScores() + score - calcFloorScore());
      } else {
        setScore(0);
      }
      setRoundCount(1 + roundCount)
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

    function calcFloorScore(): number {
      var floor = (document.getElementById("floor") as HTMLSelectElement);
      let floorScore = 0;

      switch (floor.value) {
        case "0": {
          floorScore = 0;
          setFloorMessage("");
          break;
        }
        case "1": {
          floorScore = 1;
          setFloorMessage("-1 Tiles");
          break
        }
        case "2": {
          floorScore = 2;
          setFloorMessage("-2 Tiles");
          break
        }
        case "3": {
          floorScore = 4;
          setFloorMessage("-4 Tiles");
          break
        }
        case "4": {
          floorScore = 6;
          setFloorMessage("-6 Tiles");
          break
        }
        case "5": {
          floorScore = 8;
          setFloorMessage("-8 Tiles");
          break
        }
        case "6": {
          floorScore = 11;
          setFloorMessage("-11 Tiles");
          break
        }
        case "7": {
          floorScore = 14;
          setFloorMessage("-14 Tiles");
          break
        }
      }
      return floorScore;
    }

    function gameScore(): void {
      setScorePrefix("Final")
      setEndPrompt(false);
      setGameEnded(true);
      console.log(calcFinalRoundScore());
      console.log(fiveOfAKindCheck() + fullRowCheck() + fullColumnCheck())
      setScore(score + calcFinalRoundScore() + fiveOfAKindCheck() + fullRowCheck() + fullColumnCheck());
    }

    function calcFinalRoundScore(): number {
      let roundScore = calcRowAndIndividualTileScores() + calcColumnScores() - calcFloorScore();
      return roundScore;
    }

    function fiveOfAKindCheck(): number {
      let bonusPoints = 0;

      // Blues
      if (boardValues[0][0] && boardValues[1][1] && boardValues[2][2] && boardValues[3][3] && boardValues[4][4]) {
        bonusPoints += 10;
      }
      // Oranges
      if (boardValues[0][1] && boardValues[1][2] && boardValues[2][3] && boardValues[3][4] && boardValues[4][0]) {
        bonusPoints += 10;
      }
      // Reds
      if (boardValues[0][2] && boardValues[1][3] && boardValues[2][4] && boardValues[3][0] && boardValues[4][1]) {
        bonusPoints += 10;
      }
      // Blacks
      if (boardValues[0][3] && boardValues[1][4] && boardValues[2][0] && boardValues[3][1] && boardValues[4][2]) {
        bonusPoints += 10;
      }
      // Teals
      if (boardValues[0][4] && boardValues[1][0] && boardValues[2][1] && boardValues[3][2] && boardValues[4][3]) {
        bonusPoints += 10;
      }
      return bonusPoints;
    }

    function fullRowCheck(): number {
      let bonusPoints = 0
      if (boardValues[0][0] && boardValues[0][1] && boardValues[0][2] && boardValues[0][3] && boardValues[0][4]) {
        bonusPoints += 2;
      }
      if (boardValues[1][0] && boardValues[1][1] && boardValues[1][2] && boardValues[1][3] && boardValues[1][4]) {
        bonusPoints += 2;
      }
      if (boardValues[2][0] && boardValues[2][1] && boardValues[2][2] && boardValues[2][3] && boardValues[2][4]) {
        bonusPoints += 2;
      }
      if (boardValues[3][0] && boardValues[3][1] && boardValues[3][2] && boardValues[3][3] && boardValues[3][4]) {
        bonusPoints += 2;
      }
      if (boardValues[4][0] && boardValues[4][1] && boardValues[4][2] && boardValues[4][3] && boardValues[4][4]) {
        bonusPoints += 2;
      }
      if (bonusPoints !== 0) {
        setCompletedRow(true);
      }
      return bonusPoints;
    }

    function fullColumnCheck(): number {
      let bonusPoints = 0;

      if (boardValues[0][0] && boardValues[1][0] && boardValues[2][0] && boardValues[3][0] && boardValues[4][0]) {
        bonusPoints += 7;
      }
      if (boardValues[0][1] && boardValues[1][1] && boardValues[2][1] && boardValues[3][1] && boardValues[4][1]) {
        bonusPoints += 7;
      }
      if (boardValues[0][2] && boardValues[1][2] && boardValues[2][2] && boardValues[3][2] && boardValues[4][2]) {
        bonusPoints += 7;
      }
      if (boardValues[0][3] && boardValues[1][3] && boardValues[2][3] && boardValues[3][3] && boardValues[4][3]) {
        bonusPoints += 7;
      }
      if (boardValues[0][4] && boardValues[1][4] && boardValues[2][4] && boardValues[3][4] && boardValues[4][4]) {
        bonusPoints += 7;
      }
      return bonusPoints;
    }

    function showEndPrompt(show: boolean): void {
      if(show) {
        setEndPrompt(true);
      } else {
        setEndPrompt(false);
      }
    }

    function showStartOverPrompt(show: boolean): void {
      if(show) {
        setStartOverPrompt(true);
      } else {
        setStartOverPrompt(false);
      }
    }
    
  return (
    <div className="board-container">
      <h2 className="round-number">Round {roundCount}</h2>
      <h1 className="total-score">{scorePrefix} Score: {score}</h1>
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
      <div onClick={() => calcFloorScore()} className="floor-section">
        <h2 className="tile-amount">Amount of Tiles on Floor</h2>
        <select id="floor">
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
      <h2 className="floor-message">{floorMessage}</h2>
      <div className="option-section">
        {!endPrompt && !startOverPrompt && <>
        {!gameEnded && <h3 onClick={() => calcRoundScore()} className="teal-option">End Round</h3>}
        {roundCount >= 5 && !gameEnded && <h3 onClick={() => showEndPrompt(true)} className="red-option">End Game</h3>}
        {roundCount >= 2 && <h3 onClick={() => showStartOverPrompt(true)} className="orange-option">Start Over</h3>}
        </> }

        {endPrompt && <>
          <h2 className="end-game">End the Game?</h2>
          <h3 onClick={() => gameScore()}className="red-option">Yes</h3>
          <h3 onClick={() => showEndPrompt(false)} className="red-option">No</h3>
        </> }

        {startOverPrompt && <>
          <h2 className="start-over">Start the Game Over?</h2>
          <h3 onClick={() => startOver()}className="orange-option">Yes</h3>
          <h3 onClick={() => showStartOverPrompt(false)} className="orange-option">No</h3>
        </> }

      </div>
    </div>
  );
}

export default Board;
