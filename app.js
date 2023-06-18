// Node Requirements
const path = require("path");

// Inner Requirements
const connectDB = require("./config/db");
const winston = require("./config/winston");
const { errorHandler } = require("./middlewares/errors");
const { setHeaders } = require("./middlewares/headers");
const { limiter } = require("./config/rateLimit");

// Outer Requirements
const fileUpload = require("express-fileupload");
const express = require("express");
const dotEnv = require("dotenv");
const morgan = require("morgan");

// Load Config
dotEnv.config({ path: "./config/config.env" });

// ENVs
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;

// Database Connection
connectDB();

// App
const app = express();

// Rate Limiter
app.use(limiter);

// Logging
if (process.env.NODE_ENV === "development")
  app.use(morgan("combined", { stream: winston.stream }));

// BodyParser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(setHeaders);

// File Upload
app.use(fileUpload());

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/userRouter"));
app.use("/admin/roles", require("./routes/roleManagementRouter"));
app.use("/admin/users", require("./routes/userManagementRouter"));
app.use("/admin/categories", require("./routes/categoryRouter"));
app.use("/comments", require("./routes/commentRouter"));
app.use("/p", require("./routes/blogRouter"));
app.use("/admin/blogs", require("./routes/blogManagementRouter"));
app.use("/admin/tags", require("./routes/tagRouter"));
app.use("/admin/url-roles", require("./routes/urlRolesRouter"));
app.use("/news-scrapper", require("./routes/newsScrapperRouter"));

// Error Controller
app.use(errorHandler);

// Port Settings
app.listen(PORT, () => {
  console.log("***********************");
  console.log(`Server started on ${PORT} && running on ${NODE_ENV} mode`);
});
