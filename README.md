
# Personal Boilerplate
_https://github.com/pascalaoms/boilerplate_
- - - -
![dependencies check](https://david-dm.org/pascalaoms/boilerplate.svg)
![dev dependencies check](https://david-dm.org/pascalaoms/boilerplate/dev-status.svg)
## Usage
```
project new <name>  

yarn
npm run dev  
npm run build
```

---
### VueJS
**Set app variable in project.config to true.**  
Add these dependencies:
```
yarn add vue vue-router vuex && \
yarn add svg-url-loader url-loader vue-hot-reload-api \
vue-html-loader vue-loader webpack-hot-middleware \
vue-template-compiler gulp-inject stream-series gulp-htmlmin \
--dev
```
* Live Reloading
* Hot Module Reloading  
* Images <10KB to inline Base64
* VueJS Templating
No Sass import in JS hence the missing of Sass loaders. Using own Sass modules.  

### Icons
* save single icon SVG in **src/assets/icons**  
* Gulp task combines icons into single icon in **build/assets/icons.svg**
* If icons go inline, put them in **_Mat/img** and paste manually.
* Webpack alias for assets  
Reference icons like this:
```html
<use xlink:href="assets/icons.svg#squirrel"></use>
```

---

### Fonts
Too long install times for Gulp packages hence the global usage via Bash.  
This creates **WOFF** and **WOFF2** in the same folder.
```
convertFont path/to/font.ttf
```

---
