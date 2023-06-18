const yup = require("yup");

// Yup Schema for Regisrer Requirements
exports.tagScheme = yup.object().shape({
  name: yup
    .string()
    .required("Please Enter the Name")
    .max(256, "Name length must be less than 256"),
  description: yup.string(),
  color: yup.string(),
});
