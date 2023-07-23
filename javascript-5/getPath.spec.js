const getElemSelector = require('./getPath');
const getPath = require('./getPath');
const jsdom = require('jsdom');
const dom = new jsdom.JSDOM('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Уникальные экскурсии по Москве</title>  </head><body><header class="main-header"><ul class="main-menu-list"><li id="first-menu-item" class="main-menu-item"><a href="#features" class="main-menu-link">Почему мы?</a></li><li class="main-menu-item"><a href="#routes" class="main-menu-link">Маршруты</a></li><li class="main-menu-item"><a href="#guides" class="main-menu-link">Экскурсоводы</a></li><li class="main-menu-item"><a href="#price" class="main-menu-link">Стоимость</a></li><li class="main-menu-item"><a href="#order" class="main-menu-link">Записаться</a></li></ul></header><div class="intro" data-parallax="scroll" data-image-src="img/intro.jpg"><div class="margin-both"><h1 class="intro-title">Уникальные экскурсии по Москве</h1></div><div class="margin-both"><h2 class="intro-title">Поможем потратить ваше свободное время на получение новых знаний о Москве!</h2></div><div class="margin-both"><a href="#order" class="button button-blue">Участвовать прямо сейчас</a></div></div></body></html>');

test('simple test selector query', () => {
    const selector = 'title';
    const element = dom.window.document.querySelector(selector); 

    expect(getPath(element)).toBe(selector);
    expect(dom.window.document.querySelectorAll(getPath(element)).length).toBe(1);
});

test('test element with id', () => {
    const selector = '#first-menu-item';
    const element = dom.window.document.querySelector(selector);

    expect(getPath(element)).toBe(selector);
    expect(dom.window.document.querySelectorAll(getPath(element)).length).toBe(1);
})

test('test child element with same neighbors', () => {
    const selector = 'body > header.main-header:nth-child(1) > ul.main-menu-list > li.main-menu-item:nth-child(2) > a.main-menu-link';
    const element = dom.window.document.querySelector(selector);

    expect(getPath(element)).toBe(selector);
    expect(dom.window.document.querySelectorAll(getPath(element)).length).toBe(1);
})