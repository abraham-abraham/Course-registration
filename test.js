async function test1() {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      employmentID: 7,
      courseCode: 'SOEN 331',
    }),
  };

  const response = await fetch(
    'http://localhost/SOEN-387-assignment1/api/students-by-course.php',
    config
  );

  const { data, error } = await response.json();
  console.log(data, error);
}

async function test2() {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      employmentID: 7,
      studentID: 2,
    }),
  };

  const response = await fetch(
    'http://localhost/SOEN-387-assignment1/api/courses-by-student.php',
    config
  );

  const { data, error } = await response.json();
  console.log(data, error);
}

test1();
test2();
