let leftSide = document.querySelector(".left-container");
let rightSide = document.querySelector(".right-container");
let bar = document.querySelector(".bar");
let runCode =  document.querySelector(".run");
let editor = document.querySelector(".editor");
let iframe = document.querySelector(".iframe")
let darkMode = document.querySelector(".dark-mode");
let lightMode = document.querySelector(".light-mode");
// resize the editor size
function drag(e){
    e.preventDefault();
    document.selection?document.selection.empty():
    window.getSelection().removeAllRanges();
    leftSide.style.width = (e.pageX - bar.offsetWidth/3)+'px';
    editor.resize();
}
bar.addEventListener("mousedown",function(){
    document.addEventListener("mousemove",drag);
})
bar.addEventListener("mouseup",function(){
    document.removeEventListener("mousemove",drag);
})
runCode.addEventListener("click",function(){
    const html = editor.textContent;
    iframe.src = "data:text/html;charset=utf-8,"+encodeURI
   (html)
})
darkMode.addEventListener("click",function(){
    editor.style.backgroundColor = '#363836';
    editor.style.color = "#eee"
})
lightMode.addEventListener("click",function(){
    editor.style.color = '#363836';
    editor.style.backgroundColor = "#eee"
})

document.querySelector(".live").addEventListener("click",function(){
    editor.addEventListener("keyup",function(){
        const html = editor.textContent;
        iframe.src = "data:text/html;charset=utf-8,"+encodeURI
          (html)
    })
})