const yup = require("yup");

exports.addRoleSchema = yup.object().shape({
  name: yup.string().required("role's name is required"),
});
