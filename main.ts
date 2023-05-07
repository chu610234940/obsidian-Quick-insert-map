import {
  Plugin,
  PluginSettingTab,
  App,
  Setting,
  MarkdownView,
  TFile,
  Modal,
} from "obsidian";

class InsertMapModal extends Modal {
  constructor(app: App, content: string) {
    super(app);
    this.contentEl.createEl("iframe", {
      attr: {
        srcdoc: content,
        width: "100%",
        height: "100%",
      },
    });
  }
}

interface InsertMapSettings {
  defaultMapProvider: string;
  googleMapsApiKey: string;
}

const DEFAULT_SETTINGS: InsertMapSettings = {
  defaultMapProvider: "gaode",
  googleMapsApiKey: "",
};

export default class InsertMapPlugin extends Plugin {
  settings: InsertMapSettings;

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new InsertMapSettingTab(this.app, this));

    this.addCommand({
      id: "insert-map",
      name: "插入地图",
      callback: () => this.insertMap(),
    });
  }

  async insertMap() {
    let iframeContent = "";

    switch (this.settings.defaultMapProvider) {
      case "google":
        iframeContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>简单地图</title>
              <script
                src="https://maps.googleapis.com/maps/api/js?key=${this.settings.googleMapsApiKey}"
                async
                defer
              ></script>
              <script>
                var map;
                function initMap() {
                  map = new google.maps.Map(document.getElementById("map"), {
                    center: { lat: -34.397, lng: 150.644 },
                    zoom: 8
                  });
                }
              </script>
            </head>
            <body onload="initMap()">
              <div id="map" style="height: 100%; width: 100%;"></div>
            </body>
          </html>`;
        break;
      case "osm":
        iframeContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>简单地图</title>
              <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                crossorigin=""
              />
              <script
                src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
                integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
                crossorigin=""
              ></script>
            </head>
            <body>
              <div id="map" style="height: 100%; width: 100%;"></div>
              <script>
                var map = L.map("map").setView([-34.397, 150.644], 13);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                  maxZoom: 19
                }).addTo(map);
              </script>
            </body>
          </html>`;
        break;
      case "gaode":
        iframeContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>简单地图</title>
              <script src="https://webapi.amap.com/maps?v=1.4.15&key=您的高德地图API密钥"></script>
              <script>
                var map;
                function initMap() {
                  map = new AMap.Map("map", {
                    center: [150.644, -34.397],
                    zoom: 8
                  });
                }
              </script>
            </head>
            <body onload="initMap()">
              <div id="map" style="height: 100%; width: 100%;"></div>
            </body>
          </html>`;
        break;
      case "baidu":
        iframeContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>简单地图</title>
              <script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=您的百度地图API密钥"></script>
              <script>
                var map;
                function initMap() {
                  map = new BMap.Map("map");
                  map.centerAndZoom(new BMap.Point(150.644, -34.397), 8);
                }
              </script>
            </head>
            <body onload="initMap()">
              <div id="map" style="height: 100%; width: 100%;"></div>
            </body>
          </html>`;
        break;
      case "tencent":
        iframeContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>简单地图</title>
              <script charset="utf-8" src="https://map.qq.com/api/js?v=2.exp&key=您的腾讯地图API密钥"></script>
              <script>
                var map;
                function initMap() {
                  map = new qq.maps.Map(document.getElementById("map"), {
                    center: new qq.maps.LatLng(-34.397, 150.644),
                    zoom: 8
                  });
                }
              </script>
            </head>
            <body onload="initMap()">
              <div id="map" style="height: 100%; width: 100%;"></div>
            </body>
          </html>`;
        break;
    }

    const modal = new InsertMapModal(this.app, iframeContent);
    modal.open();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class InsertMapSettingTab extends PluginSettingTab {
  plugin: InsertMapPlugin;

  constructor(app: App, plugin: InsertMapPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();
    containerEl.createEl("h2", { text: "插入地图插件设置" });

    new Setting(containerEl)
      .setName("默认地图提供商")
      .setDesc("选择默认地图提供商")
      .addDropdown((dropdown) => {
        dropdown
          .addOption("google", "谷歌地图")
          .addOption("osm", "OpenStreetMap")
          .addOption("gaode", "高德地图")
          .addOption("baidu", "百度地图")
          .addOption("tencent", "腾讯地图")
          .setValue(this.plugin.settings.defaultMapProvider)
          .onChange(async (value) => {
            this.plugin.settings.defaultMapProvider = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("谷歌地图API密钥")
      .setDesc("输入您的谷歌地图JavaScript API密钥")
      .addText((text) => {
        text
          .setPlaceholder("在此处输入您的API密钥")
          .setValue(this.plugin.settings.googleMapsApiKey)
          .onChange(async (value) => {
            this.plugin.settings.googleMapsApiKey = value;
            await this.plugin.saveSettings();
          });
      });
  }
}
