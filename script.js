// ==================================================
// PAWPASTEL - LOGIN + REGISTER
// Data akun disimpan di localStorage browser.
// ==================================================

(function () {
    "use strict";

    var ACCOUNTS_KEY = "pawpastelAccounts";
    var SESSION_KEY = "pawpastelLogin";

    // Cadangan jika localStorage diblokir browser
    var memoryStore = {};

    // ---------- Penyimpanan aman ----------
    function storageGet(key) {
        try {
            var value = window.localStorage.getItem(key);
            return value !== null ? value : (memoryStore[key] || null);
        } catch (e) {
            return memoryStore[key] || null;
        }
    }

    function storageSet(key, value) {
        memoryStore[key] = value;
        try {
            window.localStorage.setItem(key, value);
        } catch (e) { /* abaikan */ }
    }

    function storageRemove(key) {
        delete memoryStore[key];
        try {
            window.localStorage.removeItem(key);
        } catch (e) { /* abaikan */ }
    }

    function getAccounts() {
        try {
            var data = JSON.parse(storageGet(ACCOUNTS_KEY));
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    }

    function saveAccounts(accounts) {
        storageSet(ACCOUNTS_KEY, JSON.stringify(accounts));
    }

    // ---------- Hash password (jangan simpan password asli) ----------
    function fallbackHash(text) {
        var h1 = 5381, h2 = 52711;
        for (var i = 0; i < text.length; i++) {
            var c = text.charCodeAt(i);
            h1 = (h1 * 33) ^ c;
            h2 = (h2 * 33) ^ c;
        }
        return "f" + (h1 >>> 0).toString(16) + (h2 >>> 0).toString(16);
    }

    function hashPassword(text) {
        var salted = "pawpastel::" + text;
        if (window.crypto && window.crypto.subtle && window.TextEncoder) {
            var bytes = new TextEncoder().encode(salted);
            return window.crypto.subtle.digest("SHA-256", bytes).then(function (buffer) {
                return Array.prototype.map.call(new Uint8Array(buffer), function (b) {
                    return ("0" + b.toString(16)).slice(-2);
                }).join("");
            }).catch(function () {
                return fallbackHash(salted);
            });
        }
        return Promise.resolve(fallbackHash(salted));
    }

    // ---------- Mulai setelah halaman siap ----------
    document.addEventListener("DOMContentLoaded", function () {

        var loginPage = document.getElementById("loginPage");
        var registerPage = document.getElementById("registerPage");
        var mainPage = document.getElementById("mainPage");

        var loginForm = document.getElementById("loginForm");
        var registerForm = document.getElementById("registerForm");

        var usernameInput = document.getElementById("username");
        var passwordInput = document.getElementById("password");
        var newUsername = document.getElementById("newUsername");
        var newPassword = document.getElementById("newPassword");
        var confirmPassword = document.getElementById("confirmPassword");

        var loginMessage = document.getElementById("loginMessage");
        var registerMessage = document.getElementById("registerMessage");
        var userDisplay = document.getElementById("userDisplay");

        function showMessage(el, text, type) {
            el.textContent = text;
            el.className = "message " + (type || "");
        }

        function showPage(page) {
            loginPage.classList.add("hidden");
            registerPage.classList.add("hidden");
            mainPage.classList.add("hidden");
            page.classList.remove("hidden");
            window.scrollTo(0, 0);
        }

        function openMain(name) {
            userDisplay.textContent = name;
            showPage(mainPage);
        }

        // ---------- Pindah Login <-> Register ----------
        document.getElementById("registerButton").addEventListener("click", function () {
            showMessage(loginMessage, "", "");
            showPage(registerPage);
            newUsername.focus();
        });

        document.getElementById("backLogin").addEventListener("click", function () {
            showMessage(registerMessage, "", "");
            showPage(loginPage);
            usernameInput.focus();
        });

        // ---------- REGISTER ----------
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var user = newUsername.value.trim();
            var pass = newPassword.value;
            var confirm = confirmPassword.value;

            if (user === "") {
                showMessage(registerMessage, "❌ Username belum diisi.", "error");
                return;
            }
            if (user.length < 3) {
                showMessage(registerMessage, "❌ Username minimal 3 karakter.", "error");
                return;
            }
            if (pass === "") {
                showMessage(registerMessage, "❌ Password belum diisi.", "error");
                return;
            }
            if (pass.length < 4) {
                showMessage(registerMessage, "❌ Password minimal 4 karakter.", "error");
                return;
            }
            if (pass !== confirm) {
                showMessage(registerMessage, "❌ Konfirmasi password tidak sama.", "error");
                return;
            }

            var accounts = getAccounts();
            var exists = accounts.some(function (a) {
                return String(a.username).toLowerCase() === user.toLowerCase();
            });

            if (exists) {
                showMessage(registerMessage, "❌ Username sudah digunakan.", "error");
                return;
            }

            hashPassword(pass).then(function (hash) {
                accounts.push({ username: user, password: hash });
                saveAccounts(accounts);

                showMessage(registerMessage, "✅ Register berhasil! Silakan login.", "success");
                registerForm.reset();

                setTimeout(function () {
                    showMessage(registerMessage, "", "");
                    showPage(loginPage);
                    usernameInput.value = user;
                    passwordInput.value = "";
                    passwordInput.focus();
                    showMessage(loginMessage, "Akun berhasil dibuat. Masukkan password untuk login.", "success");
                }, 1000);
            });
        });

        // ---------- LOGIN ----------
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var user = usernameInput.value.trim();
            var pass = passwordInput.value;

            if (user === "" || pass === "") {
                showMessage(loginMessage, "❌ Username dan password wajib diisi.", "error");
                return;
            }

            var accounts = getAccounts();
            var account = accounts.find(function (a) {
                return String(a.username).toLowerCase() === user.toLowerCase();
            });

            if (!account) {
                showMessage(loginMessage, "❌ Akun belum terdaftar. Silakan register dulu.", "error");
                return;
            }

            hashPassword(pass).then(function (hash) {
                if (account.password !== hash) {
                    showMessage(loginMessage, "❌ Password salah.", "error");
                    return;
                }

                storageSet(SESSION_KEY, account.username);
                showMessage(loginMessage, "✅ Login berhasil!", "success");

                setTimeout(function () {
                    loginForm.reset();
                    showMessage(loginMessage, "", "");
                    openMain(account.username);
                }, 400);
            });
        });

        // ---------- LOGOUT ----------
        document.getElementById("logoutButton").addEventListener("click", function () {
            storageRemove(SESSION_KEY);
            showPage(loginPage);
            usernameInput.focus();
        });

        // ---------- AUTO LOGIN ----------
        var loggedUser = storageGet(SESSION_KEY);
        var stillExists = loggedUser && getAccounts().some(function (a) {
            return a.username === loggedUser;
        });

        if (stillExists) {
            openMain(loggedUser);
        } else {
            storageRemove(SESSION_KEY);
        }

        // ---------- PRODUK ----------
        document.getElementById("viewProducts").addEventListener("click", function () {
            document.getElementById("products").scrollIntoView({ behavior: "smooth" });
        });

        document.querySelectorAll(".buy-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                alert("Kamu memilih: " + btn.getAttribute("data-name"));
            });
        });
    });
})();
