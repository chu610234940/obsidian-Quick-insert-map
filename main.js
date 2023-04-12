const { Plugin } = require('obsidian');
const AMapLoader = require('@amap/amap-jsapi-loader');

class LocationPlugin extends Plugin {
  async onload() {
    console.log('Loading location plugin');

    this.addCommand({
      id: 'insert-location',
      name: 'Insert Location',
      callback: () => {
        this.openLocationSelector();
      },
    });

    await this.loadMap();
  }

  async loadMap() {
    const AMap = await AMapLoader.load({
      key: 'your amap api key',
      version: '2.0',
      plugins: [],
    });

    this.AMap = AMap;
  }

  async openLocationSelector() {
    const mapContainer = this.createMapContainer();
    const map = new this.AMap.Map(mapContainer, {
      zoom: 13,
    });

    const marker = new this.AMap.Marker({
      map: map,
      position: map.getCenter(),
    });

    const infoWindow = new this.AMap.InfoWindow({
      content: '<div>选择位置</div>',
      offset: new this.AMap.Pixel(0, -20),
    });
    infoWindow.open(map, marker.getPosition());

    this.registerMarkerEvents(marker, infoWindow, map);

    const selectedPosition = await new Promise((resolve) => {
      marker.on('dragend', (event) => {
        const { lng, lat } = event.lnglat;
        resolve({ lng, lat });
      });
    });

    this.insertLocation(selectedPosition);
  }

  createMapContainer() {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.zIndex = '9999';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';

    document.body.appendChild(container);

    return container;
  }

  registerMarkerEvents(marker, infoWindow, map) {
    marker.on('click', () => {
      infoWindow.open(map, marker.getPosition());
    });

    marker.on('dragstart', () => {
      infoWindow.close();
    });

    marker.on('dragging', (event) => {
      const { lng, lat } = event.lnglat;
      infoWindow.setContent(`<div>${lng.toFixed(4)},
      ${lat.toFixed(4)}</div>`);
    });
}

async insertLocation(position) {
const { lng, lat } = position;
const url = `https://restapi.amap.com/v3/staticmap?location=${lng},${lat}&zoom=15&size=800*600&markers=mid,,A:${lng},${lat}&key=your amap api key`;

const locationMarkdown = `![${lng.toFixed(4)},${lat.toFixed(4)}](${url})`;

const activeLeaf = this.app.workspace.getActiveLeaf();
await activeLeaf.insertText(locationMarkdown);
 }
}

module.exports = LocationPlugin;