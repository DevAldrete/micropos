const fetch = require('node-fetch');
const FormData = require('form-data');
async function run() {
  const form = new FormData();
  form.append('email', 'test@test.com');
  form.append('password', 'password');
  
  const headers = form.getHeaders();
  headers['origin'] = 'http://localhost:3000';
  headers['referer'] = 'http://localhost:3000/login';
  
  const res = await fetch('http://localhost:3000/login?/default', {
    method: 'POST',
    body: form,
    headers: headers
  });
  console.log(res.status);
  console.log(await res.text());
}
run();
