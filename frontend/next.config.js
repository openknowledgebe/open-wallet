const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const withFonts = require('next-fonts');

// Don't enable CSS modules
// To prevent blueprint classes from being hashed
module.exports = withPlugins([[withCSS], [withFonts], [withImages]]);
