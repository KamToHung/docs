var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// sidebars.ts
var sidebars_exports = {};
__export(sidebars_exports, {
  default: () => sidebars_default
});
module.exports = __toCommonJS(sidebars_exports);
var sidebars = {
  tutorialSidebar: [
    {
      type: "doc",
      id: "intro"
    },
    {
      type: "category",
      label: "Getting Started",
      items: [
        "getting-started/installation",
        "getting-started/configuration",
        "getting-started/examples"
      ]
    },
    {
      type: "category",
      label: "Core Features",
      items: [
        "core-features/rest-conversion"
      ]
    }
  ]
};
var sidebars_default = sidebars;
