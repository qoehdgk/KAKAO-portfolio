import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";
import Loader from "../../components/Loader";
import propType from "prop-types";

const MapPresenter = ({latitude, longitude }) =>
  latitude ? (
    <MapView
      style={styles.map}
      showsUserLocation={true}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.03
      }}
    />
  ) : (
    <Loader />
  );

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
});

MapPresenter.propType = {
  latitude:propType.number.isRequired,
  longitude:propType.number.isRequired
};

export default MapPresenter;
