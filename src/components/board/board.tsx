import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./board.scss";
import { threadId } from "worker_threads";
import { render } from "@testing-library/react";
import Tile from "../tile/tile";


const Board = () => {
    const [boardValues, setBoardValues] = useState<boolean[][]>(createEmptyBoard());

    function createEmptyBoard(): boolean[][] {
        let board: boolean[][] = []

        for (let y = 0; y < 5; y++) {
            board![y] = [];
            for (let x = 0; x < 5; x++) {
                board![y][x] = false;
            }
        }
        console.log("hit");
        return board;
    }

    function activateTile(y: number, x: number): void {
        let board = boardValues;
        board[y][x] = !board[y][x];
        setBoardValues(board);
        console.log(boardValues);
    }


    
  return (
    <div className="board-container">
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
    </div>
  );
}

export default Board;
