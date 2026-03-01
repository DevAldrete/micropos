const fetch = require('node-fetch');
const FormData = require('form-data');
async function run() {
  const form = new FormData();
  form.append('email', 'test@test.com');
  form.append('password', 'password');
  
  const res = await fetch('http://localhost:3000/login', {
    method: 'POST',
    body: form,
    headers: {
        origin: 'http://localhost:3000',
        referer: 'http://localhost:3000/login'
    }
  });
  console.log(res.status);
  console.log(res.headers.raw()['set-cookie']);
}
run();
