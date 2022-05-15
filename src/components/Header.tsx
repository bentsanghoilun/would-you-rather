import { IonButton, IonHeader, IonIcon, IonMenuToggle, IonToolbar } from "@ionic/react"
import { menuOutline } from "ionicons/icons";


const Header: React.FC = () => {
    return (
        <IonHeader className="ion-no-border" color="light">
            <IonToolbar color="light">
                <IonMenuToggle slot="start">
                    <IonButton fill="clear" color="dark">
                        <IonIcon slot="icon-only" icon={menuOutline}/>
                    </IonButton>
                </IonMenuToggle>
            </IonToolbar>
        </IonHeader>
    )
}

export default Header;