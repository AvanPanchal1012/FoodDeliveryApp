module.exports = {
    saveUser: {
        name: {
          presence: { allowEmpty: false, message: '^Name is required' },
          length: {
            maximum: 50,
            message: '^Name can be up to 50 characters long'
          }
        },
        email: {
          presence: { allowEmpty: false, message: '^Email is required' },
          email: { message: '^Email is not valid' }
        },
        phone: {
          presence: { allowEmpty: false, message: '^Phone number is required' },
          format: {
            pattern: "\\d{10}",
            message: '^Phone number must be 10 digits'
          }
        },
        address: {
          presence: { allowEmpty: false, message: '^Address is required' },
          length: {
            maximum: 100,
            message: '^Address can be up to 100 characters long'
          }
        },
        password: {
          presence: { allowEmpty: false, message: '^Password is required' },
          length: {
            minimum: 6,
            message: '^Password must be at least 6 characters long'
          }
        },
        cpassword: {
          presence: { allowEmpty: false, message: '^Confirm Password is required' },
          equality: {
            attribute: 'password',
            message: '^Passwords do not match'
          }
        }
    },
    modifyUser: {
        name: {
          presence: { allowEmpty: false, message: '^Name is required' },
          length: {
            maximum: 50,
            message: '^Name can be up to 50 characters long'
          }
        },
        email: {
          presence: { allowEmpty: false, message: '^Email is required' },
          email: { message: '^Email is not valid' }
        },
        phone: {
          presence: { allowEmpty: false, message: '^Phone number is required' },
          format: {
            pattern: "\\d{10}",
            message: '^Phone number must be 10 digits'
          }
        },
        address: {
          presence: { allowEmpty: false, message: '^Address is required' },
          length: {
            maximum: 100,
            message: '^Address can be up to 100 characters long'
          }
        },
        password: function(value, attributes) {
          if (!value && !attributes.cpassword) {
            return null;
          }
          return {
            presence: { allowEmpty: false, message: '^Password is required' },
            length: {
              minimum: 6,
              message: '^Password must be at least 6 characters long'
            }
          };
        },
        cpassword: function(value, attributes) {
          if (!attributes.password) {
            return null;
          }
          return {
            presence: { allowEmpty: false, message: '^Confirm Password is required' },
            equality: {
              attribute: 'password',
              message: '^Passwords do not match'
            }
          };
        }
    }
}