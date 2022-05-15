import {
    IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
	IonIcon,
	IonImg,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonLoading,
	IonPage,
    IonToast,
} from "@ionic/react";
import Container from "../components/Container";
import Logo from "../assets/logo.svg";
import { useState, useEffect } from "react";
import { User } from "../app/types/user";
import { arrowForwardCircleOutline, closeCircleOutline } from "ionicons/icons";
import { loginUser } from "../app/firebase";
import { useHistory } from "react-router";

const Login: React.FC = () => {
	const [email, setemail] = useState("");
	const [pw, setPw] = useState("");
    const [disableSubmit, setdisableSubmit] = useState(true);
    const [toast, setToast] = useState({
        show: false,
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) && pw !== '') {
            setdisableSubmit(false);
        } else {
            setdisableSubmit(true);
        }
        return () => {}
    }, [email, pw]);
    
    const handleSubmit = async () => {
        if (pw.length < 8) {
            setToast({
                show: true,
                message: `Password must be at least 8 characters long!`
            })
            return
        }
        setLoading(true);
        try {
            await loginUser(email, pw);
        } catch (error) {
            console.log(error);
        }
    }

	return (
		<IonPage>
			<Container>
				<IonImg src={Logo} />
				<IonCard color="dark">
					<IonCardHeader>
						<IonCardTitle style={{ textAlign: `center` }}>Login to Play...</IonCardTitle>
						<IonCardSubtitle></IonCardSubtitle>
					</IonCardHeader>
					<IonCardContent>
						<IonList inset>
							<IonItem>
								<IonLabel slot="start">
									<p>Email</p>
								</IonLabel>
                                <IonInput
                                    type="email"
                                    value={email}
                                    onIonChange={(e) => setemail(e.detail.value!)}
                                    onIonFocus={() => setToast({show: false, message:''})}
                                />
							</IonItem>
							<IonItem>
								<IonLabel slot="start">
									<p>Password</p>
								</IonLabel>
                                <IonInput
                                    type="password"
                                    value={pw}
                                    onIonChange={(e) => setPw(e.detail.value!)}
                                    onIonFocus={() => setToast({show: false, message:''})}
                                />
							</IonItem>
							<IonItem
								button
								color="primary"
                                disabled={disableSubmit}
                                onClick={() => handleSubmit()}
							>
								Login
							</IonItem>
                        </IonList>
                        
                        <IonButton fill="clear" color="secondary"
                            onClick={() => history.push(`/signup`)}
                        >
                            <IonIcon icon={arrowForwardCircleOutline} slot="start" />
                            <IonLabel>I want to Register!</IonLabel>
                        </IonButton>
					</IonCardContent>
				</IonCard>
            </Container>
            <IonToast
                isOpen={toast.show}
                message={toast.message}
                icon={closeCircleOutline}
                position='top'
                color="danger"
                onDidDismiss={() => setToast({show: false, message: ''})}
            />
            <IonLoading
                isOpen={loading}
                onDidDismiss={() => setLoading(false)}
                message='Signning in...'
                spinner={'dots'}
            />
		</IonPage>
	);
};

export default Login;
