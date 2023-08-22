import { Router } from "express";
import { usersService } from "../dao/index.js";
import { productService } from "../dao/index.js";

const router = Router();

router.post("/signup", async (req, res) => {
    try {
        const signupForm = req.body;
        const user = await usersService.getByEmail(signupForm.email);
        if (!user) {
        const result = await usersService.save(signupForm);
        res.render("login", { message: "Usuario creado correctamente" });
        } else {
            res.render("signup", { error: "El usuario ya existe" });
        }
    } catch (error) {
        res.render('signup', { error: error.message });
    }
});

// router.post("/login", async (req, res) => {
//     try {
//         console.log(req.body);
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).send({ error: 'Campos incompletos' });
//         } else {
//         res.redirect('/home');
//         }
//     } catch (error) {
//         res.send({ error: error.message });
//     }
// });

router.post("/login", async(req,res)=>{
    try {
        const loginForm = req.body;
        const user = await usersService.getByEmail(loginForm.email);
        if(!user){
            return res.render('login',{error:'El usuario no se ha registrado'});
        }
        if(user.password === loginForm.password){
            req.session.userInfo = {
                first_name:user.first_name,
                email:user.email
            };
            res.redirect('/home');
        } else {
            return res.render('login',{error:'Credenciales invalidas'});
        }
    } catch (error) {
        res.render('login',{error:error.message});
    }
});

router.get("/logout", (req,res)=>{
    req.session.destroy(error=>{
        if(error) return res.render("profile",{user: req.session.userInfo, error:"No se pudo cerrar la sesion"});
        res.redirect("/");
    })
});

export { router as sessionsRouter };