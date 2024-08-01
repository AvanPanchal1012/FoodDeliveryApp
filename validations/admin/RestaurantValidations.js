module.exports = {
  saveRestaurant: {
      name: {
        presence: { allowEmpty: false, message: "^Name is required" },
        length: {
          minimum: 3,
          maximum: 100,
          message: "^Name must be between 3 and 100 characters"
        }
      },
      location: {
        presence: { allowEmpty: false, message: "^Location is required" },
        length: {
          minimum: 3,
          maximum: 100,
          message: "^Location must be between 3 and 100 characters"
        }
      },
      cuisine: {
        presence: { allowEmpty: false, message: "^Cuisine is required" },
        length: {
          minimum: 3,
          maximum: 100,
          message: "^Cuisine must be between 3 and 100 characters"
        }
      },
      contact: {
        presence: { allowEmpty: false, message: "^Contact is required" },
        format: {
          pattern: "^[0-9-+s()]*$",
          message: "^Contact must be a valid phone number"
        }
      },
      email: {
          presence: { allowEmpty: false, message: '^Email is required' },
          email: { message: '^Email is not valid' }
      },
      // photo: {
      //   presence: { allowEmpty: false, message: "^Photo is required" }
      // },
      openingHours: {
        presence: { allowEmpty: false, message: "^Opening hours are required" },
        length: {
          minimum: 3,
          maximum: 100,
          message: "^Opening hours must be between 3 and 100 characters"
        }
      },
      description: {
        presence: { allowEmpty: false, message: "^Description is required" },
        length: {
          minimum: 10,
          maximum: 500,
          message: "^Description must be between 10 and 500 characters"
        }
      },
      dishIds: {
        presence: { allowEmpty: false, message: "^Dishes are required" }
      }
  }
}