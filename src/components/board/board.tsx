import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./board.scss";
import { threadId } from "worker_threads";
import { render } from "@testing-library/react";
import Tile from "../tile/tile";
import TileData from "../../models/tileData.interface";


const Board = () => {
  const [score, setScore] = useState(0);
  const [scorePrefix, setScorePrefix] = useState("Total")
  const [roundCount, setRoundCount] = useState(1);
  const [boardValues, setBoardValues] = useState<TileData[][]>(createEmptyBoard());
  const [floorMessage, setFloorMessage] = useState("");
  const [gameEnded, setGameEnded] = useState(false);
  const [completedRow, setCompletedRow] = useState(false);
  const [endPrompt, setEndPrompt] = useState(false);
  const [startOverPrompt, setStartOverPrompt] = useState(false);

  function createEmptyBoard(): TileData[][] {
        let board: TileData[][] = [];

        for (let y = 0; y < 5; y++) {
          board![y] = [];
          for (let x = 0; x < 5; x++) {
              board![y][x] = {active: false, checked: false, round: roundCount}
          }
      }
        return board;
    }

    function clearChecks(): void {
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            boardValues[y][x].checked = false;
        }
      } 
    }

    function activateTile(y: number, x: number): void {
        let board = boardValues;
        board[y][x].active = !board[y][x].active;
        board[y][x].round = roundCount;
        setBoardValues(board);
    }

    function startOver(): void {
      window.location.reload();
    }

    function calcRoundScore(): number {
      let tempScore = 0;

      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          let checkLeft = x !== 0;
          let checkRight = x !== 4;
          let checkUp = y !== 0;
          let checkDown = y !== 4;
          let isRow = false;
          let isColumn = false;

          if (boardValues[y][x].active && boardValues[y][x].round === roundCount) {
            tempScore++;
            
            if (checkUp) {
              console.log(boardValues[y][x] + " up");
              if (boardValues[y-1][x].active){
                tempScore++;
                boardValues[y-1][x].checked = true;
                isColumn = true;
                if (y-2 !== -1) {
                  if (boardValues[y-2][x].active) {
                    tempScore++;
                    boardValues[y-2][x].checked = true;
                    if (y-3 !== -1) {
                      if (boardValues[y-3][x].active) {
                        tempScore++;
                        boardValues[y-3][x].checked = true;
                        if (y-4 !== -1) {
                          if (boardValues[y-4][x].active) {
                            tempScore++;
                            boardValues[y-4][x].checked = true;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (checkDown) {
              console.log(boardValues[y][x] + " down");
              if (boardValues[y+1][x].active && boardValues[y+1][x].round !== roundCount){
                console.log("tile round: " + boardValues[y+1][x].round + " board round: " + roundCount);
                tempScore++;
                boardValues[y+1][x].checked = true;
                isColumn = true;
                if (y+2 !== 5) {
                  if (boardValues[y+2][x].active && boardValues[y+2][x].round !== roundCount) {
                    tempScore++;
                    boardValues[y+2][x].checked = true;
                    if (y+3 !== 5) {
                      if (boardValues[y+3][x].active && boardValues[y+3][x].round !== roundCount) {
                        tempScore++;
                        boardValues[y+3][x].checked = true;
                        if (y+4 !== 5) {
                          if (boardValues[y+4][x].active && boardValues[y+4][x].round !== roundCount) {
                            tempScore++;
                            boardValues[y+4][x].checked = true;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (checkLeft) {
              console.log(boardValues[y][x] + " left");
              if (boardValues[y][x-1].active){
                tempScore++;
                boardValues[y][x-1].checked = true;
                isRow = true;
                if (x-2 !== -1) {
                  if (boardValues[y][x-2].active) {
                    tempScore++;
                    boardValues[y][x-2].checked = true;
                    if (x-3 !== -1) {
                      if (boardValues[y][x-3].active) {
                        tempScore++;
                        boardValues[y][x-3].checked = true;
                        if (x-4 !== -1) {
                          if (boardValues[y][x-4].active) {
                            tempScore++;
                            boardValues[y][x-4].checked = true;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (checkRight) {
              console.log(boardValues[y][x] + " right");

              if (boardValues[y][x+1].active){
                tempScore++;
                boardValues[y][x+1].checked = true;
                isRow = true;
                if (x+2 !== 5) {
                  if (boardValues[y][x+2].active) {
                    boardValues[y][x+2].checked = true;
                    tempScore++;
                    if (x+3 !== 5) {
                      if (boardValues[y][x+3].active) {
                        boardValues[y][x+3].checked = true;
                        tempScore++;
                        if (x+4 !== 5) {
                          if (boardValues[y][x+4].active) {
                            boardValues[y][x+4].checked = true;
                            tempScore++;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if (isRow && isColumn) {
            console.log(boardValues[y][x] + " row and col");
            tempScore++;
          }
          console.log(tempScore);
        } 
      } 
      return tempScore;
    }

    function getRoundScore(): void {
      setScore(score + calcRoundScore() - calcFloorScore());
      setRoundCount(1 + roundCount);
    }

    useEffect(() => {
      if (score < 0) {
        setScore(0);
      }
    }, [score]);

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
      setScore(score + calcRoundScore() + fiveOfAKindCheck() + fullRowCheck() + fullColumnCheck());
    }

    function fiveOfAKindCheck(): number {
      let bonusPoints = 0;

      // Blues
      if (boardValues[0][0].active && boardValues[1][1].active && boardValues[2][2].active && boardValues[3][3].active && boardValues[4][4].active) {
        bonusPoints += 10;
      }
      // Oranges
      if (boardValues[0][1].active && boardValues[1][2].active && boardValues[2][3].active && boardValues[3][4].active && boardValues[4][0].active) {
        bonusPoints += 10;
      }
      // Reds
      if (boardValues[0][2].active && boardValues[1][3].active && boardValues[2][4].active && boardValues[3][0].active && boardValues[4][1].active) {
        bonusPoints += 10;
      }
      // Blacks
      if (boardValues[0][3].active && boardValues[1][4].active && boardValues[2][0].active && boardValues[3][1].active && boardValues[4][2].active) {
        bonusPoints += 10;
      }
      // Teals
      if (boardValues[0][4].active && boardValues[1][0].active && boardValues[2][1].active && boardValues[3][2].active && boardValues[4][3].active) {
        bonusPoints += 10;
      }
      return bonusPoints;
    }

    function fullRowCheck(): number {
      let bonusPoints = 0
      if (boardValues[0][0].active && boardValues[0][1].active && boardValues[0][2].active && boardValues[0][3].active && boardValues[0][4].active) {
        bonusPoints += 2;
      }
      if (boardValues[1][0].active && boardValues[1][1].active && boardValues[1][2].active && boardValues[1][3].active && boardValues[1][4].active) {
        bonusPoints += 2;
      }
      if (boardValues[2][0].active && boardValues[2][1].active && boardValues[2][2].active && boardValues[2][3].active && boardValues[2][4].active) {
        bonusPoints += 2;
      }
      if (boardValues[3][0].active && boardValues[3][1].active && boardValues[3][2].active && boardValues[3][3].active && boardValues[3][4].active) {
        bonusPoints += 2;
      }
      if (boardValues[4][0].active && boardValues[4][1].active && boardValues[4][2].active && boardValues[4][3].active && boardValues[4][4].active) {
        bonusPoints += 2;
      }
      if (bonusPoints !== 0) {
        setCompletedRow(true);
      }
      return bonusPoints;
    }

    function fullColumnCheck(): number {
      let bonusPoints = 0;

      if (boardValues[0][0].active && boardValues[1][0].active && boardValues[2][0].active && boardValues[3][0].active && boardValues[4][0].active) {
        bonusPoints += 7;
      }
      if (boardValues[0][1].active && boardValues[1][1].active && boardValues[2][1].active && boardValues[3][1].active && boardValues[4][1].active) {
        bonusPoints += 7;
      }
      if (boardValues[0][2].active && boardValues[1][2].active && boardValues[2][2].active && boardValues[3][2].active && boardValues[4][2].active) {
        bonusPoints += 7;
      }
      if (boardValues[0][3].active && boardValues[1][3].active && boardValues[2][3].active && boardValues[3][3].active && boardValues[4][3].active) {
        bonusPoints += 7;
      }
      if (boardValues[0][4].active && boardValues[1][4].active && boardValues[2][4].active && boardValues[3][4].active && boardValues[4][4].active) {
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
            <div onClick={() => activateTile(0,0)}><Tile active={boardValues[0][0].active} color="blue"/></div>
            <div onClick={() => activateTile(0,1)}><Tile active={boardValues[0][1].active} color="orange"/></div>
            <div onClick={() => activateTile(0,2)}><Tile active={boardValues[0][2].active} color="red"/></div>
            <div onClick={() => activateTile(0,3)}><Tile active={boardValues[0][3].active} color="black"/></div>
            <div onClick={() => activateTile(0,4)}><Tile active={boardValues[0][4].active} color="teal"/></div>
          </tr>
          <tr>
            <div onClick={() => activateTile(1,0)}><Tile active={boardValues[1][0].active} color="teal"/></div>
            <div onClick={() => activateTile(1,1)}><Tile active={boardValues[1][1].active} color="blue"/></div>
            <div onClick={() => activateTile(1,2)}><Tile active={boardValues[1][2].active} color="orange"/></div>
            <div onClick={() => activateTile(1,3)}><Tile active={boardValues[1][3].active} color="red"/></div>
            <div onClick={() => activateTile(1,4)}><Tile active={boardValues[1][4].active} color="black"/></div>
          </tr>
          <tr>
            <div onClick={() => activateTile(2,0)}><Tile active={boardValues[2][0].active} color="black"/></div>
            <div onClick={() => activateTile(2,1)}><Tile active={boardValues[2][1].active} color="teal"/></div>
            <div onClick={() => activateTile(2,2)}><Tile active={boardValues[2][2].active} color="blue"/></div>
            <div onClick={() => activateTile(2,3)}><Tile active={boardValues[2][3].active} color="orange"/></div>
            <div onClick={() => activateTile(2,4)}><Tile active={boardValues[2][4].active} color="red"/></div>
          </tr>
          <tr>
            <div onClick={() => activateTile(3,0)}><Tile active={boardValues[3][0].active} color="red"/></div>
            <div onClick={() => activateTile(3,1)}><Tile active={boardValues[3][1].active} color="black"/></div>
            <div onClick={() => activateTile(3,2)}><Tile active={boardValues[3][2].active} color="teal"/></div>
            <div onClick={() => activateTile(3,3)}><Tile active={boardValues[3][3].active} color="blue"/></div>
            <div onClick={() => activateTile(3,4)}><Tile active={boardValues[3][4].active} color="orange"/></div>
          </tr>
          <tr>
            <div onClick={() => activateTile(4,0)}><Tile active={boardValues[4][0].active} color="orange"/></div>
            <div onClick={() => activateTile(4,1)}><Tile active={boardValues[4][1].active} color="red"/></div>
            <div onClick={() => activateTile(4,2)}><Tile active={boardValues[4][2].active} color="black"/></div>
            <div onClick={() => activateTile(4,3)}><Tile active={boardValues[4][3].active} color="teal"/></div>
            <div onClick={() => activateTile(4,4)}><Tile active={boardValues[4][4].active} color="blue"/></div>
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
        {!gameEnded && <h3 onClick={() => getRoundScore()} className="teal-option">End Round</h3>}
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
