# Phaser 3 Webpack 5 Boilerplate

Get up and running with Phaser 3 using TypeScript or JavaScript ES6.

This Webpack setup takes care of your code bundling and local development server.

Included are some handy demonstration files:

- `Inputs` class for handling gamepad and keyboard inputs
- `Player` class demonstrating character movement and state management
- A basic tilemap created using [Tiled](https://www.mapeditor.org/)

[View the demo](https://sebsowter.github.io/phaser-webpack/)

![Mario](https://user-images.githubusercontent.com/7384630/55728490-1205fb00-5a0c-11e9-9fca-67641df3549b.jpg)

## Installation

Ensure you have [Node.js](https://nodejs.org) installed.

Clone this repository and `cd` to project directory.

```
npm i
```

## Tasks

### Run the development server

```
npm start
```

Preview locally at http://localhost:8080/.

### Create a production build

```
npm run build
```

This bundles your files to the distribution (`/dist`) folder. The webpack config is set up to output Phaser and your game code into separate .js files.

_If you are publishing your game to [itch.io](https://itch.io) simply zip up the files in the `/dist` folder and upload the zip file._

## Community

This repository is actively maintained. Every so often I upgrade the packages and add features. I like boilerplates to be light so I have kept it minimal. But if you think this package would benefit from additional features then feel free to reach out or add an issue.
