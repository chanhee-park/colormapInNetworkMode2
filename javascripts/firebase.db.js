let TEST_DATA = {
  u_id: '',
  u_name: '',
  u_gender: '',
  u_age: '',
  u_loginTime: Date.now(),
  u_signed: false,
  u_colorblind: false,
  test: []
};

function writeData() {
  console.warn('Write Test Data :', TEST_DATA);
  database.ref('userTest2/' + TEST_DATA.u_id).set(TEST_DATA);
}

function downloadCSV() {
  console.log('Download');
  database
    .ref('/userTest2')
    .once('value')
    .then(function(snapshot) {
      const retArr = [];
      const testResults = snapshot.val();
      const colName = [
        'startTime',
        'user_id',
        'username',
        'age',
        'gender',
        'color_blindness',
        'data',
        'colormap',
        'refCentrality',
        'span',
        'isCorrect',
        'time'
      ];
      retArr.push(colName);
      _.forEach(testResults, r => {
        _.forEach(r.test, t => {
          if (
            t.dataName !== 'karate' &&
            t.dataName !== 'dolphins' &&
            r.u_loginTime > 1558931483610
          ) {
            console.log(t.dataName);
            const row = [];
            row.push(r.u_loginTime);
            row.push(r.u_id);
            row.push(r.u_name);
            row.push(r.u_age);
            row.push(r.u_gender);
            row.push(r.u_colorblind);
            row.push(t.dataName);
            row.push(t.colormap);
            row.push(t.refCentrality);
            row.push(t.span);
            row.push(t.isCorrect);
            row.push(t.elapsedTime);
            retArr.push(row);
          }
        });
      });
      const csv = arrayToCSV(retArr);
      console.log(csv);
    });
}

function arrayToCSV(twoDiArray) {
  //  Modified from: http://stackoverflow.com/questions/17836273/
  //  export-javascript-data-to-csv-file-without-server-interaction
  const csvRows = [];
  for (let i = 0; i < twoDiArray.length; ++i) {
    for (let j = 0; j < twoDiArray[i].length; ++j) {
      twoDiArray[i][j] = '"' + twoDiArray[i][j] + '"';
    }
    csvRows.push(twoDiArray[i].join(','));
  }

  let csvString = csvRows.join('\r\n');
  let a = document.createElement('a');
  a.href = 'data:attachment/csv,' + csvString;
  a.target = '_blank';
  a.download = 'test_colormap.csv';

  document.body.appendChild(a);
  a.click();

  return csvString;
  // Optional: Remove <a> from <body> after done
}
