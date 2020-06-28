const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@heading-color":"#fff",
      "@text-color":"#fff",
      "@body-background":"#00002b",
      "@layout-body-background":  "#00002b",
      "@menu-dark-item-active-bg": "transparent",
      "@table-header-bg": "rgb(138, 15, 15)",
      "@primary-color": "rgb(138, 15, 15)",
      "@primary-1": "red",
      "@table-padding-horizontal": "4px",
      "@text-color-secondary": "#fff",
      "@text-color-secondary-dark": "fade(@white, 85%)",
      "@input-color": "#000",
      "@item-hover-bg": "red",
      "@table-bg": "black",
      "@alert-close-color": "#000",
      "@select-item-selected-bg": "none",
      "@form-item-margin-bottom": "8px", 
      "@table-header-sort-bg": "darken(@table-header-bg, 5%)",
      "@modal-header-bg" : "@primary-color",
      "@modal-content-bg" : "#000",
      "@menu-dark-item-hover-bg" : "@primary-1",
      "@tabs-hover-color": "#fff",
      "@tabs-highlight-color": "#fff",
      "@table-body-sort-bg": "none",
    }
  })
);