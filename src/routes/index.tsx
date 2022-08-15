import React from "react";
// import {F  Routes as Switch} from "react-router-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const Dashboard = React.lazy(() => import("../pages/Dashboard"))
const Repo  = React.lazy(() => import("../pages/Repo"));

const Routes: React.FC = () => {
    return (
        <BrowserRouter>
            <React.Suspense fallback={"carregando..."}>

                <Switch>
                    <Route exact path="/" component={Dashboard}></Route>
                    <Route path="/repositories/:repository" component={Repo}></Route>
                </Switch>

            </React.Suspense>
        </BrowserRouter>

    )
}
export { Routes };