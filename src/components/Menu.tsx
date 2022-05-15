import {
	IonMenu,
	IonList,
	IonItem,
	IonIcon,
	IonLabel,
	IonContent,
	IonImg,
	IonCard,
	IonCardContent,
	IonButton,
	IonButtons,
	IonModal,
	IonHeader,
	IonToolbar,
	IonTitle,
    IonLoading,
} from "@ionic/react";
import { useState } from 'react';
import {
	closeOutline,
	helpCircleOutline,
	homeOutline,
	ribbonOutline,
} from "ionicons/icons";
import { logout, uploadAvatar } from "../app/firebase";
import { useAppSelector } from "../app/hooks";
import { selectAuthUser } from "../app/slices/authUserSlice";
import Logo from "../assets/logo.svg";
import Container from "./Container";
import UserAvatar from "./UserAvatar";
import Dropzone from "react-dropzone";
import { useHistory } from "react-router";

const Menu: React.FC = () => {
    const authUser = useAppSelector(selectAuthUser);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const history = useHistory();

	return (
		<IonMenu
			contentId="main"
			type="overlay"
			style={{
				minWidth: `min-content`,
				// maxWidth: `300px`
			}}
		>
			<IonContent>
				<IonImg
					src={Logo}
					style={{
						padding: `1rem`,
						maxWidth: `256px`
					}}
				/>
				<IonCard color="dark" style={{maxWidth: `256px`}} >
					<IonCardContent
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{authUser && (
							<>
								<UserAvatar user={authUser} />
								<br />
								<p>
									Hello, <b>{authUser.name}</b>
								</p>
								<br />
								<IonButtons
									style={{
										display: "flex",
										flexDirection: "column",
										justifyContent: `start`,
										alignItems: `start`,
										width: `100%`,
										textAlign: `left`,
									}}
								>
									<IonButton
										fill="clear"
										size="small"
										color="light"
                                        style={{ width: `100%` }}
                                        onClick={() => setShowAvatarModal(true)}
									>
										<b>Change Avatar</b>
									</IonButton>
									<IonButton
										fill="clear"
										size="small"
										color="light"
										style={{ width: `100%` }}
										onClick={() => {
											logout();
										}}
									>
										<b>Logout</b>
									</IonButton>
								</IonButtons>
							</>
						)}
					</IonCardContent>
				</IonCard>
				<IonList lines="none">
					<IonItem button lines="none" onClick={() => history.push(`/`)} >
						<IonIcon icon={homeOutline} slot="start" />
						<IonLabel color="dark">
							<b>Home</b>
						</IonLabel>
					</IonItem>
					<IonItem button lines="none" onClick={() => history.push(`/add`)}>
						<IonIcon icon={helpCircleOutline} slot="start" />
						<IonLabel color="dark">
							<b>Ask Question</b>
						</IonLabel>
					</IonItem>
					<IonItem button lines="none" onClick={() => history.push(`/leaderboard`)}>
						<IonIcon icon={ribbonOutline} slot="start" />
						<IonLabel color="dark">
							<b>Leaderboard</b>
						</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
            <IonModal
                isOpen={showAvatarModal}
                canDismiss
                onDidDismiss={() => setShowAvatarModal(false)}
            >
				<IonHeader>
					<IonToolbar>
						<IonTitle>Upload your avatar</IonTitle>
                        <IonButton fill="clear" color="danger"
                            onClick={() => setShowAvatarModal(false)}
                        >
							<IonIcon icon={closeOutline} slot="start" />
							<IonLabel>
								<b>Cancel</b>
							</IonLabel>
						</IonButton>
					</IonToolbar>
				</IonHeader>
				<Container>
					<Dropzone
						disabled={false}
						onDrop={async (acceptedFiles) => {
							console.log(acceptedFiles);
							if (acceptedFiles.length <= 0 || !authUser) {
								return;
							}
                            setLoading(true);
                            const res = await uploadAvatar(acceptedFiles[0], authUser.id);
                            setLoading(false);
                            setShowAvatarModal(false);
						}}
					>
						{({ getRootProps, getInputProps }) => (
							<section>
								<div
									{...getRootProps()}
									style={{
										border: `2px dashed #888`,
										padding: `1rem`,
										borderRadius: `12px`,
										cursor: `pointer`,
									}}
								>
									<input {...getInputProps()} />
									<p>Drop Your Photo Here</p>
								</div>
							</section>
						)}
					</Dropzone>
				</Container>
            </IonModal>
            <IonLoading
                isOpen={loading}
                message={`Updating Your Avatar...`}
                onDidDismiss={() => setLoading(false)}
            />
		</IonMenu>
	);
};

export default Menu;
