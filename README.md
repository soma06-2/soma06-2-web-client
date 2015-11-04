# Review Summarizer for Naver Production Reviews

It is being developed. It's living in [http://soma06-02.herokuapp.com/](http://soma06-02.herokuapp.com/). (actually dead now)

## Usage
```sh
npm install
npm start
```

## Bug

2015-11-04, 'material-ui' dependency has a problem. Edit below line to fix it temporally:

```js
// ./node_modules/material-ui/lib/overlay.js Line 63
// ComponentWillMount: function ComponentWillMount() {
ComponentDidMount: function ComponentDidMount() {
```