const gsjson = require('google-spreadsheet-to-json');
const fs = require('fs');
const config = require('./config');

if (Array.isArray(config.spreadsheetId)) {
  const cacheArr = [];
  Promise.all(
    config.spreadsheetId.map(id => {
      return gsjson({
        ...config,
        spreadsheetId: id
      })
      .then((result) => {
        cacheArr.push(concatArrays(result));
      })
    })
  )
    .then(() => {
      saveFile(sortingQuestions(concatArrays(cacheArr)));
    })
    .catch((err) => {
      console.error(err.message);
      console.error(err.stack);
    });
} else {
  gsjson(config)
    .then((result) => {
      saveFile(sortingQuestions(concatArrays(result)));
    })
    .catch((err) => {
        console.error(err.message);
        console.error(err.stack);
    });
}

function concatArrays(array) {
  var res=[];
	for (var i=0; i<array.length; i++) {
		if (!array[i]) {continue}
		if (!Array.isArray(array[i])) {
			res.push(array[i]);
		} else {
			res=[...res, ...concatArrays(array[i])];
		}
	}
	return res;
}

function saveFile(arr) {
  fs.writeFile('questionPacks.json', JSON.stringify(arr), 'utf8', (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('Generated \'questionPacks.json\'');
  });
}

function sortingQuestions(questionsArray, options) {
  // here place for your buisiness logic code
  // also you can add the options, like 'countOfQuestionsInPack' 'maxScoreInPack' 'totalScoreLimit' etc
  return questionsArray;
}