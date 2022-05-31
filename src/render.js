let contrastToggle = false;

function toggleContrast() {
    contrastToggle = !contrastToggle;
    if (contrastToggle) {
      document.body.classList += " dark-theme"
    }
    else {
      document.body.classList.remove("dark-theme")
    }
}



// const response = await fetch(api)
// const data = await response.json()

//Sorts and Searches

function bubble() {

  for(i=0; i < n; i++) {
    var isChanged = false;
    for(j=0; j < n - 1; j++){
      if(arr[j] > arr[j+1]){
        var temp = arr[j]
        arr[j] = arr[j+1]
        isChanged = true;
      }
    }
  }
}