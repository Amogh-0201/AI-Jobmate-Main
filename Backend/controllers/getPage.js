const path = require('path');

const getLoginPage = async(req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'Viewing', 'login.html'));
}

const getRegisterPage = async(req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'Viewing', 'register.html'));
}

const getDashboardPage = async(req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'Viewing', 'dashboard.html'));
}

const getApplicationsPage = async(req,res) => {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'Viewing', 'applications.html'));
}

const getSavedjobsPage = async(req,res) => {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'Viewing', 'savedjobs.html'));
}

module.exports = {
    getLoginPage,
    getRegisterPage,
    getDashboardPage,
    getApplicationsPage,
    getSavedjobsPage
}