// By default each test has a default timeout of 5 seconds
// After 5 seconds jest exits from the test
// Here i set to 30 seconds
console.log('Running jest.setup.js')
jest.setTimeout(30*1000); // 30 seconds