const form = document.querySelector('form');
const url = 'http://localhost:3000/api/signupsubmit';
console.log('something')

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log('efqefqeg')

  const formData = new FormData(form);
  const body = new URLSearchParams(formData).toString();
  console.log(body);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  });

  if (response.status == 200) {
    accountCreated();

  }
  else if (response.status == 204){
    alert("you have an account already");
  } else{
    alert("some error occured try again");
  }
});

function accountCreated() {
  var tabContent = document.getElementById("tab-content");
  var exists = document.getElementById("exists");
  if (exists.value) 
    tabContent.style.display = "block";
}