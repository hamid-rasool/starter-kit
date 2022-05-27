import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ViroARSceneNavigator } from '@viro-community/react-viro';

import MarkerIcon from '../assets/Marker.svg';
import MeasureSceneAR from './MeasureSceneAR';
import { DistanceContext } from '../context/Distance';

const ROOT = {
  backgroundColor: '#00FFFFFF',
  flex: 1,
}

const MeasureScreen = () => {
  const [isRefresh, setRefresh] = useState(false);

  const { node1Pos, node2Pos, distance } = useContext(DistanceContext);
  const childRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setRefresh(true);
    }, 500);
  });

  useEffect(() => console.log({ distance }), [distance]);

  return (
    <View style={ROOT} preset="fixed">
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => <MeasureSceneAR ref={childRef} />,
        }}
      />

      <View style={{ position: 'absolute', bottom: 370, left: 170 }}>
        <MarkerIcon width={48} height={48} />
      </View>

      {isRefresh && (
        <View style={{ position: 'absolute', bottom: 30 }}>
          <View>
            {node1Pos.length > 0 && <Text style={{ color: '#FFFFFF', fontSize: 14 }}>{node1Pos}</Text>}
            {node2Pos.length > 0 && <Text style={{ color: '#FFFFFF', fontSize: 14 }}>{node2Pos}</Text>}
            {distance && <Text style={{ color: '#FFFFFF', fontSize: 14 }}>{Math.round(distance)}cm</Text>}
          </View>

          <View style={{ left: 150 }}>
            <TouchableOpacity onPress={childRef.current.handleSceneClick}>
              <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Capture</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
};

export default MeasureScreen;
