module.exports = {
  saveDish: {
    name: {
      presence: { allowEmpty: false, message: "^Dish name is required" },
      length: {
        minimum: 3,
        maximum: 100,
        message: "^Dish name must be between 3 and 100 characters"
      }
    },
    type: {
      presence: { allowEmpty: false, message: "^Dish type is required" },
      length: {
        minimum: 3,
        maximum: 50,
        message: "^Dish type must be between 3 and 50 characters"
      }
    },
    price: {
      presence: { allowEmpty: false, message: "^Dish price is required" },
      numericality: {
        greaterThan: 0,
        message: "^Dish price must be a positive number"
      }
    },
    time: {
      presence: { allowEmpty: false, message: "^Preparation time is required" },
      length: {
        minimum: 1,
        maximum: 50,
        message: "^Preparation time must be between 1 and 50 characters"
      }
    },
    // photo: {
    //   presence: { allowEmpty: false, message: "^Photo is required" }
    // },
    description: {
      presence: { allowEmpty: false, message: "^Description is required" },
      length: {
        minimum: 10,
        maximum: 500,
        message: "^Description must be between 10 and 500 characters"
      }
    },
    discount: {
      presence: { allowEmpty: false, message: "^Discount is required" },
      numericality: {
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 100,
        message: "^Discount must be between 0 and 100"
      }
    },
    serve: {
      presence: { allowEmpty: false, message: "^Serve quantity is required" },
      numericality: {
        greaterThan: 0,
        message: "^Serve quantity must be a positive number"
      }
    }
  }
}