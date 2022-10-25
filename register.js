//Set up DOM
let form = document.querySelector('.main-register-info');
let role = document.querySelector('.main-register-info-role-select');
let firstName = document.querySelector('.main-register-info-firstName-input');
let lastName = document.querySelector('.main-register-info-lastName-input');
let address = document.querySelector('.main-register-info-address-input');
let email = document.querySelector('.main-register-info-email-input');
let phoneNumber = document.querySelector(
  '.main-register-info-phoneNumber-input'
);
let dateOfBirth = document.querySelector(
  '.main-register-info-dateOfBirth-input'
);

let phoneNumberValidation = document.querySelector(
  '.main-register-info-phoneNumber-validation'
);
let emailValidation = document.querySelector(
  '.main-register-info-email-validation'
);
let submit = document.querySelector('.main-register-info-submit');
let submitValidation = document.querySelector(
  '.main-register-info-submit-span'
);

// Check if phone number is good
phoneNumber.addEventListener('keyup', (event) => {
  if (validePhoneNumber(phoneNumber.value)) {
    phoneNumberValidation.style.display = 'inline';
  } else phoneNumberValidation.style.display = 'none';
});

// Check if email is good
email.addEventListener('keyup', (event) => {
  if (validateEmail(email.value)) {
    emailValidation.style.display = 'inline';
  } else emailValidation.style.display = 'none';
});

form.addEventListener('change', eventHandler);
form.addEventListener('keyup', eventHandler);

function eventHandler() {
  if (
    validateEmail(email.value) &&
    validePhoneNumber(phoneNumber.value) &&
    role.value &&
    firstName.value &&
    lastName.value &&
    address.value &&
    email.value &&
    dateOfBirth.value
  ) {
    submit.disabled = false;
    submitValidation.style.display = 'inline';
  } else {
    submit.disabled = true;
    submitValidation.style.display = 'none';
  }
}

// Validate phone number
function validePhoneNumber(input_str) {
  let re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return re.test(input_str);
}
//validate email
function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

submit.addEventListener('click', async (event) => {
  event.preventDefault();

  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      role: role.value,
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      dateOfBirth: dateOfBirth.value,
    }), // body data type must match "Content-Type" header
  };

  const response = await fetch(
    'http://localhost/SOEN-387-assignment1/api/register.php',
    config
  );

  const { data, error } = await response.json();

  if (error === 'server-error') {
    alert('An error has occurred');
    return;
  }

  if (error === 'user-exists') {
    alert('Email already exists');
    return;
  }

  if (!error && data) {
    alert(`You have been registered. Your id is ${data}`);
    window.localStorage.setItem('id', data);
    window.localStorage.setItem('role', role.value);
    if (role.value === 'administrator') {
      window.location.replace(
        'http://localhost/SOEN-387-assignment1/create-course.html'
      );
    } else {
      window.location.replace(
        'http://localhost/SOEN-387-assignment1/enroll-course.html'
      );
    }
  }
});
