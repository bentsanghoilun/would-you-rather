import { useEffect } from "react";
import { initFirebase } from "./app/firebase";
import { Redirect, Route } from "react-router-dom";
import {
	IonApp,
	IonIcon,
	IonLabel,
	IonRouterOutlet,
	IonSplitPane,
	IonTabBar,
	IonTabButton,
	IonTabs,
	setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, square, triangle } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { useAppSelector } from "./app/hooks";
import { authUserIsInit, selectAuthUser } from "./app/slices/authUserSlice";
import PageLoader from "./components/PageLoader";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Menu from "./components/Menu";
import Ask from "./pages/Ask";
import Question from "./pages/Question";
import Leaderboard from "./pages/Leaderboard";

setupIonicReact({
	mode: "ios",
});

const App: React.FC = () => {
	const isInit = useAppSelector(authUserIsInit);
	const authUser = useAppSelector(selectAuthUser);

	useEffect(() => {
		initFirebase();
	}, []);

	return (
		<IonApp>
			{!isInit ? (
				<PageLoader />
			) : authUser ? (
				<IonReactRouter>
					<IonSplitPane contentId="main" when="xl">
						<Menu />
						<IonRouterOutlet id="main">
							<Route path={`/`} exact><Home /></Route>
								<Route path={`/ask`} exact><Ask /></Route>
								<Route path={`/leaderboard`} exact><Leaderboard /></Route>
							<Route path={`/questions/:id`}><Question/></Route>
							<Redirect to={`/`} />
						</IonRouterOutlet>
					</IonSplitPane>
				</IonReactRouter>
			) : (
				<IonReactRouter>
					<IonRouterOutlet>
						<Route path={`/signup`} exact={true}><Signup /></Route>
						<Route path={`/`} exact={true}><Login /></Route>
						<Redirect to={`/`} />
					</IonRouterOutlet>
				</IonReactRouter>
			)}
		</IonApp>
	);
};

export default App;
