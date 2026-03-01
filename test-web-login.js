const fetch = require('node-fetch');
const FormData = require('form-data');
async function run() {
  const form = new FormData();
  form.append('email', 'test@test.com');
  form.append('password', 'password');
  
  const headers = form.getHeaders();
  headers['origin'] = 'http://localhost:3000';
  headers['host'] = 'localhost:3000';
  
  const res = await fetch('http://localhost:3000/login?/default', {
    method: 'POST',
    body: form,
    headers: headers,
    redirect: 'manual'
  });
  console.log('Status:', res.status);
  console.log('Set-Cookie:', res.headers.raw()['set-cookie']);
  console.log('Location:', res.headers.get('location'));
}
run();
