let form = document.querySelector(".main-register-info");
let studentIdInput = document.querySelector(".main-register-info-id-input");
let courseCodeInput = document.querySelector(
  ".main-register-info-course-code-input"
);
let submit = document.querySelector(".main-register-info-submit");
let submitValidation = document.querySelector(
  ".main-register-info-submit-span"
);

const isnum = (val) => /^\d+$/.test(val);

function eventHandler() {
  if (
    studentIdInput.value &&
    isnum(studentIdInput.value) &&
    courseCodeInput.value
  ) {
    submit.disabled = false;
    submitValidation.style.display = "inline";
  } else {
    submit.disabled = true;
    submitValidation.style.display = "none";
  }
}

form.addEventListener("keyup", eventHandler);

const errors = {
  "invalid-student-id": "Student id does not exist",
  "invalid-course-code": "Course code does not exist",
  "register-limit-reached": "You cannot register more than 5 courses",
  "register-deadline-passed":
    "Deadline for registering to this course has passed",
  "already-registered": "You are already registered to this course",
  "server-error": "An error has occurred",
};

submit.addEventListener("click", async (event) => {
  event.preventDefault();

  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      studentID: studentIdInput.value,
      courseCode: courseCodeInput.value,
    }), // body data type must match "Content-Type" header
  };

  const response = await fetch(
    "http://localhost/SOEN-387-assignment1/api/enroll-course.php",
    config
  );

  const { data, error } = await response.json();

  if (error) {
    alert(errors[error]);
    return;
  }

  if (!error && data) {
    alert(
      `Successfully registered to ${data.courseCode}. You have ${data.nRegistered} registered courses`
    );
  }
});
