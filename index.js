// const url = "https://uselessfacts.jsph.pl/random.json"

// let value = document.getElementById("h1")
// value.textContent = 1;
// let counter = Number(value.textContent);

// const increase_BTN = document.getElementById("Increase");
// const decrease_BTN = document.getElementById("Decrease");
// const reset_BTN = document.getElementById("Reset");
// const randomize_BTN = document.getElementById("Randomize");

// //increase
// increase_BTN.onclick = function(){
//     counter +=1;
//     value.textContent = counter;
//     if(Number(value.textContent) > 20){
//         console.log("OLD!!!");
//     }
// }
// //decrease
// decrease_BTN.onclick = function(){
//     counter -=1;
//     value.textContent = counter;
//     if(Number(value.textContent) > 20){
//         console.log("OLD!!!");
//     }
// }
// //Reset
// reset_BTN.onclick = function(){
//     counter = 0;
//     value.textContent = counter;
//     if(Number(value.textContent) > 20){
//         console.log("OLD!!!");
//     }
// }

// //Randomize
// randomize_BTN.onclick = function(){
//     counter = Math.floor(Math.random() * 100);
//     value.textContent = counter;
//     if(Number(value.textContent) > 20){
//         console.log("OLD!!!");
//     }
// }
    

// const person = {
//     first_name : "Rohan",
//     last_name : "Sivadas"
// }

// console.log(person.last_name)

// async function apiCall()
// {
//     try{
//         const response = await fetch(url);
//         if(!response.ok){
//             throw new Error(`Response status = ${response.status}`);
//         }

//         const result = await response.json();


//         console.log(result.text);
//     }
//     catch (error) {
//         console.log(error.message);
//     }
// }

// apiCall();

function func1(callback){
    setTimeout(() => {
        console.log()
    }, 5000);
}

function func2(){
    console.log("Task 2");
    console.log("Task 3");
    console.log("Task 4");

}