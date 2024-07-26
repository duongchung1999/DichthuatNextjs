const taskbarhide = document.querySelector('.ti-angle-double-left')
const taskbarshow = document.querySelector('.ti-angle-double-right')
// const taskbar = document.querySelector('.menu-hidden')
const headerjs = document.querySelector('.js-header')
const contentjs = document.querySelector('.js-content')
var menuHiddenElements = document.querySelectorAll('.menu-hidden');
function ShowTaskbar(){
    // taskbar.classList.remove('hidden')
    menuHiddenElements.forEach(function(element) {
        element.classList.remove('hidden');
    });
    taskbarhide.classList.remove('hidden')
    taskbarhide.classList.add('shower')
    taskbarshow.classList.add('hidden')
    taskbarshow.classList.remove('shower')
    headerjs.classList.remove('js-changewidth')
    contentjs.classList.remove('js-changemargin')
    contentjs.classList.add('add-animation1')
    headerjs.classList.add('add-animation1')
    contentjs.classList.remove('add-animation')
    headerjs.classList.remove('add-animation')
}
function HideTaskbar(){
    // taskbar.classList.add('hidden')
    menuHiddenElements.forEach(function(element) {
        element.classList.add('hidden');
    });
    taskbarhide.classList.add('hidden')
    taskbarhide.classList.remove('shower')
    taskbarshow.classList.remove('hidden')
    taskbarshow.classList.add('shower')
    headerjs.classList.add('js-changewidth')
    contentjs.classList.add('js-changemargin')
    contentjs.classList.remove('add-animation1')
    headerjs.classList.remove('add-animation1')
    contentjs.classList.add('add-animation')
    headerjs.classList.add('add-animation')
}
export  { ShowTaskbar };
export  { HideTaskbar };