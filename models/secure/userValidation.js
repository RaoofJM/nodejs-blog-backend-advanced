const yup = require("yup");

// Yup Schema for Regisrer Requirements
exports.registerUserScheme = yup.object().shape({
  fullname: yup
    .string()
    .required("Please Enter Fullname")
    .min(4, "Fullname's length must be more that 4")
    .max(256, "Fullname's length must be less than 256"),
  email: yup
    .string()
    .email("Email is not valid")
    .required("Please Enter Email"),
  password: yup
    .string()
    .required("Please Enter Password")
    .min(4, "Password's length must be more that 4"),
  confirmPassword: yup
    .string()
    .required("Please Enter Confirm Password")
    .oneOf(
      [yup.ref("password"), null],
      "Password and confirm password don't match"
    ),
});
