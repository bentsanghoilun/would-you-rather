import { IonContent } from "@ionic/react"


const Container: React.FC = ({children}) => {
    return (
        <IonContent color="light">
            <div style={{
                width: `100%`,
                minHeight: `100%`,
                display: `flex`,
                flexDirection: `column`,
                justifyContent: `center`,
                alignItems: `center`,
                maxWidth: `966px`,
                margin: `auto`
            }} >
            {children}
            </div>   
        </IonContent>
    )
}

export default Container;