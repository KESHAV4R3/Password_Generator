
// HTML elements
const slider = document.querySelector('#slider');
const password_display = document.querySelector('.password_display');
const password_length_display = document.querySelector('#password_length');
const strength_color = document.querySelector('.strength_color');
const check_uppercase = document.querySelector('#check_uppercase');
const check_lowercase = document.querySelector('#check_lowercase');
const check_number = document.querySelector('#check_number');
const check_symbols = document.querySelector('#check_symbols');
const password_copy_button = document.querySelector('.password_copy_button');
const password_copied_text = document.querySelector('.password_copied_text');
const allcheckBox = document.querySelectorAll('input[type=checkbox]');
const generate_password_button = document.querySelector('.generate_password_button');

// setting default values
check_uppercase.checked = true;

// variables
let password = "";
let password_length = 10;
let checkboxCount = 1;

// function to manage slider
function manageSlider() {
    slider.value = password_length;
    password_length_display.textContent = password_length;

    // logic to set the slider color as per range
    const min = parseInt(slider.min);
    const max = parseInt(slider.max);
    slider.style.backgroundSize = ((password_length - min) * 100 / (max - min)) + "% 100%";
}
manageSlider();

// function to generate random integer (between min to max)
function generateRndInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// function to generate random numbers
function getNumber() {
    return generateRndInt(0, 9);
}

// function to genetare reandom upper-case
function getUpperCase() {
    return String.fromCharCode(generateRndInt(65, 90));
}

// function to generate random lower-case
function getLowerCase() {
    return String.fromCharCode(generateRndInt(97, 122));
}

// function to generate special character
function getCharacter() {
    let data = "!@#$%^&*()_+-=}{][:'><.,?/|`~'\'";
    return data.charAt(generateRndInt(0, data.length - 1));
}

// function to show the strength
function strength(color) {
    strength_color.style.backgroundColor = color;
    strength_color.style.boxShadow = `0px 0px 20px ${color}`;
}

// function to calculate the strength and return the color as per strength
function strength_calculate() {

    // returning the color as per checked that show the strength of the password
    if (check_uppercase.checked && check_lowercase.checked && (check_symbols.checked || check_number.checked) && password_length >= 8) {
        // password strength is green color means very-strong
        return "#0f0";
    }
    else if ((check_uppercase.checked || check_lowercase.checked) && (check_symbols.checked || check_number.checked) && password_length >= 6) {
        // password strength is yellow color means less-strong
        return '#ff0';
    }
    else {
        // password strength is red color means very-less-strong
        return '#f00';
    }
}

// function to copy the password text 
async function copyTextdisplay() {
    try {
        await navigator.clipboard.writeText(password_display.value);
        password_copied_text.textContent = "copied";
    }
    catch (e) {
        password_copied_text.textContent = "failed";
    }

    // once the message gets coppied
    // the text wil get displayed
    password_copied_text.classList.add("active");

    // the message gets dissapera after 2 seconds
    setTimeout(() => {
        password_copied_text.classList.remove("active");
    }, 2000);
}

// event listners

function handleCheckboxChange() {
    checkboxCount = 0;
    allcheckBox.forEach((checkBox) => {
        if (checkBox.checked) {
            checkboxCount++;
        }
    });
    // special condition

    if (password_length < checkboxCount) {
        password_length = checkboxCount;
        manageSlider();
    }
}

// via loop we have applied event listner to all the checkboxes
allcheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})

slider.addEventListener('input', () => {
    password_length = slider.value;
    manageSlider();
})

password_copy_button.addEventListener('click', () => {
    if (password_display.value) {
        copyTextdisplay();
    }
})

generate_password_button.addEventListener('click', () => {
    if (checkboxCount > 0) {
        // remove all existing password 
        password = "";

        let funcArr = [];

        if (check_uppercase.checked) {
            funcArr.push(getUpperCase);
        }
        if (check_lowercase.checked) {
            funcArr.push(getLowerCase);
        }
        if (check_number.checked) {
            funcArr.push(getNumber);
        }
        if (check_symbols.checked) {
            funcArr.push(getCharacter);
        }
        // compulsory addition
        for (i = 0; i < funcArr.length; i++) {
            password += funcArr[i]();
        }
        // adding remaining addition
        for (i = 0; i <= password_length - funcArr.length; i++) {
            let randomInt = generateRndInt(0, funcArr.length);
            password += funcArr[randomInt]();
        }

        // now we have to resuffle the created password
        let tempPassword = "";
        let looplength = password_length;
        for (i = 0; i < looplength; i++) {
            let rndInteger = generateRndInt(0, password.length - 1);
            tempPassword += password.charAt(rndInteger);
            password = password.replace(password.charAt(rndInteger), "");
        }
        password = tempPassword;

        // display over the UI
        password_display.value = password;

        // show the strength
        strength(strength_calculate());
    }
    else {
        alert("no box is checked !! ");
    }
})