const path = require('path');

const getLoginPage = async(req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'Viewing', 'login.html'));
}

const getRegisterPage = async(req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'Viewing', 'register.html'));
}

const getDashboardPage = async(req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'viewing', 'dashboard.html'));
}

module.exports = {
    getLoginPage,
    getRegisterPage,
    getDashboardPage
}