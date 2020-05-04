const userData = require('../data')
function create(user) {
    try {
        var user = await usersData.addUser(email, email, gender, dob, fname, lname, password);
        req.session.user = user;
        res.redirect('/dashboard');
    }
    catch (e) {
        res.json({ error: e });
    }
}

module.exports = {

}