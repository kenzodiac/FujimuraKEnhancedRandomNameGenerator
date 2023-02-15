//importing functions from localStorage.js to enable favorites functionality
import { SaveItemToLocalStorage, GetLocalStorage, ClearLocalStorage, RemoveFromLocalStorage } from "./localStorage.js";

//DECLARE VARIABLES FOR LINKING HTML TO JAVASCRIPT
    //variables for handling options buttons on side bar
    let addCodestackClass = document.getElementById('addCodestackClass');
    let selectRnd = document.getElementById('selectRnd');
    let showList = document.getElementById('showList');
    let sortList = document.getElementById('sortList');

    //variables for handling add new entry section on side bar
    let inputField = document.getElementById('inputField');
    let inputSubmitBtn = document.getElementById('inputSubmitBtn');

    //variable for clearing local storage memory
    let clearMemoryBtn = document.getElementById('clearMemoryBtn');

    //variables for taking input of number of groups
    let sortByPplPerGroup = document.getElementById('sortByPplPerGroup');
    let displayNumOfPplPerGroupNum = document.getElementById('displayNumOfPplPerGroupNum');
    let sortByNumOfGroups = document.getElementById('sortByNumOfGroups');
    let displayNumOfGroups = document.getElementById('displayNumOfGroups');

    //variables for governing injection areas on main page
    let messageDisplayArea = document.getElementById('messageDisplayArea');
    let sortListControlsArea = document.getElementById('sortListControlsArea');
    let listDisplayArea = document.getElementById('listDisplayArea');

//DECLARE VARIABLES FOR TRACKING INTERNAL LOGIC
    //variables to help track how the user's desires to create groups
    let desiredGroupSizeA = 0;
    let desiredGroupSizeB = 0;

    //variable used for creating a 2D array to sort groups into
    let listGroupsArray = [];


//DECLARE FUNCTIONS
    //function for importing codestack class list
    async function ImportCodeStackS5ClassList(){
        messageDisplayArea.innerHTML = 'Processing...';
        const promise = await fetch("./data/data.json");
        const data = await promise.json();
        let studentList = data;
        for (let i = 0; i < studentList.studentNames.length; i++){
            SaveItemToLocalStorage(studentList.studentNames[i].name);
        };
        console.log(GetLocalStorage());
        messageDisplayArea.innerHTML = "CodeStack Season 5 Students added to list! <br><br> Click \"Display Entire List\" button to view list.";
    };

    //function for saving new items to local storage list
    function AddNewEntry(input){
        let temp = GetLocalStorage();
        let checker = false;
        for (let i = 0; i < temp.length; i++){
            if (temp[i].toLowerCase() === input.toLowerCase()){
                checker = true;
            }
        };
        if (input === ''){
            messageDisplayArea.innerHTML = 'Error: You cannot add an empty entry! Make sure to properly fill out the input field.';
        } else if (checker === true) {
            messageDisplayArea.innerHTML = 'Error: This name already exists in the list! Please add a different name.'
        } else {
            SaveItemToLocalStorage(input);
            messageDisplayArea.innerHTML = "\"" + input + "\" saved to list! <br><br> Click \"Display Entire List\" button to view list."
        };
        console.log(GetLocalStorage());
    };

    //function for displaying the entire class list to the page
    function DisplayEntireList(){
        listDisplayArea.innerHTML = '';
        if (GetLocalStorage().length === 0){
            messageDisplayArea.innerHTML = "Error: There's nobody in the list! Please add entries to the list first and try again."
        } else {
            for (let i = 0; i < GetLocalStorage().length; i++){
                CreateNameElement(i);
            }
            messageDisplayArea.innerHTML = "This is the entire list that we've saved to memory.<br><br>If you wish to delete individual entries, click the red 'X' button to the right of each name.<br><br>To refresh the list, press the 'Display All Entries' button again.";
        };
    };

    //function for determining group sizes based on desired number of people per group
    function CalculateGroupSizesA(){
        let tempTot = GetLocalStorage().length;
        let groupNum;
        if (tempTot % desiredGroupSizeA === 1){
            groupNum = Math.floor(tempTot / desiredGroupSizeA);
        } else {
            groupNum = Math.ceil(tempTot / desiredGroupSizeA);
        };
        messageDisplayArea.innerHTML = '';
        desiredGroupSizeA = groupNum;
    };

    //function for creating a 2D array based on the number of desired groups
    function Create2DArray(input){
        listGroupsArray = []
        for (let i = 0; i < input; i++){
            listGroupsArray.push([]);
        };
        //console.log(listGroupsArray);
    };

    //function for populating 2D array with people list
    function Populate2DArray(){
        let peopleList = GetLocalStorage();
        let shuffledArray = peopleList.sort((a, b) => 0.5 - Math.random());
        let counter = 0;
        do {for (let j = 0; j < listGroupsArray.length; j++){
            if (shuffledArray[counter] != undefined){
                listGroupsArray[j].push(shuffledArray[counter]);
                counter++;
            } else {
                break;
            }
        }} while (counter < shuffledArray.length);
        console.log(listGroupsArray);
    };

    //function for creating a display name, including delete from memory btn
    function CreateNameElement(index){
        let itemBtn = document.createElement('button');
        let temp = GetLocalStorage();
        itemBtn.type = 'button';
        itemBtn.className = 'btn btn-primary';
        itemBtn.textContent = temp[index];

        let itemDeleteBtn = document.createElement('button');
        itemDeleteBtn.type = 'button';
        itemDeleteBtn.className = 'btn btn-danger';
        itemDeleteBtn.textContent = 'X';
        itemDeleteBtn.addEventListener('click', function(){
            RemoveFromLocalStorage(temp[index]);
        });

        let nameContainer = document.createElement('div');
        nameContainer.appendChild(itemBtn);
        nameContainer.appendChild(itemDeleteBtn);
        listDisplayArea.appendChild(nameContainer);
    };

    //function for fetching a random number
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
    };




//DECLARE EVENT LISTENERS FOR PAGE BUTTONS
    //Behavior for 'Add CodeStack Season 5 Class' button
    addCodestackClass.addEventListener('click', function(){
        ImportCodeStackS5ClassList();
    });

    //Behavior for 'Randomly Select One Person From List' button
    selectRnd.addEventListener('click', function(){
        listDisplayArea.innerHTML = '';
        let maxNum = GetLocalStorage().length;
        if (maxNum === 0){
            messageDisplayArea.innerHTML = "Error: There's nobody in the list! Please add entries to the list first and try again."
        } else {
            let rndNum = getRandomIntInclusive(0, (maxNum - 1));
            CreateNameElement(rndNum);
            messageDisplayArea.innerHTML = "Random name from list fetched.<br><br>If you want to delete this name from memory, click the red 'X' button next to the name.";
        }
    });

    //Behavior for 'Display Entire List' button
    showList.addEventListener('click', function(){
        DisplayEntireList();
    });

    //Behavior for 'Sort List Into Groups' button
    sortList.addEventListener('click', function(){
        if (sortListControlsArea.classList.contains('d-none')){
            sortListControlsArea.classList.remove('d-none');
        } else {
            sortListControlsArea.classList.add('d-none');
        }
    });

    //Behavior for 'Add New Entry' submit button
    inputSubmitBtn.addEventListener('click', function(){
        AddNewEntry(inputField.value);
    });

    //Behavior for 'Clear List' button
    clearMemoryBtn.addEventListener('click', function(){
        ClearLocalStorage();
        messageDisplayArea.innerHTML = 'List CLEARED from memory. Hope you meant to do that. :)';
        listDisplayArea.innerHTML = '';
        listGroupsArray = [];
    });
    
    //Behavior for Sort Groups by # of people per group range input
    sortByPplPerGroup.addEventListener('change', function(){
        displayNumOfPplPerGroupNum.textContent = sortByPplPerGroup.value;
        console.log(sortByPplPerGroup.value);
        desiredGroupSizeA = sortByPplPerGroup.value;
        CalculateGroupSizesA();
        Create2DArray(desiredGroupSizeA);
        Populate2DArray();
    });
    
    //Behavir for Sort Groups by number of groups range input
    sortByNumOfGroups.addEventListener('change', function(){
        console.log(sortByNumOfGroups.value);
        displayNumOfGroups.textContent = sortByNumOfGroups.value;
        desiredGroupSizeB = sortByNumOfGroups.value;
        Create2DArray(desiredGroupSizeB);
        Populate2DArray();
    });
