import { IonContent, IonPage, IonSpinner } from "@ionic/react"

const PageLoader: React.FC = () => {
    return (
        <IonPage>
            <IonContent>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100vw',
                        height : '100vh'
                    }}
                >
                    <IonSpinner name="dots" style={{width: '48px', height: '10%'}} />
                </div>
            </IonContent>
        </IonPage>
    )
}

export default PageLoader;