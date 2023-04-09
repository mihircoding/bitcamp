const form = document.getElementById('login');
const url = 'http://localhost:3000/api/loginAuth';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log("wefwef")
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
    window.location.replace("http://localhost:5500/templates/home.html");
  }
   else{
    alert("some error occured try again");
  }
});