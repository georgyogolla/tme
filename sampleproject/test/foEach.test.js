const assert = require('assert');
const { forEach } = require('../index');

let numbers;
beforeEach(() => {
  numbers = [1,2,3];
})

it('should sum an array', () => {
  let total = 0;
  forEach(numbers, (value) => {
    total += value;
  });
  assert.strictEqual(total, );
  numbers.push(3);
  numbers.push(4);
  numbers.push(5)
});

it('beforeEach is ran each time', () => {
  assert.strictEqual(numbers.length, 3);
})
