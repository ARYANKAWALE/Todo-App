import { Router } from "express"
import { registerUser, loginUser, logOutUser, getCurrentUser } from "../controllers/user.controllers.js"
import { VerifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(VerifyJWT, logOutUser)
router.route("/current-user").get(VerifyJWT, getCurrentUser)
router.route("/profile").get(VerifyJWT, getCurrentUser)

export default router






















// app.delete('/todo/:id', (req, res) => {
//     const idTODelete = parseInt(req.params.id)
//     const index = todo.findIndex(item => item.id === idTODelete);

//     if (index !== -1) {
//         todo.splice(index, 1);
//         res.json(todo);
//     } else {
//         res.status(404).json({ message: "ID not found" });
//     }
// })


// app.post('/login', (req, res) => {
//     const data = req.body
//     console.log(data)
//     res.json(data)
// })

// app.delete('/todo/:id', (req, res) => {
//     const idTODelete = parseInt(req.params.id)
//     const index = todo.findIndex(item => item.id === idTODelete);

//     if (index !== -1) {
//         todo.splice(index, 1);
//         res.json(todo);
//     } else {
//         res.status(404).json({ message: "ID not found" });
//     }
// })

// app.put('/todo/:id', (req, res) => {
//     const idToUpdate = parseInt(req.params.id);

//     const index = todo.findIndex(item => item.id === idToUpdate);

//     if (index === -1) {
//         return res.status(404).json({ message: "User not found" });
//     }
//     todo[index].name = req.body.name;

//     if (req.body.age) {
//         todo[index].age = req.body.age;
//     }

//     res.json(todo);
// })