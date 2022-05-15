import { useEffect, useState } from "react";
import {
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonChip,
	IonCol,
	IonGrid,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonPage,
	IonRow,
} from "@ionic/react";
import { useAppSelector } from "../app/hooks";
import { selectUsers } from "../app/slices/usersSlice";
import Container from "../components/Container";
import { User } from "../app/types/user";
import UserAvatar from "../components/UserAvatar";
import { ribbonOutline } from "ionicons/icons";

const medalColors = ["#eecc33", "#888899", "#cc9933"];

const Leaderboard: React.FC = () => {
	const users = useAppSelector(selectUsers);
	const [sortedUsers, sertSortedUsers] = useState<User[]>([]);

	useEffect(() => {
		if (users.length <= 0) {
			return;
		}
		sertSortedUsers(
			[...users].sort((a, b) => b.asked + b.answered - (a.asked + a.answered))
		);
	}, [users]);

	return (
		<IonPage>
			<Container>
				<IonLabel>
					<h1>
						<b>Leaderboard</b>
					</h1>
				</IonLabel>
				<IonCard style={{ width: `400px`, maxWidth: `100%` }}>
					<IonCardContent>
						<IonList>
							{[...sortedUsers].slice(0, 3).map((item, index) => (
								<IonItem key={`user-item-${item.id}`}>
									<UserAvatar user={item} slot="start" />
									<IonChip
										slot="end"
										style={{ background: medalColors[index] }}
									>
										<IonLabel color="#fff">{index + 1}</IonLabel>
										<IonIcon icon={ribbonOutline} style={{ color: "#fff" }} />
									</IonChip>

									<IonLabel>
										<IonGrid>
											<IonRow>
												<IonCol>
													<b>{item.name}</b>
													<p>
														<b>Score: {item.answered + item.asked}</b>
													</p>
												</IonCol>
											</IonRow>
											<IonRow>
												<IonCol>
													<p>Answered: {item.answered}</p>
												</IonCol>
												<IonCol>
													<p>Asked: {item.asked}</p>
												</IonCol>
											</IonRow>
										</IonGrid>
									</IonLabel>
								</IonItem>
							))}
						</IonList>
					</IonCardContent>
				</IonCard>
			</Container>
		</IonPage>
	);
};

export default Leaderboard;
