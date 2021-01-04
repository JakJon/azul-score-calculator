import React, { useEffect, useState } from "react";
import "./tile.scss";

interface TileProps {
  color: string;
  active: boolean;
  roundPlaced: number;
  currentRound: number;
}

const Tile = (tileProps: TileProps) => {
  const [placed, setPlaced] = useState(tileProps.active);
  const [className, setClassName] = useState("inactive ")

  useEffect(() => {

    console.log(tileProps.active + " " + tileProps.currentRound + " " + tileProps.roundPlaced);
  }, [tileProps.active, tileProps.roundPlaced, tileProps.currentRound]);

  return (
    <td
      className=
      {
        placed
          ? tileProps.roundPlaced === tileProps.currentRound
            ? "current active " + tileProps.color
            : "active " + tileProps.color
          : "inactive " + tileProps.color
      }
      onClick={() => setPlaced(!placed)}
    ></td>
  );
};

export default Tile;
