DOM_isPlay.onclick = (e)=>{
    isPlay = !isPlay;
    e.target.textContent = isPlay? "Stop" : "Start";
    e.target.style.backgroundColor = isPlay? "red" : "green";
    if (isPlay){
        gameMax = +DOM_gameMax.value;
        myMax = +DOM_myMax.value;
        console.log(gameMax, myMax)
    } 
}
DOM_isShowProfits.onclick = (e)=>{
    isShowProfits =!isShowProfits;
    e.target.textContent = isShowProfits? "HideP" : "ShowP";
    document.getElementsByClassName('DOM_profits')[0].style.display = isShowProfits? "block" : "none";

}