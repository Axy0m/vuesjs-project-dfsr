import Register from "../pages/register";
import Login from "../pages/login"
import Home from "../pages/home"
import Account from "@/pages/account";
import Messages from "@/pages/messages";
import ChangePassword from "@/pages/changePassword";
import EditPost from "@/pages/editPost";

export default [
    {
        path: "/",
        component: Register,
    },
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/home",
        component: Home,
    },
    {
        path: "/account",
        component: Account
    },
    {
        path: "/messages",
        component: Messages
    },
    {
        path: "/password",
        component: ChangePassword
    },
    {
        path: "/edit/:id",
        component: EditPost,
        name: "editPostPage",
    }
]