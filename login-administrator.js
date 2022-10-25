let form = document.querySelector('.main-register-info');
let firstName = document.querySelector('.main-register-info-firstName-input');
let lastName = document.querySelector('.main-register-info-lastName-input');
let employmentID = document.querySelector(
  '.main-register-info-employmentID-input'
);
let submit = document.querySelector('.main-register-info-submit');
let submitValidation = document.querySelector(
  '.main-register-info-submit-span'
);
let button = document.querySelector('button');

button.addEventListener('click', async (event) => {
  event.preventDefault();

  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ employmentID: employmentID.value }), // body data type must match "Content-Type" header
  };

  const response = await fetch(
    'http://localhost/SOEN-387-assignment1/api/login-administrator.php',
    config
  );

  const { data, error } = await response.json();

  if (error === 'server-error') {
    alert('An error has occurred');
    return;
  }

  if (!error && data && data.length === 0) {
    alert(`There is no employmentID of ${employmentID.value} in the database`);
  } else {
    alert(
      `The employmentID (${data[0].employmentID}) exists in the database\nYou are an administrator!\nYou will be redirected to create an course`
    );
    window.localStorage.setItem('employmentID', data[0].employmentID);
    window.location.replace(
      'http://localhost/SOEN-387-assignment1/create-course.html'
    );
  }
});
