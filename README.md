
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

For WordPress create `style.css` in root.

---
### Vue
**Set app variable in tasks/config to true.**  
Add app dependencies with `installAppDependencies`.

* Live Reloading
* Hot Module Reloading  
* Vue Templating
No Sass import in JS hence the missing of Sass loaders. Using own Sass modules.  

### Icons
* Save single icon SVG in **src/assets/icons**  
* Gulp task combines icons into single icon in **build/assets/icons.svg**
* If icons go inline, put them in **assets/img/img** and paste manually.
* Webpack alias for assets available

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
