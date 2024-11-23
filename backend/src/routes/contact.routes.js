import {Router} from "express"
import {createContact,
    getContact,
    getAllContacts,
    updateContact,
    deleteContact,
    updateContactImage } from "../controllers/contact.controller.js"
    import {upload} from "../middlewares/multer.middleware.js"
    import {verifyJWT} from "../middlewares/auth.middleware.js"

    const contactRouter = Router()

    contactRouter.route("/").post(
        upload.single("image"), verifyJWT, createContact).get(verifyJWT, getAllContacts)

        contactRouter.route("/:id").get(verifyJWT, getContact).post(verifyJWT, updateContact).patch(verifyJWT, upload.single("image"), updateContactImage).delete(verifyJWT, deleteContact)


    export default contactRouter