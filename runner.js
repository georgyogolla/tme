const fs = require('fs');
const path = require('path');
const chalk = require('chalk');//colors the error messages and correctly executed tests using different colors specified

const forbiddenDirs = ['node_modules']; // varibale initiating directories thats should be ignored
class Runner {
  constructor() {
    this.testFiles = [];
  }

  async runTests() {
    for (let file of this.testFiles){
      console.log(chalk.gray(`---- ${file.shortName}`));
      const beforeEaches = [];
      global.beforeEach = (fn) => {
        beforeEaches.push(fn);
      }
      global.it = (desc, fn) => {
        beforeEaches.forEach(func => func());
        try {
        fn();
        console.log(chalk.green(`\tOK - ${desc}`));
      } catch (err) {
        //better formating and indentation
        const message = err.message.replace(/\n/g, '\n\t\t');

        console.log(chalk.red(`tX - ${desc}`));
        console.log(chalk.red('\t', message));//indents the error message
      }
      };

      //handling errors occuring in the test file and displaying the exact problem
      try {
        require(file.name);// executes the files
      } catch (err) {
        console.log(chalk.red(err));
      }  
    }
  }

  async collectFiles(targetPath) {//collecting all files and folders
    const files = await fs.promises.readdir(targetPath);

    for (let file of files) {
      const filepath = path.join(targetPath, file);
      const stats = await fs.promises.lstat(filepath);

      if (stats.isFile() && file.includes('.test.js')) {
        this.testFiles.push({ name: filepath, shortName: file });
        
        //ignoring forbidden directories
      } else if (stats.isDirectory() && !forbiddenDirs.includes(file)) {
        const childFiles = await fs.promises.readdir(filepath);

        files.push(...childFiles.map(f => path.join(file, f)));
      }
    }
   }
}

module.exports = Runner;