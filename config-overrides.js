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
        "@menu-dark-item-active-bg": "none",
        "@table-header-bg": "rgb(138, 15, 15)",
        "@primary-color": "rgb(138, 15, 15)",
        "@primary-1": "red",
        "@table-padding-horizontal": "4px",
        "@text-color-secondary": "#fff",
        "@text-color-secondary-dark": "fade(@white, 85%)"
    }
  })
);