# zpager
a nodejs module render pagination html

## install
```bash
npm install zpager --save
```

## use

```javascript

const Pager = require('zpager')
let pager = new Pager()
var html = pager.render({
  page: 1
  ,pageSize: 10
  ,total: 503
  ,maxLink: 5
})

/* 
//html =

<nav class="zpagenav" >
          <span class="pagination page-link m-r-1">total:100</span> 
          <ul class="pagination"><li class="page-item disabled">
                <span class="page-link" href="?p=1" aria-label="Previous"><span aria-hidden="true">«</span><span class="sr-only">Previous</span></span>
              </li><li class="page-item active">
                <a class="page-link" href="?p=1" aria-label="1"><span>1</span></a>
              </li><li class="page-item ">
                <a class="page-link" href="?p=2" aria-label="2"><span>2</span></a>
              </li><li class="page-item ">
                <a class="page-link" href="?p=3" aria-label="3"><span>3</span></a>
              </li><li class="page-item ">
                <a class="page-link" href="?p=4" aria-label="4"><span>4</span></a>
              </li><li class="page-item disabled">
                <span class="page-link" href="?p=1" aria-label="..."><span>...</span></span>
              </li><li class="page-item ">
                <a class="page-link" href="?p=10" aria-label="10"><span>10</span></a>
              </li><li class="page-item ">
                <a class="page-link" href="?p=2" aria-label="Next"><span aria-hidden="true">»</span><span class="sr-only">Next</span></a>
              </li></ul>
        </nav>

*/
```

## customize
```javascript

  /**
   * constructor with option
   *
   * @param pageSize {Number} default pagesize
   * @param total {Number} default total items number
   * @param pageSize {Number} default pagesize
   * @param prevHtml {String} prev button html
   * @param nextHtml {String} next button html
   * @param prevSrHtml {String} prev button html for screen reader
   * @param nextSrHtml {String} next button html for screen reader
   * @param dotsHtml {String} seprator button html
   * @param template {Function} template function, return the output html
   */

let option = {
      pageSize: 10
      ,total: 0
      ,prevHtml: '«'
      ,nextHtml: '»'
      ,prevSrHtml: 'Previous'
      ,nextSrHtml: 'Next'
      ,dotsHtml: '...'
      ,template: function(data) {
        return `<nav class="zpagenav" >
          <span class="pagination page-link m-r-1">total:${data.total}</span> 
          <ul class="pagination">` +

            data.units.map(function(unit, index) {
              return `<li class="page-item ${unit.class}">
                <` + (unit.isDisabled?'span':'a') + ` class="page-link" href="?p=${unit.page}" aria-label="${unit.ariaLabel}">` +
                  (unit.isPager?`<span aria-hidden="true">${unit.html}</span>`:
                                `<span>${unit.html}</span>`) +
                  (unit.isPager?`<span class="sr-only">${unit.srHtml}</span>`:'') +
                `</` + (unit.isDisabled?'span':'a') + `>
              </li>`
            }).join('') +

          `</ul>
        </nav>`
      }
}

const Pager = require('pager')
let pager = new Pager(option)
var html = pager.render({
  page: 1
  ,pageSize: 10
  ,total: 503
  ,maxLink: 5
})

```

### style it, for default template, just the same css from bootstrap4 pagination module
```css
.m-r-1 {
    margin-right: 1rem!important;
}
.pagination {
  display: inline-block;
  padding-left: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: .25rem;
}

.page-item {
  display: inline;
}

.page-item:first-child .page-link {
  margin-left: 0;
  border-top-left-radius: .25rem;
  border-bottom-left-radius: .25rem;
}

.page-item:last-child .page-link {
  border-top-right-radius: .25rem;
  border-bottom-right-radius: .25rem;
}

.page-item.active .page-link, .page-item.active .page-link:focus, .page-item.active .page-link:hover {
  z-index: 2;
  color: #fff;
  cursor: default;
  background-color: #0275d8;
  border-color: #0275d8;
}

.page-item.disabled .page-link, .page-item.disabled .page-link:focus, .page-item.disabled .page-link:hover {
  color: #818a91;
  cursor: not-allowed;
  background-color: #fff;
  border-color: #ddd;
}

.page-link {
  position: relative;
  float: left;
  padding: .5rem .75rem;
  margin-left: -1px;
  line-height: 1.5;
  color: #0275d8;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #ddd;
}

.page-link:focus, .page-link:hover {
  color: #014c8c;
  background-color: #eceeef;
  border-color: #ddd;
}

.pagination-lg .page-link {
  padding: .75rem 1.5rem;
  font-size: 1.25rem;
  line-height: 1.333333;
}

.pagination-lg .page-item:first-child .page-link {
  border-top-left-radius: .3rem;
  border-bottom-left-radius: .3rem;
}

.pagination-lg .page-item:last-child .page-link {
  border-top-right-radius: .3rem;
  border-bottom-right-radius: .3rem;
}

.pagination-sm .page-link {
  padding: .275rem .75rem;
  font-size: .875rem;
  line-height: 1.5;
}

.pagination-sm .page-item:first-child .page-link {
  border-top-left-radius: .2rem;
  border-bottom-left-radius: .2rem;
}

.pagination-sm .page-item:last-child .page-link {
  border-top-right-radius: .2rem;
  border-bottom-right-radius: .2rem;
}

.pager {
  padding-left: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  list-style: none;
}

.pager::after {
  display: table;
  clear: both;
  content: "";
}

.pager li {
  display: inline;
}

.pager li > a,
.pager li > span {
  display: inline-block;
  padding: 5px 14px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 15px;
}

.pager li > a:focus, .pager li > a:hover {
  text-decoration: none;
  background-color: #eceeef;
}

.pager .disabled > a, .pager .disabled > a:focus, .pager .disabled > a:hover {
  color: #818a91;
  cursor: not-allowed;
  background-color: #fff;
}

.pager .disabled > span {
  color: #818a91;
  cursor: not-allowed;
  background-color: #fff;
}

.pager-next > a,
.pager-next > span {
  float: right;
}

.pager-prev > a,
.pager-prev > span {
  float: left;
}
```


## test
```bash
git clone https://github.com/zxdong262/pager.git
cd pager
npm install
npm i mocha -g
mocha
```

## License
MIT
