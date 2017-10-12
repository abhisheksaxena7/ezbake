const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const cwd = path.resolve(process.cwd());

module.exports = {
  createEnvFile,
  walkSync,
  checkForExistingFolder
};

function createEnvFile(ui, projectName, answers) {
  const pathToEnvFile = path.join(cwd, `./${projectName}/.env`);
  let contents = Object.keys(answers)
    .map(answerKey => {
      return `${answerKey}=${answers[answerKey]}\n`;
    })
    .reduce((previous, current) => {
      return previous.concat(current);
    }, '');

  fs.writeFileSync(pathToEnvFile, contents, { encoding: 'utf8' });
  ui.log.write(`. Wrote ${pathToEnvFile} successfully`);
}

function walkSync(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(file => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      filelist.push({ path: path.join(dir, file), name: file });
    }
  });
  return filelist;
}

async function checkForExistingFolder(ui, projectName) {
  return new Promise((resolve, reject) => {
    let directory = path.join(cwd, `./${projectName}`);
    let directoryExists = fs.existsSync(directory);
    if (directoryExists) {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'projectName',
            message: `${directory} already exists. Please specify a new name. If you keep the current name, it will be deleted.`,
            default: `${projectName}`,
            filter: val => {
              return val
                .replace(/\W+/g, ' ') // alphanumerics only
                .trimRight()
                .replace(/ /g, '-')
                .toLowerCase();
            }
          }
        ])
        .then(directoryAnswers => {
          if (directoryAnswers.projectName === projectName) {
            const rm = spawn('rm', [`-rf`, directory]);
            rm.on('close', code => {
              if (code !== 0) {
                return reject(
                  `We've had problems removing the ${directory}. Do you have enough permissions to delete it?`
                );
              }
              ui.log.write(`! Deleted ${directory}`);
              return resolve(projectName);
            });
          } else {
            return resolve(directoryAnswers.projectName);
          }
        });
    } else {
      return resolve(projectName);
    }
  });
}
