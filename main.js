console.log("Quick insert map plugin is activated");
import { MapView } from "./main";

import { Plugin } from 'obsidian';

export default class QuickInsertMapPlugin extends Plugin {
  async onload() {
    console.log('loading Quick insert map plugin');
    this.addCommand({
      id: 'Quick Insert Map',
      name: 'Quick Insert Map',
      callback: () => {
        const view = new MapView(this.app, this);
        view.open();
      },
    });
  }

  onunload() {
    console.log('unloading Quick insert map plugin');
  }
}

import { Plugin } from 'obsidian';
import { MapView } from "./main";

export default class MyPlugin extends Plugin {

// Import the necessary classes and interfaces from the Obsidian API
import { Plugin } from 'obsidian';
import type { App, TFile } from 'obsidian';

// Import the necessary interfaces from the Leaflet and AMap libraries
import type { LatLngExpression } from 'leaflet';
import type { Map, LngLat } from 'AMap';

// Define the class of the plugin
export default class QuickInsertMapPlugin extends Plugin {
  // Define the map element and map instance as class properties
  private mapEl: HTMLElement;
  private map: Map;

  // Define the AMap API key as a class property, which can be set by the user in the plugin settings
  private apiKey: string;

  // Define a flag to indicate whether the AMap script has finished loading
  private amapLoaded: boolean = false;

  // Define the method to load the AMap script
  private loadAMap(): Promise<void> {
    // Create a Promise that resolves when the AMap script has finished loading
    return new Promise((resolve) => {
      // Check whether the AMap script has already been loaded
      if (this.amapLoaded) {
        resolve();
        return;
      }

      // Create a script element for the AMap script
      const script = document.createElement('script');
      script.src = `https://webapi.amap.com/maps?v=1.4.15&key=${this.apiKey}&plugin=AMap.Geocoder`;
      script.async = true;

      // Define the function to run when the AMap script has finished loading
      script.onload = () => {
        this.amapLoaded = true;
        resolve();
      };

      // Append the script element to the document body
      document.body.appendChild(script);
    });
  }

  // Define the method to create the map element and append it to the note editor
  private createMap(): void {
    // Get the note editor element
    const editor = this.app.workspace.activeLeaf.view.editor;

    // Create the map element
    this.mapEl = document.createElement('div');
    this.mapEl.style.width = '100%';
    this.mapEl.style.height = '300px';

    // Append the map element to the note editor
    editor.cmWrapper.parentElement.appendChild(this.mapEl);

    // Load the AMap script
    this.loadAMap().then(() => {
      // Create the AMap instance
      this.map = new AMap.Map(this.mapEl, {
        zoom: 13,
        resizeEnable: true,
        center: [116.397428, 39.90923],
      });
    });
  }

  // Define the method to add a marker to the map
  private addMarker(lngLat: LngLat): void {
    // Create a marker
    const marker = new AMap.Marker({
      position: lngLat,
    });

    // Add the marker to the map
    marker.setMap(this.map);
  }

  // Define the method to pan the map to a specified location
  private panTo(lngLat: LngLat): void {
    // Pan the map to the specified location
    this.map.panTo(lngLat);
  }
}
class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false };
    this.loadMapSdk = this.loadMapSdk.bind(this);
  }

  componentDidMount() {
    if (window.AMap) {
      this.setState({ loaded: true });
      return;
    }
    this.loadMapSdk();
  }

  async loadMapSdk() {
    const url = `https://webapi.amap.com/maps?v=1.4.15&key=${this.props.apiKey}&callback=onLoadMapSdk`;
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.onerror = reject;
      window.onLoadMapSdk = () => {
        this.setState({ loaded: true });
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  render() {
    const { loaded } = this.state;
    const { lat, lng, zoom } = this.props;
    if (!loaded) {
      return <div>Loading Map SDK...</div>;
    }
    return (
      <div style={{ height: "calc(100vh - 45px)", width: "100%" }}>
        <div id="map" style={{ height: "100%", width: "100%" }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                  const map = new AMap.Map('map', {
                    center: [${lng},${lat}],
                    zoom: ${zoom},
                  });
                  const marker = new AMap.Marker({
                    position: new AMap.LngLat(${lng},${lat}),
                  });
                  marker.setMap(map);
                `,
          }}
        ></script>
      </div>
    );
  }
}
export default class QuickInsertMapPlugin extends Plugin {
  async onload() {
    console.log("loading plugin");
    await this.loadSettings();

    this.addCommand({
      id: "quick-insert-map",
      name: "Quick Insert Map",
      callback: () => {
        new Notice("Inserting map...");
        const editor = this.app.workspace.activeLeaf.view.editor;
        const position = editor.getCursor();
        const { lat, lng, zoom } = this.settings;
        const mapView = React.createElement(MapView, {
          apiKey: this.settings.apiKey,
          lat,
          lng,
          zoom,
        });
        ReactDOM.render(mapView, editor.containerEl);
      },
    });
  }

  onunload() {
    console.log("unloading plugin");
    ReactDOM.unmountComponentAtNode(this.app.workspace.activeLeaf.view.editor.containerEl);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  async componentDidMount() {
    await this.loadMapScript();
    const map = new AMap.Map("map-container", {
      center: [this.props.lng, this.props.lat],
      zoom: this.props.zoom,
    });
    new AMap.Marker({
      position: [this.props.lng, this.props.lat],
      map: map,
    });
    this.setState({ loading: false });
  }

  async loadMapScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://webapi.amap.com/maps?v=1.4.15&key=${this.props.apiKey}&callback=initMap`;
      script.async = true;
      script.onerror = reject;
      window.initMap = () => {
        resolve();
        delete window.initMap;
      };
      document.head.appendChild(script);
    });
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="map-view">
        {loading ? (
          <div className="map-loading">Loading map...</div>
        ) : (
          <div id="map-container" className="map-container" />
        )}
      </div>
    );
  }
}
}
