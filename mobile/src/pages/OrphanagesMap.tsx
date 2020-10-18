import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE  } from 'react-native-maps';
import { Feather} from '@expo/vector-icons'
import mapMarker from '../images/map-marker.png'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { requestPermissionsAsync, getCurrentPositionAsync, LocationAccuracy }  from 'expo-location'
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface OrphanageItem {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
}

export default function OrphanagesMap() {


    const [ initialLatitude, setInitialLatitude] = useState(-12.802236)
    const [ initialLongitude, setInitialLongitude] = useState(-51.242180)
    const [ initialDeltaLatitude, setInitialDeltaLatitude] = useState(50)


    const [ orphanages, setOrphanages ] = useState<OrphanageItem[]>([])

    const navigation = useNavigation()


    useFocusEffect(
      useCallback( () => {
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
        const findOrphanages =  api.get('orphanages')
        .then(response => {setOrphanages(response.data)})
      },[initialLatitude])
    )
    function handleNavigateToOrphanageDetails(id: number) {
        navigation.navigate('OrphanageDetails', { id })
    }

    function handleNavigateToCreateOrphanage() {
        navigation.navigate('SelectMapPosition')
    }
    return (
        <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: initialLatitude,
            longitude: initialLongitude,
            latitudeDelta: initialDeltaLatitude,
            longitudeDelta: 0.25
          }}
        >
          { orphanages.map(orphanage => {
            return(
              <Marker
              key={orphanage.id}
              icon={mapMarker}
              calloutAnchor={{
                x: 2.6,
                y: 0.8,
              }}
              coordinate={{
                latitude: orphanage.latitude,
                longitude: orphanage.longitude,
              }}>

                <Callout tooltip onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}>
                  <View style={styles.calloutContainer}              >
            <Text style={styles.calloutText}>{orphanage.name}</Text>
                  </View>
                </Callout>
              </Marker>
            )
          })}

       </MapView>
       <View style={styles.footer}>
            <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>

            <RectButton
              style={styles.createOrphanageButton}
              onPress={handleNavigateToCreateOrphanage}
            >
              <Feather name="plus" size={20} color="#FFF" />
            </RectButton>
       </View>
      </View>
    )


}

const styles = StyleSheet.create(
    {
        container: {
          flex: 1
        },
        map: {
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
        },
        calloutContainer: {
          width: 160,
          height: 46,
          paddingHorizontal: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 16,
          justifyContent: 'center',

        },
        calloutText: {
          color: '#0089a5',
          fontSize: 14,
          fontFamily: 'Nunito_700Bold'
        },

        footer: {
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: 32,

          backgroundColor: '#FFF',
          borderRadius: 20,
          height: 56,
          paddingLeft: 24,

          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',

          elevation: 3,
        },

        footerText: {
          color: "#8fa7b3",
          fontFamily: 'Nunito_700Bold'
        },

        createOrphanageButton: {
            width: 56,
            height: 56,
            backgroundColor: '#15c3d6',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center'
        },
    }
      );