# Review Summarizer for Naver Production Reviews

It is being developed. It's living in [http://soma06-02.herokuapp.com/](http://soma06-02.herokuapp.com/). (actually dead now)

## Usage
```sh
# Common
npm install

# Launch as development, useful to test
npm run start-dev

# Build as production and deployment
npm run build -- --release
npm start
```

## Trouble Shooting

2015-11-06, 'material-ui@0.13.1' dependency has a problem with react server side rendering. It will be fixed soon. But now it needs to edit below line to fix it temporally:

```js
// node_modules folder will be created after executing 'npm install'
// ./node_modules/material-ui/lib/overlay.js Line 63
// ComponentWillMount: function ComponentWillMount() {
ComponentDidMount: function ComponentDidMount() {
```

## Test API

Open `src/config.js` file with any editor. There is `apiHost` option to request api. You can edit such as:

```js
...
export default {
  googleAnalyticsId: 'UA-XXXXX-X',
  apiHost: 'http://soma.lucent.me:5555/v1/', // Should be included / at last
};

```