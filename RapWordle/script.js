const keyValue = ['Q', 'W', 'E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','ENTER','Z','X','C','V','B','N','M','<'];
const words = ["SLEEP","THORN","BLOWN","SERVE","FIGHT"];

const SAVED_EVENT = 'saved-todo';

//key
const STORAGE_KEY_Round = 'RAP_Wordle_Round';
const STORAGE_KEY_Win = 'RAP_Wordle_Win';

const RENDER_EVENT = 'render-wordle';

let currentWord = [];

let rowNum = 0;
let colNum = 0;
let checkGreenBox;
let Round;
let Win;

document.addEventListener('DOMContentLoaded', function () {
    generateMainBox();
    generateKeyboard();
    //localStorage.clear();
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
    Round = localStorage.getItem(STORAGE_KEY_Round);
    Win = localStorage.getItem(STORAGE_KEY_Win);

    if (Round == null) Round = 0;
    if (Win == null) Win = 0;

    generateStatistik();

    // document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateStatistik(){
    //delete previous h3
    const statistikModal = document.getElementById("statistik")
    while (statistikModal.firstChild) {
        statistikModal.firstChild.remove();
    }

    //add round statistik
    let textRound = document.createElement('h3');
    textRound.innerHTML = "Round => " + Round;
    statistikModal.append(textRound);

    //add win statistik
    let textWin = document.createElement('h3');
    textWin.innerHTML = "Win => " + Win;
    statistikModal.append(textWin);
}

document.addEventListener(RENDER_EVENT, function () {
    // const uncompletedTODOList = document.getElementById('todos');
    // uncompletedTODOList.innerHTML = '';
   
    // const completedTODOList = document.getElementById('completed-todos');
    // completedTODOList.innerHTML = '';
   
    // for (const todoItem of todos) {
    //   const todoElement = makeTodo(todoItem);
    //   if (!todoItem.isCompleted)
    //     uncompletedTODOList.append(todoElement);
    //   else
    //     completedTODOList.append(todoElement);
    // }
});

// generate main-container
function generateMainBox(){
    const mainContainer = document.getElementById('main-container');

    for(let i = 0; i <= 5; i++){
        let boxContainer = document.createElement('div');
        boxContainer.classList.add('row');
        for(let j = 0; j <= 4; j++){
            let colBoxContainer = document.createElement('div');
            colBoxContainer.classList.add('col','box');

            boxContainer.append(colBoxContainer);
        }
        mainContainer.append(boxContainer);
    }
}

// generate keyboard
function generateKeyboard(){
    const keyboardContainer = document.getElementById('keyboard-container');

    let textContainer = document.createElement('div');
    textContainer.classList.add('row','d-flex','justify-content-center');
    textContainer.style.marginBottom="5px";
    for(let i = 0; i <= 27; i++){
        if(i == 10 || i == 19)
        {
            keyboardContainer.append(textContainer);

            textContainer = document.createElement('div');
            textContainer.classList.add('row','d-flex','justify-content-center');
            textContainer.style.marginBottom="5px";
        }
        const keyButton = document.createElement('button');

        if(keyValue[i] == "ENTER" || i == 27){
            keyButton.classList.add('keyboard-action');
        }else{
            keyButton.classList.add('keyboard-button');
        }
        keyButton.innerText = keyValue[i];
     
        keyButton.addEventListener('click', function (key) {
          addValueToBox(key);
        });
        textContainer.append(keyButton);
    }
    keyboardContainer.append(textContainer);
}

// add value and also check enter action and delete action
function addValueToBox(key){
    if(key.target.innerText == "ENTER"){
        if(colNum != 5){
            console.log("Not Enough Letter");
        }else{
            checkAnswer();

            if(checkGreenBox == 5){
                gameWin();
                Round++; Win++;
                localStorage.setItem(STORAGE_KEY_Round, Round);
                localStorage.setItem(STORAGE_KEY_Win, Win);
                generateStatistik();
                clearScreen();
                return;
            }

            if(rowNum == 6){
                gameOver();
                return;
            }
        }
        return;
    }

    // remove element
    if(key.target.innerText == "<"){
        if(colNum == 0){
            return;
        }
        const mainContainer = document.getElementById('main-container');
        const row = mainContainer.getElementsByClassName('row');
        let currentRow = row[rowNum].getElementsByClassName('col');

        currentRow[colNum-1].removeChild(currentRow[colNum-1].firstElementChild);
        colNum--;
        return;
    }

    const mainContainer = document.getElementById('main-container');
    const row = mainContainer.getElementsByClassName('row');

    if(colNum == 5){
        return;
    }

    let currentRow = row[rowNum].getElementsByClassName('col');

    //buat elemen p
    huruf = document.createElement('p');
    bold = document.createElement('b');
    bold.innerText = key.target.innerText;
    huruf.append(bold);
    huruf.classList.add('text-box');
    currentRow[colNum].append(huruf);

    currentWord.push(key.target.innerText);
    colNum++;
}

function checkAnswer(){
    checkGreenBox = 0;
    for(let k = 0; k < 5; k++){
        const mainContainer = document.getElementById('main-container');
        const row = mainContainer.getElementsByClassName('row');
        let currentRow = row[rowNum].getElementsByClassName('col');

        //indicator
        let greenBox = 0;
        let yellowBox = 0;

        for(let z = 0; z < 5; z++){
            if(words[Round][z] == currentWord[k] && z == k){
                greenBox = 1;
                break;
            }else if(words[Round][z] == currentWord[k]){
                yellowBox = 1;
            }
        }
        
        if(greenBox == 1){
            currentRow[k].classList.add('green-box');
            checkGreenBox++;
        }else if(yellowBox == 1){
            currentRow[k].classList.add('yellow-box');
        }else{
            currentRow[k].classList.add('grey-box');
        }
    }
    
    currentWord = [];
    colNum = 0;
    rowNum++;
}

function clearScreen(){
    location.reload();
}

function gameOver(){
    alert("You Lose!");
}

function gameWin(){
    alert("You Win!");
}