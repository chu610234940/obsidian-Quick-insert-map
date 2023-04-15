import {
  App, 
  Modal, 
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
  WorkspaceLeaf,
  MarkdownView,
  MarkdownPostProcessorContext
} from 'obsidian';

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default'
}

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    console.log('Loading plugin');

    await this.loadSettings();

    this.addCommand({
      id: 'insert-map',
      name: 'Insert Map',
      callback: this.insertMap
    });

    this.addSettingTab(new MyPluginSettingsTab(this.app, this));

    console.log('Plugin loaded');
  }

  async onunload() {
    console.log('Unloading plugin');

    console.log('Plugin unloaded');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async insertMap() {
    const leaf = this.app.workspace.activeLeaf;
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);

    if (!leaf || !view) {
      new Notice('No markdown view available');
      return;
    }

    const editor = view.sourceMode.cmEditor;

    const cursor = editor.getCursor();
    const line = editor.getLine(cursor.line);
    const match = line.match(/^\s*-\s+(\[\[.*\]\])/);

    if (!match) {
      new Notice('No link under cursor');
      return;
    }

    const [, link] = match;

    const file = this.app.metadataCache.getFirstLinkpathDest(link, this.app.workspace.getActiveFile().path);

    if (!file) {
      new Notice('Link target not found');
      return;
    }

    const map = await this.createMap(file);

    editor.replaceRange(`\n\n<div class="map">\n\n${map}\n\n</div>\n\n`, {
      line: cursor.line + 1,
      ch: 0
    });
  }

  async createMap(file: TFile): Promise<string> {
    const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+555555(${encodeURIComponent(`${file.name}`)})/${encodeURIComponent(`${file.dir}/${file.name}`)},${encodeURIComponent(`${file.name}`)}/500x300?access_token=${this.settings.mySetting}`;

    return `![${file.name}](${mapUrl})`;
  }
}

class MyPluginSettingsTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let {containerEl} = this;

    containerEl.empty();

    containerEl.createEl('h2', {text: 'Settings for Quick Insert Map'});

    new Setting(containerEl)
      .setName('Mapbox Access Token')
      .setDesc('Enter your Mapbox access token. Get one at https://account.mapbox.com/access-tokens/')
      .addText(text => text
        .setPlaceholder('Enter access token')
        .setValue(this.plugin.settings.mySetting)
        .onChange(async (value) => {
          this.plugin.settings.mySetting = value;
          await this.plugin.saveSettings();
        }));

  }
}
