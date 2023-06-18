const urlRoleController = require("../controllers/urlRoleController");

const express = require("express");

const router = express.Router();

// GET - /admin/url-roles - Shos All the Urls
router.get("/", urlRoleController.showAll);

// GET - /admin/url-roles/detail-url/:id - Url Detail
router.get("/detail-url/:id", urlRoleController.showDetail);

// POST - /admin/url-roles/add-url - Add Url Handler
router.post("/add-url", urlRoleController.addUrlRole);

// PUT - /admin/url-roles/edit-url/:id - Edits a Url
router.put("/edit-url/:id", urlRoleController.editUrlRole);

// DELETE - /admin/url-roles/delete-url/:id - Deletes a Url
router.delete("/delete-url/:id", urlRoleController.deleteUrlRole);

module.exports = router;
