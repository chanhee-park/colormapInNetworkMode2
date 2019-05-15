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
  database.ref('userTest2/' + TEST_DATA.u_id).set(TEST_DATA);
}
