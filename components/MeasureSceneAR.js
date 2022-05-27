import React, { useRef, useState, forwardRef, useImperativeHandle, useContext } from 'react';
import { Dimensions, PixelRatio } from 'react-native';
import {
  ViroARScene,
  ViroMaterials,
  ViroNode,
  ViroAnimations,
  ViroPolyline,
  ViroImage,
} from '@viro-community/react-viro';

import { DistanceContext } from '../context/Distance';

ViroMaterials.createMaterials({
  grid: {
    diffuseTexture: require('../assets/grid_bg.jpg'),
  },
  red: {
    diffuseColor: "#FF0000",
  },
});

ViroAnimations.registerAnimations({
  rotate: {
    properties: {
      rotateY: "+=90"
    },
    duration: 250, //.25 seconds
  },
});

const MeasureSceneAR = forwardRef((_props, ref) => {
  const [initialized, setInitialized] = useState(false);

  const {
    node1Pos, node2Pos, firstNodePlaced,
    setFirstNodePlaced, getDistance, setNode1Pos, setNode2Pos
  } = useContext(DistanceContext);
  const arSceneRef = useRef(null);
  const nodeRef1 = useRef(null);
  const nodeRef2 = useRef(null);

  const _onTrackingUpdated = (_state, _reason) => {
    if (!initialized) {
      setInitialized(true);
    }
  };

  useImperativeHandle(ref, () => ({
    handleSceneClick: () => {
      arSceneRef.current
        .performARHitTestWithPoint(
          (Dimensions.get('window').width * PixelRatio.get())/2,
          (Dimensions.get('window').height * PixelRatio.get())/2,
        ).then((results) => {
          console.log({ results });

          for (let i = 0; i < results.length; i++) {
            const result = results[i];

            if (result.type === 'ExistingPlaneUsingExtent') {
              if (!firstNodePlaced) {
                nodeRef2.current.setNativeProps({visible: false});
                nodeRef1.current.setNativeProps({
                  position: result.transform.position,
                  visible: true,
                });

                setNode1Pos(result.transform.position);
                setFirstNodePlaced(true);
              } else {
                nodeRef2.current.setNativeProps({
                  position: result.transform.position,
                  visible: true,
                });
                setNode2Pos(result.transform.position);

                nodeRef1.current.getTransformAsync().then(transform => {
                  getDistance(transform.position, result.transform.position)
                })
              }
              break;
            }
          }
        });
    },
  }));

  return (
    <ViroARScene ref={arSceneRef} onTrackingUpdated={_onTrackingUpdated}>
      <ViroNode ref={nodeRef1} position={[0, 0, 0]} visible={false} onClick={() => {}}>
        <ViroImage
          width={0.007}
          height={0.007}
          position={[0, 0, 0]}
          source={require('../assets/point.png')}
        />
      </ViroNode>

      <ViroNode ref={nodeRef2} position={[0, 0, 0]} visible={false} onClick={() => {}}>
         <ViroImage
          width={0.007}
          height={0.007}
          position={[0, 0, 0]}
          source={require('../assets/point.png')}
        />
      </ViroNode>

      {node1Pos.length > 0 && node2Pos.length > 0 && (
        <ViroPolyline
          position={[0, 0, 0]}
          points={[
            node1Pos,
            node2Pos,
          ]}
          dragType="FixedToWorld"
          thickness={0.002}
          materials={"red"}
        />
      )}
    </ViroARScene>
  );
});

export default MeasureSceneAR;
