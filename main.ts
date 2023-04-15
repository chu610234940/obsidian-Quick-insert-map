import * as obsidian from 'obsidian';
import * as L from 'leaflet';

class MapView extends obsidian.VueComponent {
    leafletMap: L.Map;

    constructor(app: obsidian.App, private containerEl: HTMLElement) {
        super(app);

        const mapEl = this.containerEl.createEl('div', { cls: 'my-plugin-map' });
        this.leafletMap = L.map(mapEl).setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        }).addTo(this.leafletMap);
    }

    getMapView(): HTMLElement {
        return this.containerEl;
    }
}

export default class MyPlugin extends obsidian.Plugin {
    async onload() {
        console.log('loading Quick insert map plugin');

        this.addCommand({
            id: 'open-quick-insert-map',
            name: 'Quick insert map',
            callback: () => {
                let activeLeaf = this.app.workspace.activeLeaf;
                if (activeLeaf) {
                    let containerEl = activeLeaf.view.containerEl;
                    let map = new MapView(this.app, containerEl);
                }
            },
        });
    }

    onunload() {
        console.log('unloading Quick insert map plugin');
    }
}
