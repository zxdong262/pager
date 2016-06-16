
'use strict'

class Pager {

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
	 * @param url {String} base url
	 * @param template {Function} template function, return the output html
	 */

	constructor(options) {

		this.default = Object.assign({}, {
			pageSize: 10
			,total: 0
			,prevHtml: '«'
			,nextHtml: '»'
			,prevSrHtml: 'Previous'
			,nextSrHtml: 'Next'
			,dotsHtml: '...'
			,template: function(data) {
				var tag = data.url.indexOf('?') > -1?'&':'?'
				return `<nav class="zpagenav" >
					<span class="pagination page-link m-r-1">total:${data.total}</span> 
					<ul class="pagination">` +

						data.units.map(function(unit, index) {
							var url = unit.page === 1?
												data.url
												:data.url + tag + 'page=' + unit.page
							return `<li class="page-item ${unit.class}">
								<` + (unit.isDisabled?'span':'a') + ` class="page-link" href="${url}" aria-label="${unit.ariaLabel}">` +
									(unit.isPager?`<span aria-hidden="true">${unit.html}</span>`:
																`<span>${unit.html}</span>`) +
									(unit.isPager?`<span class="sr-only">${unit.srHtml}</span>`:'') +
								`</` + (unit.isDisabled?'span':'a') + `>
							</li>`
						}).join('') +

					`</ul>
				</nav>`
			}

		}, options)

	}

	/**
	 * create data array for render html
	 *
	 * @param params {Object} params object
	 * @param params.page {Number} page number, default = 10
	 * @param params.pageSize {Number} page size, default = 1
	 * @param params.total {Number} items number, default = 0
	 * @param params.maxLink {Number} max link number to show, must > 5
	 * @param params.url {String} base url, default = ''
	 * @return {Array}
	 */

	createUnits(params) {

		let option = this.default
		let th = params
		let page = th.page || option.page
		let pageSize = th.pageSize || option.pageSize
		let total = th.total || option.total
		let maxLink = th.maxLink > 5?th.maxLink:5

		let linksCount = Math.ceil(total/pageSize)

		if(page > linksCount) page = linksCount + 0

		let hasPrev = page > 1
		let hasNext = page < linksCount
		let realMaxLink = maxLink > linksCount?linksCount:maxLink
		let len1, len2, len3, shouldInsertDots12, shouldInsertDots23
		let len2Start, len3Start

		let units = []
		let arr = computeLens()

		units.push({
			class: hasPrev?'':'disabled'
			,page: hasPrev?page - 1:page
			,isPager: true
			,isPrev: true
			,isNext: false
			,isDisabled: !hasPrev
			,html: option.prevHtml
			,srHtml: option.prevSrHtml
			,ariaLabel: option.prevSrHtml
		})

		let dotUnit = {
			class: 'disabled'
			,isDisabled: true
			,page: page
			,isPager: false
			,isPrev: false
			,isNext: true
			,ariaLabel: option.dotsHtml
			,html: option.dotsHtml
		}

		for(let i = 0, len = arr.length;i < len;i ++) {
			pushUnit(arr[i])
		}

		units.push({
			class: hasNext?'':'disabled'
			,isDisabled: !hasNext
			,page: hasNext?page + 1:page
			,isPager: true
			,isPrev: false
			,isNext: true
			,html: option.nextHtml
			,srHtml: option.nextSrHtml
			,ariaLabel: option.nextSrHtml
		})

		function pushUnit(i) {
			if(typeof i === 'number') {
				units.push({
					page: i
					,isPrev: false
					,isPager: false
					,isDisabled: false
					,class: i === page?'active':''
					,isNext: false
					,html: i
					,ariaLabel: i
				})	
			} else units.push(dotUnit)
		}

		function computeLens() {
			let a4 = Math.floor((realMaxLink - 2) / 2)
			let a5 = realMaxLink - 3 - a4
			let s2 = page - a4
			let s3 = page + a5
			if(s2 < 2) {
				s2 = 2
			}
			else if(s3 > linksCount) {
				s2 = linksCount - (realMaxLink - 2)
			}
			let arr = [1]
			if(s2 > 2) arr.push('dot')
			let it
			for(let i = 0, len = realMaxLink - 2;i < len;i ++) {
				it = i + s2
				arr.push(it)
			}
			if(it < linksCount - 1) arr.push('dot')
			if(it < linksCount) arr.push(linksCount)
			return arr
		}

		return units

	}

	/**
	 * create pagenav html
	 *
	 * @param params {Object} params object
	 * @param params.page {Number} page number
	 * @param params.pageSize {Number} page size
	 * @param params.total {Number} items number
	 * @param params.maxLink {Number} max link number to show
	 * @return {String}
	 */

	render(_params) {

		let params = _params
		params.url = params.url || ''
		let units = this.createUnits(params)
		params.units = units
		return this.default.template(params)

	}

}

module.exports = Pager