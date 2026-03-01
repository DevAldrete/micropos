const fetch = require('node-fetch');
const FormData = require('form-data');

async function run() {
  console.log("1. Logging in...");
  const form = new FormData();
  form.append('email', 'test@test.com');
  form.append('password', 'password');
  
  const headers = form.getHeaders();
  headers['origin'] = 'http://localhost:3000';
  headers['host'] = 'localhost:3000';
  // Fake SvelteKit submission to avoid CSRF error
  headers['x-sveltekit-action'] = 'true';
  
  const res = await fetch('http://localhost:3000/login?/default', {
    method: 'POST',
    body: form,
    headers: headers,
    redirect: 'manual'
  });
  
  console.log('Login Status:', res.status);
  const cookies = res.headers.raw()['set-cookie'];
  console.log('Cookies:', cookies);
  
  if (!cookies) return;
  
  // Format cookies for next request
  const cookieStr = cookies.map(c => c.split(';')[0]).join('; ');
  
  console.log("\n2. Fetching /dashboard with cookies...");
  const res2 = await fetch('http://localhost:3000/dashboard', {
    headers: {
      'cookie': cookieStr,
      'host': 'localhost:3000'
    },
    redirect: 'manual'
  });
  
  console.log('Dashboard Status:', res2.status);
  console.log('Dashboard Location:', res2.headers.get('location'));
}
run();
