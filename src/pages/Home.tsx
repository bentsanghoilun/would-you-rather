import { useState } from "react";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCol, IonGrid, IonItem, IonLabel, IonList, IonPage, IonRow, IonSegment, IonSegmentButton } from "@ionic/react"
import { useAppSelector } from "../app/hooks";
import { selectAnsweredQuestions, selectMyQuestions, selectQuestions, selectUnansweredQuestions } from "../app/slices/questionsSlice";
import Container from "../components/Container";
import Header from "../components/Header";
import { Question } from "../app/types/question";
import UserAvatar from "../components/UserAvatar";
import { useHistory } from "react-router";
import { answerQuestion } from "../app/firebase";

const QuestionModule: React.FC<{ question: Question }> = (props) => {
    const { question } = props;
    const history = useHistory();
    
    return (
        <IonCard style={{ width: `400px`, maxWidth: `100%` }}>
            <IonCardHeader>
                <IonCardSubtitle>{question.askedUser.name} asks:</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
                <IonGrid>
                    <IonRow>
                        <IonCol sizeXl="3" >
                            <UserAvatar user={question.askedUser}/>
                        </IonCol>
                        <IonCol>
                            <IonLabel>
                                <p><b>Would you rather</b></p>
                                <b>...{question.answers.a}...OR...</b>
                            </IonLabel>                            
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton expand="block" fill="outline" color="dark"
                                onClick={() => history.push(`/questions/${question.id}`)}
                            >View Poll</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonCardContent>
        </IonCard>
    )
}

const Home: React.FC = () => {
    const initQuestions = useAppSelector(selectQuestions);
    const myQuestions = useAppSelector(selectMyQuestions);
    const answeredQuestions = useAppSelector(selectAnsweredQuestions);
    const unansweredQuestions = useAppSelector(selectUnansweredQuestions);
    const [showView, setShowView] = useState('unanswered');

    // console.log(initQuestions, myQuestions, answeredQuestions, unansweredQuestions);

    return (
        <IonPage>
            <Header/>
            <Container>
                <IonCard>
                    <IonCardContent>
                        <IonSegment value={showView} onIonChange={(e) => setShowView(e.detail.value!)}>
                            <IonSegmentButton value="unanswered">
                                <IonLabel>Not Answered</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="answered">
                                <IonLabel>Answered</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="myQuestions">
                                <IonLabel>My Questions</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </IonCardContent>
                </IonCard>
                {
                    showView === 'unanswered' ?
                                unansweredQuestions.length <= 0 ? <b>You've Answered All Questions</b> :
                                unansweredQuestions.map(item => (
                                    <QuestionModule question={item} key={`question-item-${item.id}`}/>
                                ))
                        : showView === 'answered' ?
                            answeredQuestions.length <= 0 ? <b>You've Not Answered Any Questions...</b> :
                                answeredQuestions.map(item => (
                                    <QuestionModule question={item} key={`question-item-${item.id}`}/>
                                ))
                            :
                            myQuestions.length <= 0 ? <b>You've Not Asked Any Questions...</b> :
                            myQuestions.map(item => (
                                <QuestionModule question={item} key={`question-item-${item.id}`}/>
                            ))
                        }
            </Container>
        </IonPage>
    )
}

export default Home;