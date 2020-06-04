const prodPulgins = []
if (process.env.NODE_ENV === 'production') {
  prodPulgins.push('transform-remove-console')
}

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    // 发布产品时候的插件数组
    ...prodPulgins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
