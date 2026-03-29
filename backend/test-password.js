const { hashPassword, comparePassword } = require('./src/utils/password');

async function testPassword() {
  try {
    const password = 'password123';
    console.log('Original password:', password);
    
    const hashedPassword = await hashPassword(password);
    console.log('Hashed password:', hashedPassword);
    
    const isMatch = await comparePassword(password, hashedPassword);
    console.log('Password match:', isMatch);
    
    const isMatchWrong = await comparePassword('wrongpassword', hashedPassword);
    console.log('Wrong password match:', isMatchWrong);
  } catch (error) {
    console.error('Error:', error);
  }
}

testPassword();