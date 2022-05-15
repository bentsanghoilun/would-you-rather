import { IonAvatar, IonImg } from "@ionic/react";
import randomColor from 'randomcolor';
import { User } from "../app/types/user";

interface Props{
    user: User,
    slot?: string;
}

const bgColor = randomColor({ luminosity: 'dark' });

const UserAvatar: React.FC<Props> = (props) => {
    const { user, slot } = props;

    return (
        <>
            {
                slot ?
                <IonAvatar style={{overflow: 'hidden'}} slot={slot}>
                {user.profilePic ? 
                    <IonImg src={user.profilePic} />
                    :
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: bgColor,
                        width: '100%',
                        height: '100%'
                    }} ><b style={{fontSize: '1.6rem'}} >{user.name[0].toUpperCase()}</b></div>
                }
                    </IonAvatar>
                    :
                    <IonAvatar style={{overflow: 'hidden'}}>
                {user.profilePic ? 
                    <IonImg src={user.profilePic} />
                    :
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: bgColor,
                        width: '100%',
                        height: '100%'
                    }} ><b style={{fontSize: '1.6rem'}} >{user.name[0].toUpperCase()}</b></div>
                }
            </IonAvatar>
            }
            
        </>
    )
}

export default UserAvatar;