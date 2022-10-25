let form = document.querySelector(".main-register-info");
let submit = document.querySelector(".main-register-info-submit");
let id = document.querySelector(".main-register-info-id-input");
let courseCode = document.querySelector(
  ".main-register-info-course-code-input"
);
let courseTitle = document.querySelector(".main-register-info-title-input");
let semester = document.querySelector(".main-register-info-semester-input");
let days = document.querySelector(".main-register-info-days-input");
let courseTime = document.querySelector(".main-register-info-courseTime-input");
let instructor = document.querySelector(".main-register-info-instructor-input");
let startDate = document.querySelector(".main-register-info-startDate-input");
let endDate = document.querySelector(".main-register-info-endDate-input");
let room = document.querySelector(".main-register-info-room-input");

const errors = {
  unauthorized: "You are not an administrator",
  "server-error": "An error has occurred",
  "course-exists": "This course code already exists",
  "invalid-course-code": "This course code does not exist",
  "invalid-student-id": "This studentID does not exist",
};

// Reports
// List of students per course
let formStudentList = document.querySelector(
  ".main-information-student-list-form"
);
let employmentIDStudentList = document.querySelector(
  ".main-information-student-list-employmentID-input"
);
let courseCodeStudentList = document.querySelector(
  ".main-information-student-list-course-code-input"
);
let submitStudentList = document.querySelector(
  ".main-information-student-list-submit"
);
// List of courses per student
let formCourseList = document.querySelector(
  ".main-information-course-list-form"
);
let employmentIDCourseList = document.querySelector(
  ".main-information-course-list-employmentID-input"
);
let studentIDCourseList = document.querySelector(
  ".main-information-course-list-studentID-input"
);
let submitCourseList = document.querySelector(
  ".main-information-course-list-form-submit"
);

//enable button -- student list
formStudentList.addEventListener("keyup", (event) => {
  submitStudentList.disabled = !(
    employmentIDStudentList.value && courseCodeStudentList.value
  );
});
//enable button -- course list
formCourseList.addEventListener("keyup", (event) => {
  submitCourseList.disabled = !(
    employmentIDCourseList.value && studentIDCourseList.value
  );
});

//post request -- student list
submitStudentList.addEventListener("click", async (event) => {
  event.preventDefault();
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employmentID: employmentIDStudentList.value,
      courseCode: courseCodeStudentList.value,
    }),
  };

  const response = await fetch(
    "http://localhost/SOEN-387-assignment1/api/students-by-course.php",
    config
  );

  const { data, error } = await response.json();

  if (error) {
    alert(errors[error]);
  }

  if (!error && data) {
    let students = [];
    console.log(data);
    for (const key in data) {
      students[
        key
      ] = `${data[key].firstName} ${data[key].lastName} (id: ${data[key].studentID})`;
    }
    alert(students.join("\n"));
    // alert(data.join("\n"));
  }
});

//post request -- course list
submitCourseList.addEventListener("click", async (event) => {
  event.preventDefault();
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employmentID: employmentIDCourseList.value,
      studentID: studentIDCourseList.value,
    }),
  };

  const response = await fetch(
    "http://localhost/SOEN-387-assignment1/api/courses-by-student.php",
    config
  );

  const { data, error } = await response.json();

  if (error) {
    alert(errors[error]);
  }

  if (!error && data) {
    let courses = [];
    for (const key in data) {
      courses[key] = data[key].courseCode;
    }
    alert(courses.join("\n"));
  }
});

//---------------------------------------------

const isnum = (val) => /^\d+$/.test(val);

const onFormChange = () => {
  let startDateObject = new Date(startDate.value);
  let endDateObject = new Date(endDate.value);

  if (startDateObject.getTime() > endDateObject.getTime()) {
    alert("Start date is after end date. Please adjust accordingly");
    startDate.value = "";
    endDate.value = "";
  }

  submit.disabled = !(
    id.value &&
    isnum(id.value) &&
    courseCode.value &&
    semester.value &&
    days.value &&
    courseTime.value &&
    courseTitle.value &&
    instructor.value &&
    room.value &&
    startDate.value &&
    endDate.value
  );
};

form.addEventListener("change", onFormChange);
form.addEventListener("keyup", onFormChange);

submit.addEventListener("click", async (event) => {
  event.preventDefault();
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id.value,
      courseCode: courseCode.value,
      title: courseTitle.value,
      semester: semester.value,
      days: days.value,
      courseTime: courseTime.value,
      instructor: instructor.value,
      room: room.value,
      startDate: startDate.value,
      endDate: endDate.value,
    }),
  };

  const response = await fetch(
    "http://localhost/SOEN-387-assignment1/api/create-course.php",
    config
  );
  // console.log()

  const { data, error } = await response.json();

  console.log(data);
  if (error) {
    alert(errors[error]);
  }

  if (!error && data) {
    alert(`Course ${data} successfully created`);
  }
});
