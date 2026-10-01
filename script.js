// ==================================================
// PAWPASTEL
// LOGIN + REGISTER
// ==================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("JavaScript PawPastel aktif");


    // ==================================================
    // AMBIL ELEMENT
    // ==================================================

    const loginPage =
        document.getElementById("loginPage");

    const registerPage =
        document.getElementById("registerPage");

    const mainPage =
        document.getElementById("mainPage");


    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");


    const username =
        document.getElementById("username");

    const password =
        document.getElementById("password");


    const newUsername =
        document.getElementById("newUsername");

    const newPassword =
        document.getElementById("newPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");


    const loginMessage =
        document.getElementById("loginMessage");

    const registerMessage =
        document.getElementById("registerMessage");


    const registerButton =
        document.getElementById("registerButton");

    const backLogin =
        document.getElementById("backLogin");


    const logoutButton =
        document.getElementById("logoutButton");


    const userDisplay =
        document.getElementById("userDisplay");


    // ==================================================
    // CEK
    // ==================================================

    console.log("loginForm:", loginForm);
    console.log("registerForm:", registerForm);


    // ==================================================
    // TOMBOL REGISTER
    // ==================================================

    registerButton.onclick = function () {

        loginPage.classList.add("hidden");

        registerPage.classList.remove("hidden");

        loginMessage.innerHTML = "";

    };


    // ==================================================
    // KEMBALI LOGIN
    // ==================================================

    backLogin.onclick = function () {

        registerPage.classList.add("hidden");

        loginPage.classList.remove("hidden");

        registerMessage.innerHTML = "";

    };


    // ==================================================
    // REGISTER
    // ==================================================

    registerForm.onsubmit = function (event) {

        event.preventDefault();


        const user =
            newUsername.value.trim();

        const pass =
            newPassword.value;

        const confirm =
            confirmPassword.value;


        // Username kosong

        if (user === "") {

            registerMessage.innerHTML =
                "❌ Username belum diisi.";

            registerMessage.style.color = "red";

            return;

        }


        // Password kosong

        if (pass === "") {

            registerMessage.innerHTML =
                "❌ Password belum diisi.";

            registerMessage.style.color = "red";

            return;

        }


        // Password minimal

        if (pass.length < 4) {

            registerMessage.innerHTML =
                "❌ Password minimal 4 karakter.";

            registerMessage.style.color = "red";

            return;

        }


        // Konfirmasi

        if (pass !== confirm) {

            registerMessage.innerHTML =
                "❌ Password tidak sama.";

            registerMessage.style.color = "red";

            return;

        }


        // Ambil akun lama

        let accounts =
            JSON.parse(
                localStorage.getItem(
                    "pawpastelAccounts"
                )
            );


        if (!accounts) {

            accounts = [];

        }


        // Cek username

        const sameUser =
            accounts.find(
                function (account) {

                    return account.username
                        .toLowerCase()
                        === user.toLowerCase();

                }
            );


        if (sameUser) {

            registerMessage.innerHTML =
                "❌ Username sudah digunakan.";

            registerMessage.style.color = "red";

            return;

        }


        // Tambah akun

        accounts.push({

            username: user,

            password: pass

        });


        // Simpan

        localStorage.setItem(
            "pawpastelAccounts",
            JSON.stringify(accounts)
        );


        // Berhasil

        registerMessage.innerHTML =
            "✅ Register berhasil! Silakan login.";

        registerMessage.style.color =
            "green";


        // Kosongkan

        registerForm.reset();


        // Kembali login

        setTimeout(function () {

            registerPage.classList.add("hidden");

            loginPage.classList.remove("hidden");

            username.value = user;

            password.focus();

            registerMessage.innerHTML = "";

        }, 1000);

    };


    // ==================================================
    // LOGIN
    // ==================================================

    loginForm.onsubmit = function (event) {

        event.preventDefault();


        const user =
            username.value.trim();

        const pass =
            password.value;


        // Cek kosong

        if (user === "" || pass === "") {

            loginMessage.innerHTML =
                "❌ Username dan password wajib diisi.";

            loginMessage.style.color =
                "red";

            return;

        }


        // Ambil akun

        let accounts =
            JSON.parse(
                localStorage.getItem(
                    "pawpastelAccounts"
                )
            );


        if (!accounts) {

            accounts = [];

        }


        // Cari akun

        const found =
            accounts.find(
                function (account) {

                    return (
                        account.username
                            .toLowerCase()
                        ===
                        user.toLowerCase()

                        &&

                        account.password
                        ===
                        pass
                    );

                }
            );


        // Jika salah

        if (!found) {

            loginMessage.innerHTML =
                "❌ Username atau password salah.";

            loginMessage.style.color =
                "red";

            return;

        }


        // ==================================================
        // LOGIN BERHASIL
        // ==================================================

        loginMessage.innerHTML =
            "✅ Login berhasil!";

        loginMessage.style.color =
            "green";


        // Simpan status login

        localStorage.setItem(
            "pawpastelLogin",
            found.username
        );


        // Tampilkan halaman utama

        setTimeout(function () {

            loginPage.classList.add("hidden");

            mainPage.classList.remove("hidden");

            userDisplay.innerHTML =
                found.username;

        }, 500);

    };


    // ==================================================
    // AUTO LOGIN
    // ==================================================

    const loggedUser =
        localStorage.getItem(
            "pawpastelLogin"
        );


    if (loggedUser) {

        loginPage.classList.add("hidden");

        registerPage.classList.add("hidden");

        mainPage.classList.remove("hidden");

        userDisplay.innerHTML =
            loggedUser;

    }


    // ==================================================
    // LOGOUT
    // ==================================================

    logoutButton.onclick = function () {

        localStorage.removeItem(
            "pawpastelLogin"
        );

        location.reload();

    };

});


// ==================================================
// PRODUK
// ==================================================

function showProducts() {

    document.getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });

}


function buyProduct(productName) {

    alert(
        "Kamu memilih: " +
        productName
    );

}