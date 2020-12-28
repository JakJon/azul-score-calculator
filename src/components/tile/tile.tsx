import React, { useEffect, useState } from "react";
import "./tile.scss";

interface TileProps {
  color: string;
  active: boolean;
}

const Tile = (tileProps: TileProps) => {
  const [placed, setPlaced] = useState(tileProps.active);

  return (
    <td
      className={
        placed
          ? "active " + tileProps.color
          : "inactive " + tileProps.color }
      onClick={() => setPlaced(!placed)}>
    </td>
  );
};

export default Tile;
