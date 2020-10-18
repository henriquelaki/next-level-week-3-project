import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { Marker, MapEvent } from 'react-native-maps';

import mapMarkerImg from '../../images/map-marker.png';
import { getCurrentPositionAsync, LocationAccuracy, requestPermissionsAsync } from 'expo-location';

export default function SelectMapPosition() {

  const [ initialLatitude, setInitialLatitude] = useState(-12.802236)
  const [ initialLongitude, setInitialLongitude] = useState(-51.242180)
  const [ initialDeltaLatitude, setInitialDeltaLatitude] = useState(50)

  const navigation = useNavigation();

  const [ position, setPosition ] = useState({
    latitude: 0,
    longitude: 0,
  })

  function handleNextStep() {
    navigation.navigate('OrphanageData', { position });
  }

  function handleSelectMapPosition(e: MapEvent) {
    setPosition(e.nativeEvent.coordinate)
  }

  const handleInitialPosition = async () => {
    const { granted } = await requestPermissionsAsync();

    if(granted) {
      const { coords } = await getCurrentPositionAsync({
        accuracy: LocationAccuracy.Balanced
      })
      setInitialLatitude(coords.latitude)
      setInitialLongitude(coords.longitude)
      setInitialDeltaLatitude(0.25)

    }
  }
  handleInitialPosition()

  return (
    <View style={styles.container}>
      <MapView 
        region={{
          latitude: initialLatitude,
          longitude: initialLongitude,
          latitudeDelta: initialDeltaLatitude,
          longitudeDelta: 0.3
        }}
        style={styles.mapStyle}
        onPress={handleSelectMapPosition}
      >
        { position.latitude !== 0 && (
                  <Marker 
                  icon={mapMarkerImg}
                  coordinate={{ latitude: position.latitude, longitude: position.longitude }}
                />
        ) }
      </MapView>

     { position.latitude !== 0 && (
             <RectButton style={styles.nextButton} onPress={handleNextStep}>
             <Text style={styles.nextButtonText}>Próximo</Text>
           </RectButton>
     )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,

    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  }
})