import React, { useState, useEffect } from "react"
import { Button, View, Dimensions, PixelRatio, StyleSheet, TextStyle, ViewStyle } from "react-native"

import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
  ViroMaterials,
  ViroBox,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroARPlane,
  ViroARPlaneSelector,
  ViroQuad,
  ViroNode,
  ViroAnimations,
} from '@viro-community/react-viro';
import { useNavigation } from "@react-navigation/core"
import { NavigationContainer } from '@react-navigation/native';

const ROOT = {
  backgroundColor: '#00FFFFFF',
  flex: 1,
}
const BOLD = { fontWeight: "bold" }
const HEADER = {
  paddingTop: 24,
  paddingBottom: 39,
  paddingHorizontal: 32,
}
const HEADER_TITLE = {
  ...BOLD,
  color: '#000',
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

ViroMaterials.createMaterials({
  grid: {
    diffuseTexture: require('./assets/grid_bg.jpg'),
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

const MeasureSceneAR = () => {
  const [initialized, setInitialized] = useState(false)
  const [text, setText] = useState('Initializing AR...')
  const [firstNodePlaced, setFirstNodePlaced] = useState(false)
  const [distance, setDistance] = useState(null)

  const arSceneRef = React.useRef(null)
  const nodeRef1 = React.useRef(null)
  const nodeRef2 = React.useRef(null)

  const _onTrackingUpdated = (state, reason) => {
    // if the state changes to "TRACKING_NORMAL" for the first time, then
    // that means the AR session has initialized!
    if (!initialized) {
      setInitialized(true);
      setText('Hello World!');
    }
  }

  const handleSceneClick = source => {
    arSceneRef.current.performARHitTestWithPoint((Dimensions.get('window').width * PixelRatio.get())/2, (Dimensions.get('window').height * PixelRatio.get())/2)
      .then((results) => { 
        for (var i = 0; i < results.length; i++) {
          let result = results[i];
          if (result.type == "ExistingPlaneUsingExtent") {
            // We hit a plane, do something!
            if(firstNodePlaced) {
              console.log('move two')

              nodeRef2.current.setNativeProps({
                position: result.transform.position,
                visible: true,
              })

              nodeRef1.current.getTransformAsync().then(transform => {
                console.log(transform.position);

                getDistance(transform.position, result.transform.position)
              })
            
            } else {
              console.log('move one')
              
              nodeRef2.current.setNativeProps({visible: false});

              nodeRef1.current.setNativeProps({
                position: result.transform.position,
                visible: true
              })

              setFirstNodePlaced(true)
            }
          }
        }
      });
  }

  const getDistance = (positionOne, positionTwo) => {
    // Compute the difference vector between the two hit locations.
    const dx = positionOne[0] - positionTwo[0];
    const dy = positionOne[1] - positionTwo[1];
    const dz = positionOne[2] - positionTwo[2];

    // // Compute the straight-line distance.
    const distanceMeters = Math.sqrt(dx*dx + dy*dy + dz*dz);

    console.log(distanceMeters*100)

    setDistance(distanceMeters*100)
  }

  const handleDrag = (dragToPos, source) => {
    nodeRef1.current.getTransformAsync().then(transform => {
      console.log(transform.position);

      getDistance(transform.position, dragToPos)
    })
  }
  
  return (
    <ViroARScene ref={arSceneRef} onTrackingUpdated={_onTrackingUpdated} onClick={handleSceneClick}>

      <ViroNode ref={nodeRef1} position={[0, 0, 0]} visible={false} onClick={() => {}}
        onDrag={()=>{}}
        dragType="FixedToWorld" 
      >
        <ViroSpotLight
          innerAngle={5}
          outerAngle={45}
          direction={[0,-1,-.2]}
          position={[0, 3, 0]}
          color="#ffffff"
          castsShadow={true}
          influenceBitMask={2}
          shadowMapSize={2048}
          shadowNearZ={2}
          shadowFarZ={5}
          shadowOpacity={.7} />

        <Viro3DObject
          source={require('./assets/emoji_smile/emoji_smile.vrx')}
          position={[0, 0, 0]}
          scale={[.025, .025, .025]}
          type="VRX"
          lightReceivingBitMask={3}
          shadowCastingBitMask={2}
          transformBehaviors={['billboardY']}
          resources={[require('./assets/emoji_smile/emoji_smile_diffuse.png'),
                      require('./assets/emoji_smile/emoji_smile_specular.png'),
                      require('./assets/emoji_smile/emoji_smile_normal.png')]}/>
      </ViroNode>

      <ViroNode ref={nodeRef2} position={[0, 0, 0]} visible={false} onClick={() => {}}
        onDrag={handleDrag}
        dragType="FixedToWorld" 
      >
        <ViroSpotLight
          innerAngle={5}
          outerAngle={45}
          direction={[0,-1,-.2]}
          position={[0, 3, 0]}
          color="#ffffff"
          castsShadow={true}
          influenceBitMask={2}
          shadowMapSize={2048}
          shadowNearZ={2}
          shadowFarZ={5}
          shadowOpacity={.7} />

        <Viro3DObject
          source={require('./assets/emoji_smile/emoji_smile.vrx')}
          position={[0, 0, 0]}
          scale={[.025, .025, .025]}
          type="VRX"
          lightReceivingBitMask={3}
          shadowCastingBitMask={2}
          transformBehaviors={['billboardY']}
          resources={[require('./assets/emoji_smile/emoji_smile_diffuse.png'),
                      require('./assets/emoji_smile/emoji_smile_specular.png'),
                      require('./assets/emoji_smile/emoji_smile_normal.png')]}/>

          <ViroText text={distance ? distance.toFixed(2) + 'cm' : ''} scale={[.1, .1, .1]} position={[0, 0, -0.05]} style={styles.helloWorldTextStyle} />
      </ViroNode>

    </ViroARScene>
  )
}

const MeasureScreen = () => {
  const [isRefresh, setRefresh] = useState(true);

  const navigation = useNavigation()
  const goBack = () => navigation.goBack()

  const refreshApp = () => {
    setRefresh(false);
    setTimeout(() => {
      setRefresh(true);
    }, 1000);
  };

  return (
    <View style={ROOT} preset="fixed">
      <Button title="Refresh" onPress={refreshApp} />
      {/* <Header
        headerText="Measure"
        leftIcon="back"
        onLeftPress={goBack}
        style={HEADER}
        titleStyle={HEADER_TITLE}
      /> */}

      {isRefresh && (
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{
            scene: MeasureSceneAR,
          }}
        />
      )}
    </View>
  )
};

export const App = () => {
  return (
    <NavigationContainer>
      <MeasureScreen />
    </NavigationContainer>
  );
};
