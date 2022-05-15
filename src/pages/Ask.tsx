import { useState, useEffect } from "react";
import { IonButton, IonCard, IonCardContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage } from "@ionic/react"
import { arrowForwardCircleOutline } from "ionicons/icons";
import Container from "../components/Container"
import { Answers, Question } from "../app/types/question";
import { useAppSelector } from "../app/hooks";
import { selectAuthUser } from "../app/slices/authUserSlice";
import { createQuestion } from "../app/firebase";
import { useHistory } from "react-router";


const Ask: React.FC = () => {
    const [answers, setAnswers] = useState<Answers>({a: '', b: ''});
    const [disableSubmit, setDisableSubmit] = useState(true);
    const authUser = useAppSelector(selectAuthUser);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSubmit = async () => {
        if (!authUser) { return };
        const newQuestion: Question = {
            id: `new`,
            askedUser: authUser,
            answers: answers,
            userAnswered: [],
            createdAt: Date.now()
        }
        setLoading(true);
        const res = await createQuestion(newQuestion);
        if (res === 'success') {
            setLoading(false);
            history.push('/');
        } else {
            console.log(res);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (answers.a.length <= 0 || answers.b.length <= 0 || answers.a.toLowerCase() === answers.b.toLowerCase()) {
            setDisableSubmit(true)
        } else {
            setDisableSubmit(false)
        }
    }, [answers]);
    
    return (
        <IonPage>
            <Container>
                <div><h1>Ask a Question...</h1></div>
                <IonCard color="dark">
                    <IonCardContent style={{textAlign: `center`}} >
                        <IonLabel>Would you Rather...</IonLabel>
                        <IonList inset>
                            <IonItem>
                                <IonLabel position="stacked">Option A</IonLabel>
                                <IonInput
                                    type="text"
                                    placeholder="Type answer A here..."
                                    value={answers.a}
                                    onIonChange={(e) => setAnswers(Object.assign({...answers}, {a: e.detail.value!}))}
                                />
                            </IonItem>
                        </IonList>
                        <div><p>{`-- OR --`}</p></div>
                        <IonList inset>
                            <IonItem>
                                <IonLabel position="stacked">Option B</IonLabel>
                                <IonInput
                                    type="text"
                                    placeholder="Type answer B here..."
                                    value={answers.b}
                                    onIonChange={(e) => setAnswers(Object.assign({...answers}, {b: e.detail.value!}))}
                                />
                            </IonItem>
                        </IonList>
                    </IonCardContent>
                </IonCard>
                <IonButton size="large"
                    disabled={disableSubmit}
                    onClick={() => handleSubmit()}
                >
                    <IonIcon icon={arrowForwardCircleOutline} slot='start' />
                    <IonLabel>Submit My Question</IonLabel>
                </IonButton>
            </Container>
            <IonLoading isOpen={loading} message={`Creating your question...`} onDidDismiss={() => setLoading(false)}/>
        </IonPage>
    )
}

export default Ask;