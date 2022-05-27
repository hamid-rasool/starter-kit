import React, { createContext, useState } from 'react';

export const DistanceContext = createContext({
  distance: null,
  node1Pos: [],
  node2Pos: [],
  firstNodePlaced: false,
  setFirstNodePlaced: (firstNodePlaced) => {},
  setNode1Pos: (node1Pos) => {},
  setNode2Pos: (node2Pos) => {},
  getDistance: (positionOne, positionTwo) => {},
});

const DistanceProvider = ({ children }) => {
  const [distance, setDistance] = useState(null);
  const [node1Pos, setNode1Pos] = useState([]);
  const [node2Pos, setNode2Pos] = useState([]);
  const [firstNodePlaced, setFirstNodePlaced] = useState(false);

  const getDistance = (positionOne, positionTwo) => {
    // Compute the difference vector between the two hit locations.
    const dx = positionOne[0] - positionTwo[0];
    const dy = positionOne[1] - positionTwo[1];
    const dz = positionOne[2] - positionTwo[2];

    // Compute the straight-line distance.
    const distanceMeters = Math.sqrt(dx*dx + dy*dy + dz*dz);
    setDistance(distanceMeters*100);
  }

  return (
    <DistanceContext.Provider value={{
      distance, getDistance,
      node1Pos, setNode1Pos,
      node2Pos, setNode2Pos,
      firstNodePlaced, setFirstNodePlaced,
    }}>
      {children}
    </DistanceContext.Provider>
  );
};

export default DistanceProvider;
