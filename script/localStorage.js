function SaveItemToLocalStorage(item){
    let names = GetLocalStorage();
    if (names.length == 0){
        names.push(item);
    } else {
        let temp;
        let check = false;
        for (let i = 0; i < names.length; i++){
            if (names[i].toLowerCase() == item.toLowerCase()){
                check = true;
            }
        }
        if (check === false){
            names.push(item);
        }
    }

    localStorage.setItem('Names', JSON.stringify(names));
}

function GetLocalStorage(){
    let localStorageData = localStorage.getItem('Names');

    if(localStorageData === null){
        return [];
    }
    return JSON.parse(localStorageData);
}

function ClearLocalStorage(){
    localStorage.clear();
    console.log(localStorage);
}

function RemoveFromLocalStorage(item){
    let names = GetLocalStorage();

    for (let i = 0; i < names.length; i++){
        if (names[i] == item){
            names.splice(i, 1);
        }
    }

    localStorage.setItem('Names', JSON.stringify(names))
}

export { SaveItemToLocalStorage, GetLocalStorage, ClearLocalStorage, RemoveFromLocalStorage };