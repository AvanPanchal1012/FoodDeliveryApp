const Contact = require("../../models/Contact");
const checkLoginSession = require("../../helpers/checkLoginSession");

module.exports = {
  getAllInquiries: async (req, res) => {
    const loginUser = await checkLoginSession(req, res);

    if (loginUser) {
      let currentPage = 1;
      const page = req.params.page;
      if (page)
          currentPage = page;
    
      const total = 5;
      const start = (currentPage - 1) * total;
      const data = await Contact.find().skip(start).limit(total);
      const totalPage = Math.ceil(await Contact.find().countDocuments() / total);
      
      res.render('admin/contactInquiries', {
          loginUser: loginUser,
          data: data,
          currentPage: currentPage,
          count: totalPage
      })
    }
    else {
      res.redirect("/admin");
    }
  },
  deleteInquiry:  async (req, res) => {
    const loginUser = await checkLoginSession(req, res);
    
    if (loginUser) {
      const data = await Contact.deleteOne({ "_id": req.params.id })
      if (data) {
          console.log("file is deleted...")
          res.redirect('/admin/contact-inquiries')
      } else {
          res.send("<h1>Server Error !!</h1><h2> Sorry, the contact inquiry is not deleted please try letter..</h2>")
      }
    }
    else {
      res.redirect("/admin");
    }
  }
}