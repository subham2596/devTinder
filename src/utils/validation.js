const validator = require("validator");

const validateSignupData = (req) => {
    const {firstname, lastname, email, password} = req.body;
    if(!firstname || !lastname) {
        throw new Error("Name is not valid.")
    } else if (!validator.isEmail(email)) {
        throw new Error("Email id is not valid.")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password.")
    }
}


module.exports = validateSignupData;