import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardSubtitle,
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
import { useState, useEffect } from "react";
import { checkmarkCircleOutline, closeCircleOutline, logInOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import Container from "../components/Container";
import Logo from "../assets/logo.svg";
import { User } from "../app/types/user";
import { signup } from "../app/firebase";
import { FirebaseError } from "firebase/app";

const Signup: React.FC = () => {
	const history = useHistory();
	const [values, setValues] = useState({
		name: "",
		email: "",
		pw: "",
		confirmPw: "",
	});
	const [disableSubmit, setDisableSubmit] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    
    const handleChange = (field: string, value: string) => {
        setValues(Object.assign({ ...values }, { [`${field}`]: value }));
    }

    const handleSubmit = async () => {
        setLoading(true);
        const tempUser: User = {
            id: 'new',
            name: values.name,
            email: values.email,
            profilePic: '',
            answered: 0,
            asked: 0
        }
        try {
            const res = await signup(tempUser, values.pw);
            if (res === `auth/email-already-in-use`) {
                // email already registered
                setLoading(false);
                setShowToast(true);
            } else {
                setLoading(false);
                window.location.assign(`/`);
            }
        } catch (error: any) {
            console.error(`hahaha`, error);
            setLoading(false);
        }
    }

    useEffect(() => {
		if (
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email) &&
            values.pw.length >= 8 &&
			values.name !== "" &&
			values.confirmPw === values.pw
		) {
			setDisableSubmit(false);
		} else {
			setDisableSubmit(true);
		}
	}, [values]);

	return (
		<IonPage>
			<Container>
				<IonImg src={Logo} />
				<h1>Sign Up to Ask, or Get Asked...</h1>
				<IonCard color="dark">
					<IonCardContent>
						<IonCardSubtitle style={{ textAlign: "center" }}>
							You know... all fields are required...
						</IonCardSubtitle>
						<IonList inset>
							<IonItem>
								<IonLabel position="stacked" color="dark">Name</IonLabel>
                                <IonInput
                                    type="text"
                                    onIonChange={(e) => handleChange(`name`, e.detail.value!)}
                                    placeholder='Full name preferred...'
                                />
							</IonItem>
							<IonItem>
								<IonLabel position="stacked" color="dark">Email</IonLabel>
                                <IonInput
                                    type="email"
                                    onIonChange={(e) => handleChange(`email`, e.detail.value!)}
                                    placeholder={`jon.doe@gmail.com`}
                                />
							</IonItem>
							<IonItem>
								<IonLabel position="stacked" color="dark">
									Password
								</IonLabel>
                                <IonInput
                                    type="password"
                                    onIonChange={(e) => handleChange(`pw`, e.detail.value!)}
                                    placeholder={`Minimum 8 Characters...`}
                                />
							</IonItem>
                            <IonItem>
                                <IonIcon slot="end"
                                    icon={
                                        values.pw.length < 8 || values.pw !== values.confirmPw ?
                                            closeCircleOutline : checkmarkCircleOutline
                                    }
                                    color={
                                        values.pw.length < 8 || values.pw !== values.confirmPw ?
                                            'danger' : 'primary'
                                    }
                                    size='small'
                                />
                                <IonLabel position="stacked" color="dark">Reconfirm Password</IonLabel>
                                <IonInput
                                    type="password"
                                    onIonChange={(e) => handleChange(`confirmPw`, e.detail.value!)}
                                />
							</IonItem>
						</IonList>
					</IonCardContent>
				</IonCard>
                <IonButton
                    size="large"
                    disabled={disableSubmit}
                    onClick={() => handleSubmit()}
                >
					<IonIcon icon={logInOutline} slot="start" />
					<IonLabel>Sign me up now!</IonLabel>
				</IonButton>
				<br />
				<IonButton
					fill="clear"
					color="dark"
					onClick={() => history.push(`/`, { direction: "back" })}
				>{`Wait...I Changed Me Mind...`}</IonButton>
            </Container>
            <IonLoading isOpen={loading} message={`Preparing your account...`} />
            <IonToast
                isOpen={showToast}
                color="danger"
                onDidDismiss={() => setShowToast(false)}
                message={`Email is already Registered`}
                position='top'
                buttons={[
                    {
                        side: `end`,
                        icon: logInOutline,
                        text: 'Login Instead',
                        handler: () => {
                            setShowToast(false);
                            history.push(`/`, { direction: "back" })
                        }
                    }
                ]}
            />
		</IonPage>
	);
};

export default Signup;
