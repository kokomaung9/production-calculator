// =====================================================
// Production Calculator v2.0
// PART 1
// Variables + Helper Functions
// =====================================================

// ---------- Inputs ----------

const qtyPerBox = document.getElementById("qtyPerBox");
const dayShift = document.getElementById("dayShift");
const nightShift = document.getElementById("nightShift");

const damage1 = document.getElementById("damage1");
const damage2 = document.getElementById("damage2");
const damage3 = document.getElementById("damage3");
const damage4 = document.getElementById("damage4");

// ---------- Results ----------

const realResult = document.getElementById("realResult");
const damageResult = document.getElementById("damageResult");
const totalResult = document.getElementById("totalResult");

// ---------- Button ----------

const resetBtn = document.getElementById("resetBtn");

// ---------- Input Array ----------

const inputs = [
    qtyPerBox,
    dayShift,
    nightShift,
    damage1,
    damage2,
    damage3,
    damage4
];

// =====================================================
// Remove commas
// =====================================================

function removeComma(value){

    return value.replace(/,/g,"");

}

// =====================================================
// Digits only
// =====================================================

function digitsOnly(value){

    return value.replace(/\D/g,"");

}

// =====================================================
// Convert Input -> Number
// =====================================================

function getNumber(input){

    const value = digitsOnly(input.value);

    if(value === ""){

        return 0;

    }

    return Number(value);

}

// =====================================================
// Number Formatter
// =====================================================

function formatNumber(number){

    return Number(number).toLocaleString("en-US");

}

// =====================================================
// Set Result
// =====================================================

function setResult(element,value){

    element.textContent = formatNumber(value);

}

// =====================================================
// PART 2
// Auto Comma Formatter
// =====================================================

function formatInput(input){

    // Cursor Position
    let cursor = input.selectionStart;

    // Current Value
    let value = input.value;

    // Digits Only
    let numbers = value.replace(/\D/g,"");

    // Empty
    if(numbers === ""){

        input.value = "";

        return;

    }

    // Count commas before formatting
    const oldCommaCount = (value.match(/,/g) || []).length;

    // Format
    const formatted = Number(numbers).toLocaleString("en-US");

    input.value = formatted;

    // Count commas after formatting
    const newCommaCount = (formatted.match(/,/g) || []).length;

    // Restore cursor position
    cursor += (newCommaCount - oldCommaCount);

    if(cursor < 0){

        cursor = 0;

    }

    requestAnimationFrame(()=>{

        input.setSelectionRange(cursor,cursor);

    });

}

// =====================================================
// Number Only
// =====================================================

inputs.forEach(input=>{

    input.setAttribute("inputmode","numeric");

    input.setAttribute("autocomplete","off");

    input.setAttribute("spellcheck","false");

    input.addEventListener("beforeinput",(e)=>{

        if(e.data === null){

            return;

        }

        if(!/^[0-9]$/.test(e.data)){

            e.preventDefault();

        }

    });

});

// =====================================================
// PART 3
// Live Calculator
// =====================================================

function calculate(){

    // ---------- Input ----------

    const qty = getNumber(qtyPerBox);

    const day = getNumber(dayShift);

    const night = getNumber(nightShift);

    const sf1 = getNumber(damage1);

    const sf2 = getNumber(damage2);

    const sf3 = getNumber(damage3);

    const sf4 = getNumber(damage4);

    // ---------- Formula ----------

    const real = Math.abs(day - night) * qty;

    const damage = sf1 + sf2 + sf3 + sf4;

    const total = real + damage;

    // ---------- Result ----------

    setResult(realResult, real);

    setResult(damageResult, damage);

    setResult(totalResult, total);

}

// =====================================================
// Live Input
// =====================================================

inputs.forEach(input=>{

    input.addEventListener("input",()=>{

        formatInput(input);

        calculate();

    });

});

// =====================================================
// Reset Button
// =====================================================

resetBtn.addEventListener("click",()=>{

    inputs.forEach(input=>{

        input.value="";

    });

    calculate();

});

// =====================================================
// First Load
// =====================================================

calculate();

// =====================================================
// PART 4
// Production Polish
// =====================================================

// Select all text when input gets focus
inputs.forEach(input => {

    input.addEventListener("focus", () => {

        setTimeout(() => {

            input.select();

        }, 0);

    });

});

// Enter key -> Next Input
inputs.forEach((input, index) => {

    input.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            if (index < inputs.length - 1) {

                inputs[index + 1].focus();

            } else {

                input.blur();

            }

        }

    });

});

// Better Reset
resetBtn.addEventListener("click", () => {

    inputs.forEach(input => {

        input.value = "";

    });

    calculate();

    qtyPerBox.focus();

});

// ========================================
// Service Worker
// ========================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("sw.js")

            .then(() => {

                console.log("Service Worker Registered");

            })

            .catch(error => {

                console.log(error);

            });

    });

}

// ========================================
// PWA Install
// ========================================

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();

    deferredPrompt = e;

    console.log("PWA Install Ready");

});

// Install Function
async function installApp(){

    if(!deferredPrompt){

        alert("Install is not available yet.");

        return;

    }

    deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    console.log(result.outcome);

    deferredPrompt = null;

}

const installBtn = document.getElementById("installBtn");

if(installBtn){

    installBtn.addEventListener("click", () => {

        installApp();

    });

}