const yup = require("yup");

exports.urlRoleValidation = yup.object().shape({
  url: yup.string().required("url is required"),
});
