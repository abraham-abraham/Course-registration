let form = document.querySelector(".main-drop-info");
let studentIdInput = document.querySelector(".main-drop-info-id-input");
let courseCodeInput = document.querySelector(
  ".main-drop-info-course-code-input"
);
let submit = document.querySelector(".main-drop-info-submit");
let submitValidation = document.querySelector(".main-drop-info-submit-span");

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
  "drop-deadline-passed": "Deadline for droping to this course has passed",
  "already-droped": "You are already droped to this course",
  "server-error": "An error has occurred",
  "not-registered": "You are not registered",
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
    "http://localhost/SOEN-387-assignment1/api/drop-course.php",
    config
  );

  const { data, error } = await response.json();

  if (error) {
    alert(errors[error]);
    return;
  }

  if (!error && data) {
    alert(
      `Successfully dropped ${data.courseCode}. You have ${data.nRegistered} registered courses`
    );
  }
});
