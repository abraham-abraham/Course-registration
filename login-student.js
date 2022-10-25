let form = document.querySelector('.main-register-info');
let firstName = document.querySelector('.main-register-info-firstName-input');
let lastName = document.querySelector('.main-register-info-lastName-input');
let studentID = document.querySelector(
  '.main-register-info-studentID-input');
let submit = document.querySelector('.main-register-info-submit'
);
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
    body: JSON.stringify({ studentID: studentID.value }), // body data type must match "Content-Type" header
  };

  const response = await fetch(
    'http://localhost/SOEN-387-assignment1/api/login-student.php',
    config
  );

  const { data, error } = await response.json();

  if (error === 'server-error') {
    alert('An error has occurred');
    return;
  }

  if (!error && data && data.length === 0) {
    alert(`There is no studentID of ${studentID.value} in the database`);
  } else {
    alert(
      `The employmentID (${data[0].studentID}) exists in the database\nYou are an student!\nYou will be redirected to enroll in a course`
    );
    window.localStorage.setItem('studentID', data[0].studentID);
    window.location.replace(
      'http://localhost/SOEN-387-assignment1/enroll-course.html'
    );
  }
});
