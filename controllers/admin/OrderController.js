const Order = require("../../models/Order");
const checkLoginSession = require("../../helpers/checkLoginSession");

module.exports = {
    getAllOrders: async (req, res) => {
        const loginUser = await checkLoginSession(req, res);
        
        if (loginUser) {
            let currentPage = 1;
            const page = req.params.page;

            if (page)
                currentPage = page;

            const total = 5;
            const start = (currentPage - 1) * total;
            const data = await Order.find().skip(start).limit(total);
            var totalRec = await Order.find().countDocuments();
            const totalPage = Math.ceil(totalRec / total);
          
            res.render('admin/adminOrders', {
                loginUser: loginUser,
                orders: data,
                currentPage: currentPage,
                count: totalPage,
                totalRec: totalRec
            })
        }
        else {
          res.redirect("/admin");
        }
    },
    cookingStatus: async (req, res) => {
        const loginUser = await checkLoginSession(req, res);

        if (loginUser) {
            const data = await Order.updateOne({ _id: req.params.id }, { $set: { states: "Cooking" } })
            res.redirect("/admin/orders");
        }
        else {
          res.redirect("/admin");
        }
    },
    deliverStatus: async (req, res) => {
        const loginUser = await checkLoginSession(req, res);

        if (loginUser) {
            const data = await Order.updateOne({ _id: req.params.id }, { $set: { states: "Out for deliver." } })
            res.redirect("/admin/orders");
        }
        else {
          res.redirect("/admin");
        }
    },
    completeStatus: async (req, res) => {
        const loginUser = await checkLoginSession(req, res);

        if (loginUser) {
            const data = await Order.updateOne({ _id: req.params.id }, { $set: { states: "Order completed." } })
            res.redirect("/admin/orders");
        }
        else {
          res.redirect("/admin");
        }
    }
}