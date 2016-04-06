'use strict'

var assert = require('assert')
var Pager = require('..')
var cheerio = require('cheerio')

describe('pager', function () {
	
	// Tests

	describe('basic', function () {

		it('init', function() {
			var pager = new Pager()
			var html = pager.render({
				page: 1
				,pageSize: 10
				,total: 100
				,maxLink: 5
			})
			//console.log(html)
			var $ = cheerio.load(html)
			assert($('.page-item').length === 8)
		})

	})


	describe('options', function () {

		it('init page=4', function() {
			var pager = new Pager()
			var html = pager.render({
				page: 4
				,pageSize: 10
				,total: 503
				,maxLink: 5
			})
			var $ = cheerio.load(html)
			assert($('.page-item').length === 9)
			assert($('.page-item.active').text().trim() === '4')

		})

		it('init maxLink=100', function() {

			var pager = new Pager()
			var html = pager.render({
				page: 1
				,pageSize: 10
				,total: 503
				,maxLink: 100
			})
			var $ = cheerio.load(html)
			assert($('.page-item').length === 53)
			assert($('.page-item.active').text().trim() === '1')

		})

		it('init maxLink=1(maxLink will never less than 5)', function() {

			var pager = new Pager()
			var html = pager.render({
				page: 1
				,pageSize: 10
				,total: 503
				,maxLink: 1
			})
			var $ = cheerio.load(html)
			assert($('.page-item').length === 8)
			assert($('.page-item.active').text().trim() === '1')

		})

		it('init total=1', function() {
			var pager = new Pager()
			var html = pager.render({
				page: 1
				,pageSize: 10
				,total: 1
				,maxLink: 5
			})
			var $ = cheerio.load(html)
			assert($('.page-item').length === 3)
			assert($('.page-item.active').text().trim() === '1')

		})

		it('init total=0', function() {
			var pager = new Pager()
			var html = pager.render({
				page: 1
				,pageSize: 10
				,total: 0
				,maxLink: 5
			})
			var $ = cheerio.load(html)
			assert($('.page-item').length === 3)
			assert($('.page-item.active').length === 0)

		})

		it('init url=xxx', function() {
			var pager = new Pager()
			var html = pager.render({
				page: 1
				,pageSize: 10
				,total: 503
				,maxLink: 5
				,url: 'xxx'
			})
			var $ = cheerio.load(html)
			assert($('.page-item').length === 8)
			assert(html.indexOf('xxx') > -1)

		})

	})


	describe('glob default', function () {

		it('prev text', function() {

			var pager = new Pager({
				prevHtml: 'prev'
			})
			var html = pager.render({
				page: 1
				,pageSize: 10
				,total: 503
				,maxLink: 5
			})
			var $ = cheerio.load(html)

			assert($('.page-item').eq(0).children().children('span').eq(0).text() === 'prev')

		})

		it('next text', function() {

			var pager = new Pager({
				nextHtml: 'next'
			})
			var html = pager.render({
				page: 1
				,pageSize: 10
				,total: 503
				,maxLink: 5
			})
			var $ = cheerio.load(html)
			assert($('.page-item').eq(7).children().children('span').eq(0).text() === 'next')

		})

		it('prev screen reader text', function() {

			var pager = new Pager({
				prevSrHtml: 'prev0'
			})
			var html = pager.render({
				page: 1
				,pageSize: 10
				,total: 503
				,maxLink: 5
			})
			var $ = cheerio.load(html)
			assert($('.page-item').eq(0).find('.sr-only').eq(0).text() === 'prev0')

		})

		it('next screen reader text', function() {

			var pager = new Pager({
				nextSrHtml: 'next0'
			})
			var html = pager.render({
				page: 1
				,pageSize: 10
				,total: 503
				,maxLink: 5
			})
			var $ = cheerio.load(html)
			assert($('.page-item').eq(7).find('.sr-only').eq(0).text() === 'next0')

		})

		it('template', function() {

			var pager = new Pager({
				template: function(data) {
					return `<nav class="zpagenav" >
						<span class="pagination0 page-link m-r-1">total:${data.total}</span> 
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

			})
			var html = pager.render({
				page: 1
				,pageSize: 10
				,total: 503
				,maxLink: 5
			})
			var $ = cheerio.load(html)
			assert($('.pagination0').length === 1)

		})

	})

	//end
})
