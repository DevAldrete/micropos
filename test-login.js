const fetch = require('node-fetch');
async function run() {
  const res = await fetch('http://localhost:3333/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@test.com', password: 'password' })
  });
  console.log(res.status);
  console.log(await res.json());
  console.log(res.headers.raw()['set-cookie']);
}
run();
