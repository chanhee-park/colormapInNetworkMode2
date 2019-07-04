let TEST_DATA = {
  u_id: '',
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
  console.log('DownloadCSV1');
  database
    .ref('/userTest3')
    .once('value')
    .then(function (snapshot) {
      const retArr = [];
      const testResults = snapshot.val();
      const colName = [
        'create_time',
        'user_id',
        'age',
        'gender',
        'color_blindness',
        'data',
        'colormap',
        'NodeAttributes',
        'span',
        'isCorrect',
        'time',
        'luminance_left_C.Node',
        'luminance_right_C.Node',
        'luminance_target',
        'TargetNode_value',
        'ComparisonNode_right',
        'ComparisonNode_left',
      ];
      retArr.push(colName);
      _.forEach(testResults, r => {
        if (r.u_loginTime > 1561912032240) {
          _.forEach(r.test, t => {
            const row = [];
            row.push(new Date(r.u_loginTime).toString());
            row.push(r.u_id);
            row.push(r.u_age);
            row.push(r.u_gender);
            row.push(r.u_colorblind);
            row.push(t.dataName);
            row.push(t.colormap);
            row.push(t.refCentrality);
            row.push(t.span);
            row.push(t.isCorrect);
            row.push(t.elapsedTime);
            row.push(t.compare1Value < t.compare2Value ? t.compare1Lum : t.compare2Lum);
            row.push(t.compare1Value < t.compare2Value ? t.compare2Lum : t.compare1Lum);
            row.push(t.targetLum);
            row.push(t.targetValue);
            row.push(t.compare1Value < t.compare2Value ? t.compare2Value : t.compare1Value);
            row.push(t.compare1Value < t.compare2Value ? t.compare1Value : t.compare2Value);
            retArr.push(row);
          });
        }
      });
      const csv = arrayToCSV(retArr);
      console.log(csv);
    });
}

function downloadCSV2 () {
  console.log('downloadCSV2');
  database
    .ref('/userTest3')
    .once('value')
    .then(function (snapshot) {
      const testResults = snapshot.val();
      const colName = [
        'create_time',
        'user_id',
        'age',
        'gender',
        'color_blindness',
        'data',
        'NodeAttributes',
        'span',
        'rainbow-c',
        'rainbow-t',
        'divergent-c',
        'divergent-t',
        'blue-c',
        'blue-t',
        'viridis-c',
        'viridis-t',
      ];
      const retColection = [];
      _.forEach(testResults, r => {
        if (r.u_loginTime > 1561912032240) {
          _.forEach(r.test, t => {
            const row = {};
            row.created_time = (new Date(r.u_loginTime).toString())
            row.u_id = (r.u_id);
            row.u_age = (r.u_age);
            row.u_gender = (r.u_gender);
            row.u_colorblind = (r.u_colorblind);
            row.dataName = (t.dataName);
            row.NodeAttributes = (t.refCentrality);
            row.span = (t.span);
            row.colormap = (t.colormap);
            row.isCorrect = (t.isCorrect);
            row.elapsedTime = (t.elapsedTime);
            retColection.push(row);
          });
        }
      });
      const retArr = [];
      retArr.push(colName);
      const sorted = _.sortBy(retColection, ['u_id', 'dataName', 'NodeAttributes', 'span', 'colormap']);
      for (let i = 0; i < sorted.length; i += 4) {
        const val_jet = _.values(sorted[i]);
        const val_rb = _.values(sorted[i + 1]);
        const val_blue = _.values(sorted[i + 2]);
        const val_viridis = _.values(sorted[i + 3]);
        let row = val_jet.slice(0, 8)
          .concat(val_jet.slice(9, 11))
          .concat(val_rb.slice(9, 11))
          .concat(val_blue.slice(9, 11))
          .concat(val_viridis.slice(9, 11));
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