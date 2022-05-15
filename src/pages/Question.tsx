import {
	IonCard,
	IonPage,
	IonCardHeader,
	IonCardContent,
	IonLabel,
	IonButton,
	IonList,
	IonRadioGroup,
	IonItem,
	IonRadio,
	IonCardTitle,
	IonLoading,
    IonChip,
	IonCardSubtitle,
	IonContent,
} from "@ionic/react";
import { useState } from "react";
import { useParams } from "react-router";
import { answerQuestion } from "../app/firebase";
import { useAppSelector } from "../app/hooks";
import { selectAuthUser } from "../app/slices/authUserSlice";
import { selectQuestion } from "../app/slices/questionsSlice";
import { Question as QuestionType, UserAnswered } from "../app/types/question";
import Container from "../components/Container";
import Header from "../components/Header";
import UserAvatar from "../components/UserAvatar";
import { Line } from "rc-progress";

const QuestionForm: React.FC<{ question: QuestionType }> = (props) => {
	const { question } = props;
	const [selected, setSelected] = useState<string>("a");
	const [loading, setLoading] = useState(false);
	const authUser = useAppSelector(selectAuthUser);
	const handleSubmit = async () => {
		if (!authUser) {
			return;
		}
		setLoading(true);
		const userAnswers: UserAnswered[] = [...question.userAnswered];
		const newAnswer: UserAnswered = {
			user: authUser,
			answer: selected,
		};
		userAnswers.push(newAnswer);
		const updatedQuestion: QuestionType = Object.assign(
			{ ...question },
			{ userAnswered: userAnswers }
		);
		const res = await answerQuestion(authUser, updatedQuestion);
	};

	return (
		<>
			<IonCard color="dark" style={{ width: `400px`, maxWidth: `100%` }}>
				<IonCardHeader>
					<IonCardTitle>Would You Rather...</IonCardTitle>
				</IonCardHeader>
				<IonCardContent>
					<IonList inset>
						<IonRadioGroup
							value={selected}
							onIonChange={(e) => setSelected(e.detail.value)}
						>
							<IonItem>
								<IonLabel>{question.answers.a}</IonLabel>
								<IonRadio slot="end" value={"a"} />
							</IonItem>
							<IonItem>
								<IonLabel>{question.answers.b}</IonLabel>
								<IonRadio slot="end" value={"b"} />
							</IonItem>
						</IonRadioGroup>
					</IonList>
					<br />
					<IonButton expand="block" onClick={() => handleSubmit()}>
						Submit
					</IonButton>
				</IonCardContent>
				<IonLoading isOpen={loading} message={`Sending Your Answer...`} />
			</IonCard>
		</>
	);
};

const QuestionStats: React.FC<{ question: QuestionType }> = (props) => {
    const { question } = props;
    const authUser = useAppSelector(selectAuthUser);
    const myAnswer = question.userAnswered.find(item => item.user.id === authUser?.id)?.answer;
    const allVotes = question.userAnswered.length;
    const aVotes = question.userAnswered.filter(item => item.answer === 'a').length;
    const bVotes = question.userAnswered.filter(item => item.answer === 'b').length;
	return (
		<>
			<IonCard style={{width: '400px', maxWidth: '100%'}} color={myAnswer === 'a' ? 'primary' : 'light'}>
				<IonCardContent>
                    <div>
                        {myAnswer === 'a' && <><IonChip>Your Choice</IonChip><br/></>}
                        <b>Whould You Rather {question.answers.a}?</b>
                        <br/><br/>
                        <p>{`Result: ${(aVotes/allVotes*100).toFixed(0)}% (${aVotes} out of ${allVotes} votes)`}</p>
						<Line percent={(aVotes/allVotes*100)} strokeWidth={5} strokeColor={myAnswer === 'a' ? "#11aa00" : "#88ccff"} />
					</div>
				</IonCardContent>
            </IonCard>
            <h1>-- OR --</h1>
            <IonCard style={{width: '400px', maxWidth: '100%'}} color={myAnswer === 'b' ? 'primary' : 'light'}>
				<IonCardContent>
                    <div>
                    {myAnswer === 'b' && <><IonChip>Your Choice</IonChip><br/></>}
                    <b>Whould You Rather {question.answers.b}?</b>
                        <br/><br/>
						<p>{`Result: ${(bVotes/allVotes*100).toFixed(0)}% (${bVotes} out of ${allVotes} votes)`}</p>
						<Line percent={(bVotes/allVotes*100)} strokeWidth={5} strokeColor={myAnswer === 'b' ? "#11aa00" : "#88ccff"} />
					</div>
				</IonCardContent>
			</IonCard>
		</>
	);
};

const Question: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const authUser = useAppSelector(selectAuthUser);
	const question = useAppSelector(selectQuestion(String(id)));

	return (
		<IonPage>
			<Header />
			<Container>
				{question ? (
					<>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-around",
								alignItems: "center",
							}}
						>
							<UserAvatar user={question.askedUser} />
							<b style={{ paddingLeft: "1rem" }}>
								{question.askedUser.name} asks:
							</b>
						</div>
						{question.userAnswered.filter(
							(item) => item.user.id === authUser?.id
						).length === 0 ? (
							<QuestionForm question={question} />
						) : (
							<QuestionStats question={question} />
						)}
					</>
				)
					:
					(
						<IonCard>
							<IonCardHeader>
								<IonCardTitle>I Don't think this is the right Question...</IonCardTitle>
								<IonCardSubtitle>404 error</IonCardSubtitle>
							</IonCardHeader>
							<IonCardContent style={{padding: '2rem'}}>
								<IonLabel><b>There don't seems to be any question with this id ({id}) in our records.</b></IonLabel>
							</IonCardContent>
						</IonCard>
					)
			}
			</Container>
		</IonPage>
	);
};

export default Question;
