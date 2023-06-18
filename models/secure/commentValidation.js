const yup = require("yup");

// Yup Schema for Regisrer Requirements
exports.addCommentScheme = yup.object().shape({
  fullname: yup
    .string()
    .required("Please Enter Fullname")
    .min(4, "Fullname's length must be more that 4")
    .max(256, "Fullname's length must be less than 256"),
  email: yup
    .string()
    .email("Email is not valid")
    .required("Please Enter Email"),
  body: yup.string().required("Plesae enter body of the comment"),
  status: yup
    .mixed()
    .oneOf(
      ["waiting", "rejected", "confirmed"],
      "Choose one of these: waiting, rejected, confirmed"
    ),
});
