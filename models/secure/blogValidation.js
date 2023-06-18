const yup = require("yup");

exports.addPostSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title can't be less than 5")
    .max(100, "Title can't more than 100"),
  body: yup.string().required("Body is required"),
  status: yup
    .mixed()
    .oneOf(
      ["public", "draft", "archived"],
      "Choose one of these: public, draft, archived"
    ),
  thumbnail: yup.object().shape({
    name: yup.string().required("Thumbnail is required"),
    size: yup.number().max(3000000, "Thumbnail can't be more than 3 mgbs"),
    mimetype: yup
      .mixed()
      .oneOf(
        ["image/jpeg", "image/png"],
        "Only jped and png is acceptable for thumbnail"
      ),
  }),
  tags: yup.array(),
});

exports.singleImageSchema = yup.object().shape({
  image: yup.object().shape({
    name: yup.string().required("image is required"),
    size: yup.number().max(3000000, "image can't be more than 3 mgbs"),
    mimetype: yup
      .mixed()
      .oneOf(["image/jpeg", "image/png"], "only jpg and png"),
  }),
});
