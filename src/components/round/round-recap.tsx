import React, { useEffect, useState } from "react";
import Round from "../../models/round.interface";
import "./round-recap.scss";

interface RoundRecapProps {
  round: Round;
}

const RoundRecap = (roundRecapProps: RoundRecapProps) => {
  return (
    <li>
      <h4>
        Round {roundRecapProps.round.roundNumber} Score:{" "}
        {roundRecapProps.round.individualTiles +
          roundRecapProps.round.columnTiles +
          roundRecapProps.round.rowTiles}
      </h4>
      <h5>
        Row Tiles: {roundRecapProps.round.rowTiles} Column Tiles: {roundRecapProps.round.columnTiles}{" "}
        Individual Tiles: {roundRecapProps.round.individualTiles}
      </h5>
    </li>
  );
};

export default RoundRecap;
