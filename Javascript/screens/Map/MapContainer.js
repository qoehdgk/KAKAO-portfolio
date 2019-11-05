import React from "react";
import MapPresenter from "./MapPresenter";
export default class MapContainer extends React.Component {
  state = {
    latitude: null,
    longitude: null
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) =>
        this.setState({ latitude, longitude }),
      error => console.log(error)
    );
  }

  render() {
    const { latitude, longitude } = this.state;
    return <MapPresenter latitude={latitude} longitude={longitude} />;
  }
}
