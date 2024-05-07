import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';

const App = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      getCurrentLocation();
    }, 2000);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (currentLocation) {
      getUsersLocations();
    }
  }, [currentLocation]);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(position => {
      var current = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      console.log(current);
      setCurrentLocation(current);
    });
  };
  const getUsersLocations = () => {
    const locations = [
      {latitude: 37.680642, longitude: -122.42462},
      {latitude: 37.458343, longitude: -122.167887},
      {latitude: 37.758437, longitude: -122.448385},
    ];

    locations.sort((a, b) => findDistance(a) - findDistance(b));

    setUsers(locations);
  };
  const findDistance = dot => {
    const R = 6371; // Yerküre yarıçapı (km)
    const dLat = ((dot.latitude - currentLocation.latitude) * Math.PI) / 180;
    const dLon = ((dot.longitude - currentLocation.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((currentLocation.latitude * Math.PI) / 180) *
        Math.cos((dot.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  return (
    <MapView
      style={styles.container}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 10,
        longitudeDelta: 10,
      }}
      region={currentLocation}>
      <Marker
        coordinate={currentLocation}
        title={'Me'}
        description={'marker.description'}
        pinColor="blue"
      />
      {users.map((user, index) => (
        <Marker
          titleVisibility="visible"
          key={index}
          coordinate={user}
          title={'User'}
          description={'marker.description'}
        />
      ))}
      {users.map((_, index) => {
        return (
          <MapViewDirections
            key={index}
            origin={index === 0 ? currentLocation : users[index - 1]}
            destination={users[index]}
            strokeColor={index % 2 === 0 ? '#000000' : '#FF0000'}
            strokeWidth={3}
            apikey="" // Your Google Maps API Key
          />
        );
      })}
    </MapView>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1},
});

export default App;
