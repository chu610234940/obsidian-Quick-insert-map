"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var obsidian_1 = require("obsidian");
var InsertMapModal = /** @class */ (function (_super) {
    __extends(InsertMapModal, _super);
    function InsertMapModal(app, content) {
        var _this = _super.call(this, app) || this;
        _this.contentEl.createEl("webview", {
            attr: {
                srcdoc: content,
                width: "100%",
                height: "100%",
            },
        });
        return _this;
    }
    return InsertMapModal;
}(obsidian_1.Modal));
var DEFAULT_SETTINGS = {
    defaultMapProvider: "gaode",
    googleMapsApiKey: "",
};
var InsertMapPlugin = /** @class */ (function (_super) {
    __extends(InsertMapPlugin, _super);
    function InsertMapPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InsertMapPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.addSettingTab(new InsertMapSettingTab(this.app, this));
                        this.addCommand({
                            id: "insert-map",
                            name: "插入地图",
                            callback: function () { return _this.insertMap(); },
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    InsertMapPlugin.prototype.insertMap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var iframeContent, lat, lng, modal;
            return __generator(this, function (_a) {
                iframeContent = "";
                lat = 30.288136095096124;
                lng = 120.34755029516998;
                switch (this.settings.defaultMapProvider) {
                    case "google":
                        iframeContent = "\n          <!DOCTYPE html>\n          <html>\n            <head>\n              <title>\u7B80\u5355\u5730\u56FE</title>\n              <script\n                src=\"https://maps.googleapis.com/maps/api/js?key=".concat(this.settings.googleMapsApiKey, "\"\n                async\n                defer\n              ></script>\n              <script>\n                var map;\n                function initMap() {\n                  map = new google.maps.Map(document.getElementById(\"map\"), {\n                    center: { lat: ").concat(lat, ", lng: ").concat(lng, " },\n                    zoom: 8\n                  });\n                }\n              </script>\n            </head>\n            <body onload=\"initMap()\">\n              <div id=\"map\" style=\"height: 100%; width: 100%;\"></div>\n            </body>\n          </html>");
                        break;
                    case "osm":
                        iframeContent = "\n          <!DOCTYPE html>\n          <html>\n            <head>\n              <title>\u7B80\u5355\u5730\u56FE</title>\n              <link\n                rel=\"stylesheet\"\n                href=\"https://unpkg.com/leaflet@1.7.1/dist/leaflet.css\"\n                integrity=\"sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==\"\n                crossorigin=\"\"\n              />\n              <script\n                src=\"https://unpkg.com/leaflet@1.7.1/dist/leaflet.js\"\n                integrity=\"sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==\"\n                crossorigin=\"\"\n              ></script>\n            </head>\n            <body>\n              <div id=\"map\" style=\"height: 100%; width: 100%;\"></div>\n              <script>\n                var map = L.map(\"map\").setView([".concat(lat, ", ").concat(lng, "], 13);\n                L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\n                  attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\n                  maxZoom: 19\n                }).addTo(map);\n              </script>\n            </body>\n          </html>");
                        break;
                    case "gaode":
                        iframeContent = "\n          <!DOCTYPE html>\n          <html>\n            <head>\n              <title>\u7B80\u5355\u5730\u56FE</title>\n              <script src=\"https://webapi.amap.com/maps?v=1.4.15&key=\u60A8\u7684\u9AD8\u5FB7\u5730\u56FEAPI\u5BC6\u94A5\"></script>\n              <script>\n                var map;\n                function initMap() {\n                  map = new AMap.Map(\"map\", {\n                    center: [".concat(lng, ", ").concat(lat, "],\n                    zoom: 8\n                  });\n                }\n              </script>\n            </head>\n            <body onload=\"initMap()\">\n              <div id=\"map\" style=\"height: 100%; width: 100%;\"></div>\n            </body>\n          </html>");
                        break;
                    case "baidu":
                        iframeContent = "\n          <!DOCTYPE html>\n          <html>\n            <head>\n              <title>\u7B80\u5355\u5730\u56FE</title>\n              <script type=\"text/javascript\" src=\"https://api.map.baidu.com/api?v=2.0&ak=\u60A8\u7684\u767E\u5EA6\u5730\u56FEAPI\u5BC6\u94A5\"></script>\n              <script>\n                var map;\n                function initMap() {\n                  map = new BMap.Map(\"map\");\n                  map.centerAndZoom(new BMap.Point(".concat(lng, ", ").concat(lat, "), 8);\n                }\n              </script>\n            </head>\n            <body onload=\"initMap()\">\n              <div id=\"map\" style=\"height: 100%; width: 100%;\"></div>\n            </body>\n          </html>");
                        break;
                    case "tencent":
                        iframeContent = "\n          <!DOCTYPE html>\n          <html>\n            <head>\n              <title>\u7B80\u5355\u5730\u56FE</title>\n              <script charset=\"utf-8\" src=\"https://map.qq.com/api/js?v=2.exp&key=\u60A8\u7684\u817E\u8BAF\u5730\u56FEAPI\u5BC6\u94A5\"></script>\n              <script>\n                var map;\n                function initMap() {\n                  map = new qq.maps.Map(document.getElementById(\"map\"), {\n                    center: new qq.maps.LatLng(".concat(lat, ", ").concat(lng, "),\n                    zoom: 8\n                  });\n                }\n              </script>\n            </head>\n            <body onload=\"initMap()\">\n              <div id=\"map\" style=\"height: 100%; width: 100%;\"></div>\n            </body>\n          </html>");
                        break;
                }
                modal = new InsertMapModal(this.app, iframeContent);
                modal.open();
                return [2 /*return*/];
            });
        });
    };
    InsertMapPlugin.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [{}, DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    InsertMapPlugin.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return InsertMapPlugin;
}(obsidian_1.Plugin));
exports.default = InsertMapPlugin;
var InsertMapSettingTab = /** @class */ (function (_super) {
    __extends(InsertMapSettingTab, _super);
    function InsertMapSettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    InsertMapSettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl("h2", { text: "插入地图插件设置" });
        new obsidian_1.Setting(containerEl)
            .setName("默认地图提供商")
            .setDesc("选择默认地图提供商")
            .addDropdown(function (dropdown) {
            dropdown
                .addOption("google", "谷歌地图")
                .addOption("osm", "OpenStreetMap")
                .addOption("gaode", "高德地图")
                .addOption("baidu", "百度地图")
                .addOption("tencent", "腾讯地图")
                .setValue(_this.plugin.settings.defaultMapProvider)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.defaultMapProvider = value;
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        new obsidian_1.Setting(containerEl)
            .setName("谷歌地图API密钥")
            .setDesc("输入您的谷歌地图JavaScript API密钥")
            .addText(function (text) {
            text
                .setPlaceholder("在此处输入您的API密钥")
                .setValue(_this.plugin.settings.googleMapsApiKey)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.googleMapsApiKey = value;
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    return InsertMapSettingTab;
}(obsidian_1.PluginSettingTab));
