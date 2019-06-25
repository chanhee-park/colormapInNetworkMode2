let isLogin = false;

const loginModule = new (function () {
  const thatLoginModule = this;
  // 로그인 수행
  this.login = () => {
    const uage = $('input#input-age').val();
    const ugender = $('input#input-gender').val();
    console.log(uage, ugender);

    if (uage === '_save') {
      downloadCSV();
      return;
    }

    if (uage === '_save2') {
      downloadCSV2();
      return;
    }

    if (uage === '_save3') {
      downloadCSV3();
      return;
    }

    if (uage === '' || ugender === '') {
      alert('Please Enter Correct Values');
      return;
    }

    FirebaseAuth.signInAnonymously().catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      app.loginButtonLocked = false;
      alert('Something is wrong. T ___ T\n' + errorCode + '\n' + errorMessage);
    });
  };

  // 로그아웃 수행
  this.logout = () => {
    FirebaseAuth.signOut().catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('Something is wrong. T ___ T\n' + errorCode + '\n' + errorMessage);
    });
  };

  // 유저 정보 저장
  this.setUserInfo = (id, gender, age) => {
    TEST_DATA.u_id = id;
    TEST_DATA.u_gender = gender;
    TEST_DATA.u_age = age;
    TEST_DATA.u_signed = true;
  };

  // 유저 사항 변경시 (접속 / 로그인 / 로그아웃) 불리는 함수
  FirebaseAuth.onAuthStateChanged(user => {
    if (isLogin) {
      return;
    }

    if (user) {
      // User is signed in.
      isLogin = true;

      const uid = user.uid;
      const uage = $('input#input-age').val();
      const ugender = $('input#input-gender').val();
      console.log(uage, ugender + ' is signed in.');

      thatLoginModule.setUserInfo(uid, ugender, uage);

      if (uage === '_save_csv') {
        saveCSV();
      } else if (uage === '_save_csv_2') {
        saveCSV2();
      }

      Start();
    } else {
      // User is signed out.
    }
  });
  return this;
})();

$('#login-button').click(() => {
  loginModule.login();
});
