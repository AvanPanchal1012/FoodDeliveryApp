function checkLoginUser(req, res) {
    const loginUser = req.session.loginUser;
    
    if (!loginUser) {
      return false;
    } 
    else {
      return loginUser;
    }
}

module.exports = checkLoginUser;