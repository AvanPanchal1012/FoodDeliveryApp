const Contact = require("../../models/Contact");

async function checkLoginUser(req, res) {

  return {
    _id: '66a57266aa51210082fe3581',
    name: 'Jessica Morgan',
    email: 'jessicamorgan@yopmail.com',
    phone: '1234567890',
    password: '$2a$10$X/2H3n7Bu9E7hTLHZ6g2V.5XohwTdBWT/5na4Su14wrCX50JQk.0q',
    address: 'Scarborough',
    type: 'admin',
    __v: 0
  }
}

module.exports = {
  getAllInquiries: async (req, res) => {
      const loginUser = await checkLoginUser(req, res);
      
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
  },
  deleteInquiry:  async (req, res) => {
    const loginUser = await checkLoginUser(req, res);
  
    const data = await Contact.deleteOne({ "_id": req.params.id })
    if (data) {
        console.log("file is deleted...")
        res.redirect('/admin/contact-inquiries')
    } else {
        res.send("<h1>Server Error !!</h1><h2> Sorry, the contact inquiry is not deleted please try letter..</h2>")
    }
  }
}