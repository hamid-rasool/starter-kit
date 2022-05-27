import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import DistanceProvider from './context/Distance';
import MeasureScreen from './components/MeasureScreen';

export const App = () => {
  return (
    <NavigationContainer>
      <DistanceProvider>
        <MeasureScreen />
      </DistanceProvider>
    </NavigationContainer>
  );
};
