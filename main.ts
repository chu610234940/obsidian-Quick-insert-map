import { App, PluginSettingTab, Setting } from 'obsidian';
import L from 'leaflet';
import { QuickInsertMapSettings } from './settings';

export default class QuickInsertMapPlugin extends Plugin {
  settings: QuickInsertMapSettings;

  async onload() {
    console.log('loading plugin');

    // Load saved settings
    this.settings = Object.assign(new QuickInsertMapSettings(), await this.loadSettings());

    // Add a settings tab
    this.addSettingTab(new QuickInsertMapSettingTab(this.app, this));

    // Register the command to insert map
    this.addCommand({
      id: 'insert-map',
      name: 'Insert Map',
      callback: () => this.insertMap(),
    });
  }

  onunload() {
    console.log('unloading plugin');

    // Save current settings
    this.saveSettings(this.settings);
  }

  async insertMap() {
    // Get current editor
    const editor = this.app.workspace.getActiveTextEditor();

    if (editor) {
      // Create a new div element
      const div = document.createElement('div');
      div.style.width = '100%';
      div.style.height = '400px';
      editor.el.appendChild(div);

      // Create a new map instance
      const map = L.map(div).setView([0, 0], 13);

      // Add a tile layer
      const url = `https://restapi.amap.com/v3/staticmap?key=${this.settings.apiKey}&location=0,0&zoom=13&size=400*400&markers=mid,,0:0`;
      const layer = L.tileLayer(url);
      map.addLayer(layer);
    }
  }
}

class QuickInsertMapSettingTab extends PluginSettingTab {
  plugin: QuickInsertMapPlugin;

  constructor(app: App, plugin: QuickInsertMapPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();
    containerEl.createEl('h2', { text: 'Quick Insert Map Settings' });

    new Setting(containerEl)
      .setName('高德地图 API Key')
      .setDesc('请填写您申请的高德地图 API Key。')
      .addText((text) =>
        text
          .setPlaceholder('请输入 API Key')
          .setValue(this.plugin.settings.apiKey)
          .onChange(async (value) => {
            this.plugin.settings.apiKey = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
