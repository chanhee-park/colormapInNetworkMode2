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

function writeData () {
  console.warn('Write Test Data :', TEST_DATA);
  database.ref('userTest3/' + TEST_DATA.u_id).set(TEST_DATA);
}

function downloadCSV () {
  console.log('Download');
  database
    .ref('/userTest2')
    .once('value')
    .then(function (snapshot) {
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

function downloadCSV2 () {
  console.log('downloadCSV2');
  database
    .ref('/userTest2')
    .once('value')
    .then(function (snapshot) {
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
        'span-15',
        'span-40',
        'correct',
        'time',
      ];
      const retColection = [];
      _.forEach(testResults, r => {
        _.forEach(r.test, t => {
          if (
            t.dataName !== 'karate' &&
            t.dataName !== 'dolphins' &&
            r.u_loginTime > 1558931483610
          ) {
            const row = {};
            row.u_loginTime = r.u_loginTime;
            row.u_id = (r.u_id);
            row.u_name = (r.u_name);
            row.u_age = (r.u_age);
            row.u_gender = (r.u_gender);
            row.u_colorblind = (r.u_colorblind);
            row.dataName = (t.dataName);
            row.colormap = (t.colormap);
            row.refCentrality = (t.refCentrality);
            row.span = (t.span);
            row.isCorrect = (t.isCorrect);
            row.elapsedTime = (t.elapsedTime);
            retColection.push(row);
          }
        });
      });

      const retArr = [];
      retArr.push(colName);
      const sorted = _.sortBy(retColection, ['u_id', 'dataName', 'colormap', 'refCentrality', 'span']);
      for (let i = 0; i < sorted.length; i += 2) {
        const val15 = _.values(sorted[i]);
        const val40 = _.values(sorted[i + 1]);
        let row = val15.slice(0, 9).concat([true, false]).concat(val15.slice(10, 12))
        retArr.push(row);
        row = val40.slice(0, 9).concat([false, true]).concat(val40.slice(10, 12))
        retArr.push(row);
      }
      const csv = arrayToCSV(retArr);
      console.log(csv);
    });
}

function downloadCSV3 () {
  console.log('downloadCSV3');
  database
    .ref('/userTest2')
    .once('value')
    .then(function (snapshot) {
      const testResults = snapshot.val();
      const colName = [
        'user_id',
        'username',
        'color_blindness',
        'data',
        'centrality',
        'span',
        'blue-c',
        'blue-t',
        'rainbow-c',
        'rainbow-t',
        'viridis-c',
        'viridis-t',
        'divergent-c',
        'divergent-t',
      ];
      const retColection = [];
      _.forEach(testResults, r => {
        _.forEach(r.test, t => {
          if (
            t.dataName !== 'karate' &&
            t.dataName !== 'dolphins' &&
            r.u_loginTime > 1558931483610
          ) {
            const row = {};
            row.u_id = (r.u_id);
            row.u_name = (r.u_name);
            row.u_colorblind = (r.u_colorblind);
            row.dataName = (t.dataName);
            row.refCentrality = (t.refCentrality);
            row.span = (t.span);
            row.colormap = (t.colormap);
            row.isCorrect = (t.isCorrect);
            row.elapsedTime = (t.elapsedTime);
            retColection.push(row);
          }
        });
      });

      const retArr = [];
      retArr.push(colName);
      const sorted = _.sortBy(retColection, ['u_id', 'dataName', 'refCentrality', 'span', 'colormap']);

      for (let i = 0; i < sorted.length; i += 4) {
        const val_div = _.values(sorted[i]);
        const val_rain = _.values(sorted[i + 1]);
        const val_blue = _.values(sorted[i + 2]);
        const val_viridis = _.values(sorted[i + 3]);

        let row = val_blue.slice(0, 6)
          .concat(val_blue.slice(7, 9))
          .concat(val_rain.slice(7, 9))
          .concat(val_viridis.slice(7, 9))
          .concat(val_div.slice(7, 9));
        retArr.push(row);
      }
      const csv = arrayToCSV(retArr);
      console.log(csv);
    });
}


function arrayToCSV (twoDiArray) {
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
