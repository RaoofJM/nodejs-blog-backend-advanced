const yup = require("yup");

// Yup Schema for Regisrer Requirements
exports.newsScrapperScheme = yup.object().shape({
  url: yup.string().required("Please Enter the Name"),
  selector: yup.string().required("Please Enter selector"),
  titleTag: yup.string().required("Please Enter title tag"),
  descriptionTag: yup.string().required("Please Enter description tag"),
  linkTag: yup.string().required("Please Enter link tag"),
});
