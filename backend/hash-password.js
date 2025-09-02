const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('--- Admin Password Hash Generator ---');
rl.question('Enter the password you want to use for your admin account: ', (password) => {
  if (!password) {
    console.error('Password cannot be empty.');
    rl.close();
    return;
  }
  
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
    } else {
      console.log('\n✅ Password hashed successfully!');
      console.log('\nCopy the following hash and use it in your SQL UPDATE statement:');
      console.log('----------------------------------------------------');
      console.log(hash);
      console.log('----------------------------------------------------');
    }
    rl.close();
  });
});

