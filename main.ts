import { App, Plugin, PluginSettingTab, Setting, MarkdownView } from 'obsidian';
import { MapView } from './main';

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
    id: 'insert-map',
    name: 'Insert Map',
    callback: () => {
        this.insertMapView();
    },
    hotkeys: [
        {
            modifiers: ['Mod'],
            key: 'm',
        },
    ],
});

    }

    onunload() {
        console.log('unloading Quick insert map plugin');
    }
}
