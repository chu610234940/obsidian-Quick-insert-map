import { Plugin } from 'obsidian';
import axios from 'axios';

export default class QuickInsertMapPlugin extends Plugin {
  async onload() {
    console.log('loading plugin');

    this.addCommand({
      id: 'quick-insert-map',
      name: 'Quick Insert Map',
      callback: async () => {
        const selectedText = this.app.workspace.activeLeaf.view.sourceMode.cmEditor.getSelection();
        if (selectedText) return;

        const editor = this.app.workspace.activeLeaf.view.editor;
        const cursor = editor.getCursor();
        const line = editor.getLine(cursor.line);

        const location = await this.getLocationFromApi();

        const mapText = `![[${location.address}#${location.lng},${location.lat}]]`;

        editor.replaceRange(mapText, cursor);
      },
    });
  }

  async getLocationFromApi() {
    try {
      const response = await axios.get('https://restapi.amap.com/v3/ip', {
        params: {
          key: 'your_amap_key_here',
        },
      });

      const location = response.data?.adcode;
      if (!location) throw new Error('Failed to get location from API');

      const geoResponse = await axios.get('https://restapi.amap.com/v3/geocode/regeo', {
        params: {
          key: 'your_amap_key_here',
          location: location,
          extensions: 'all',
        },
      });

      const address = geoResponse.data?.regeocode?.formatted_address;
      const lng = geoResponse.data?.regeocode?.addressComponent?.streetNumber?.location?.split(',')[0];
      const lat = geoResponse.data?.regeocode?.addressComponent?.streetNumber?.location?.split(',')[1];

      if (!address || !lng || !lat) throw new Error('Failed to get location information from API');

      return { address, lng, lat };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get location information from API');
    }
  }

  onunload() {
    console.log('unloading plugin');
  }
}
