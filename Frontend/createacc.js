const form = document.querySelector('form');
const url = 'http://localhost:3000/api/signupsubmit';

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const body = new URLSearchParams(formData).toString();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  });

  if (response.status == 200) {
    const data = await response.json();
    console.log(data); // logs the response from the backend
  }
  else if (response.status == 204){
    alert("you have an account already");
  } else{
    alert("some error occured try again");
  }
});