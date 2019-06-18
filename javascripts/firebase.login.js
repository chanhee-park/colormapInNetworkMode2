let isLogin = false;

const loginModule = new (function () {
  const thatLoginModule = this;
  // 로그인 수행
  this.login = () => {
    if (isLogin) return;

    const uname = $('input#input-name').val();
    const uage = $('input#input-age').val();
    const ugender = $('input#input-gender').val();
    console.log(uname, uage, ugender);

    if (uname === '_save') {
      downloadCSV();
      return;
    }

    if (uname === '_save2') {
      downloadCSV2();
      return;
    }

    if (uname === '_save3') {
      downloadCSV3();
      return;
    }

    if (uname === '' || uage === '' || ugender === '') {
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
  this.setUserInfo = (id, name, gender, age) => {
    TEST_DATA.u_id = id;
    TEST_DATA.u_name = name;
    TEST_DATA.u_gender = gender;
    TEST_DATA.u_age = age;
    TEST_DATA.u_signed = true;
  };

  // 유저 사항 변경시 (로그인 / 로그아웃) 불리는 함수
  FirebaseAuth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in.
      const uid = user.uid;
      const uname = $('input#input-name').val();
      const uage = $('input#input-age').val();
      const ugender = $('input#input-gender').val();
      console.log(uname, uage, ugender + ' is signed in.');

      thatLoginModule.setUserInfo(uid, uname, ugender, uage);

      if (uname === '_save_csv') {
        saveCSV();
      } else if (uname === '_save_csv_2') {
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
