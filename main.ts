import { Plugin } from 'obsidian';
import { MapView } from './mapView';

export default class QuickInsertMapPlugin extends Plugin {
  private apiKey: string;

  async onload() {
    console.log('loading QuickInsertMapPlugin');

    // Read user's API Key from settings
    this.apiKey = this.settings.displayed.apiKey;

    // Add command to insert map
    this.addCommand({
      id: 'insert-map',
      name: 'Insert Map',
      callback: () => {
        const map = new MapView(this.apiKey);
        map.insertMap();
      }
    });
  }
}
