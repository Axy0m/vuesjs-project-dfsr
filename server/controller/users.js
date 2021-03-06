const userService = require("../services/users.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.getList = async (req, res) => {
    try {
        const usersList = await userService.getUsers();
        res.status(200).json(usersList);
    } catch (e) {
        res.status(400).send(e);
    }
}
exports.getOne = async (req, res) => {
    try {
        const user = await userService.getOne({id: req.params.id});
        res.status(200).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
}
exports.add = async (req, res) => {
    try {
        if (req.body.fullName && req.body.email && req.body.password) {
            const password = await userService.hashPassword(req.body.password);
            const newUser = {
                fullName: req.body.fullName,
                email: req.body.email,
                password: password,
            };
            console.log(newUser);
            const user = await userService.add(newUser);
            res.status(200).send(user);
        } else {
            res.status(400).send({message: "Veuillez remplir tout les champs"});
        }

    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}
exports.delete = async (req, res) => {
    try {
        const userDeleted = await userService.delete(req.params.id);
        res.status(200).send(userDeleted);
    } catch (e) {
        res.status(400).json(e);
    }
}
exports.modify = async (req, res) => {
    try {
        let body;
        let userModified;
        if (req.body.profilPicture === "delete") {
            body = {profilPicture: ""};
            userModified = await userService.modify(req.params.id, body, true);
        } else if (req.file) {
            body = {
                fullName: req.body.fullName,
                email: req.body.email,
                profilPicture: req.file.filename
            }
            userModified = await userService.modify(req.params.id, body, true);
        } else {
            body = {
                fullName: req.body.fullName,
                email: req.body.email,
            }
            userModified = await userService.modify(req.params.id, body);
        }
        if (userModified.modifiedCount === 1) return res.status(200).send(userModified);
        return res.status(400).send({message: "Aucun user trouver avec cet ID"})
    } catch (e) {
        res.status(400).send(e);
    }
}
exports.login = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({message: "Veuillez remplir les deux champs"});
    }
    const user = await userService.getOne({email: req.body.email});
    if (!user) {
        return res.status(404).send({message: "Aucun utilisateur avec cet email"});
    }
    const password = await userService.getPassword(user._id)
    const checkPassword = await userService.comparePasswords(req.body.password, password);
    if (checkPassword) {
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.SECRET,
            {expiresIn: "1 hour"}
        );
        await userService.setLastConnection(user._id);
        return res.status(200).json({access_token: token, user: user});
    } else {
        return res.status(400).json({message: "Achtung !!! mot de passe erron?? - ??tes-vous un pirate ?"})
    }
}
exports.checkToken = async (req, res) => {
    try {
        const decoded = jwt.verify(req.body.token, process.env.SECRET);
        const userConnected = await userService.getOne({id: decoded.id});
        res.status(200).send(userConnected);
    } catch (e) {
        res.status(200).send(null);
    }
}

exports.modifyPassword = async (req, res) => {
    try {
        const hashPassword = await userService.getPassword(req.params.userId);
        const passwordMatch = await userService.comparePasswords(req.body.password, hashPassword);
        if (passwordMatch) {
            const newPassword = await userService.hashPassword(req.body.newPassword);
            const passwordModified = await userService.modifyPassword(req.params.userId, newPassword);
            res.status(200).send(passwordModified);
        } else {
            res.status(400).json({message: "Ancien mot de passe incorrect."})
        }
    } catch (e) {
        res.status(400).json(e)
    }
}
