const fs = require('fs');
const path = require('path');

// Create (auth) route group structure
const authGroupPath = path.join(__dirname, 'app', '(auth)');
const signinPath = path.join(authGroupPath, 'signin');
const signupPath = path.join(authGroupPath, 'signup');

[authGroupPath, signinPath, signupPath].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created: ${dir}`);
  }
});

// Copy signin page
const oldSignin = path.join(__dirname, 'app', 'auth', 'signin', 'page.tsx');
const newSignin = path.join(signinPath, 'page.tsx');
fs.copyFileSync(oldSignin, newSignin);
console.log('Copied signin page');

// Copy signup page
const oldSignup = path.join(__dirname, 'app', 'auth', 'signup', 'page.tsx');
const newSignup = path.join(signupPath, 'page.tsx');
fs.copyFileSync(oldSignup, newSignup);
console.log('Copied signup page');

console.log('\nDone! Now you can delete the old app/auth/* directories manually.');
