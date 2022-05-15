import { initializeApp, getApps } from "firebase/app";
import {
	getAuth,
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import {
	getFirestore,
	setDoc,
	doc,
	getDoc,
	addDoc,
	onSnapshot,
	collection,
	query,
	Timestamp,
	orderBy,
	increment,
} from "firebase/firestore";
import { setAuthUser, setAuthUserIsInit } from "./slices/authUserSlice";
import { store } from "./store";
import { User } from "./types/user";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Question } from "./types/question";
import { setQuestions } from "./slices/questionsSlice";
import { setUsers } from "./slices/usersSlice";

const firebaseConfig = {
	apiKey: "AIzaSyAt4GyMsPWdg3p-hRgbQkX_zCrTDLJR_GY",
	authDomain: "would-you-rather-2b718.firebaseapp.com",
	projectId: "would-you-rather-2b718",
	storageBucket: "would-you-rather-2b718.appspot.com",
	messagingSenderId: "989943190730",
	appId: "1:989943190730:web:e46c920605ee2906461033",
};

export const initFirebase = async () => {
	if (getApps().length <= 0) {
		const app = initializeApp(firebaseConfig);
		const auth = getAuth(app);
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				// user is signed in
				const uid = user.uid;
				const db = getFirestore();
				const docRef = doc(db, "users", uid);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const data = docSnap.data();
					const id = docSnap.id;
					const authUser: User = {
						id,
						name: data.name,
						email: data.email,
						profilePic: data.profilePic || null,
						answered: data.answered || 0,
						asked: data.asked || 0,
					};
					store.dispatch(setAuthUser(authUser));
					GlobalListener();
				} else {
					store.dispatch(setAuthUser(null));
				}
			} else {
				// user is not signed in / logged out
			}
			store.dispatch(setAuthUserIsInit(true));
		});
	}
};

export const signup = async (user: User, password: string) => {
	const auth = getAuth();
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			user.email,
			password
		);
		if (!userCredential) {
			return "failed";
		}
		const db = getFirestore();
		const data = {
			name: user.name,
			email: user.email,
			profilePic: user.profilePic,
			answered: user.answered,
			asked: user.asked,
		};
		const res = await setDoc(doc(db, `users`, userCredential.user.uid), data);
		return res;
	} catch (error: any) {
		return error.code;
	}
};

export const logout = async () => {
	await signOut(getAuth());
	window.location.assign("/");
};

export const loginUser = async (email: string, pw: string) => {
	const auth = getAuth();
	await signInWithEmailAndPassword(auth, email, pw)
		.then((userCredential) => {
			window.location.assign("/");
			// return userCredential.user;
		})
		.catch((error) => {
			return error.code;
		});
};

// upload img
export const uploadAvatar = async (file: File, userId: string) => {
	if (!file.type.includes(`image`)) {
		return "invalidFile";
	}

	const storage = getStorage();
	const storageRef = ref(storage, `avatars/${file.name}`);

	const res = await uploadBytes(storageRef, file);
	const url = await getDownloadURL(res.ref);

	// update the supply img
	const db = getFirestore();
	const userRef = doc(db, `users/${userId}`);
	const updateUserRes = await setDoc(
		userRef,
		{ profilePic: url },
		{ merge: true }
	);
	return "success";
};

export const authUserListener = () => {
	const authUserId = store.getState().authUser.authUser?.id;
	if (!authUserId) {
		return;
	}
	const unSub = onSnapshot(
		doc(getFirestore(), `users/${authUserId}`),
		(doc) => {
			const data = doc.data();
			// console.log(data);
			const tempUser: User = {
				id: authUserId,
				name: data?.name,
				email: data?.email,
				profilePic: data?.profilePic,
				answered: data?.answered,
				asked: data?.asked,
			};
			store.dispatch(setAuthUser(tempUser));
		}
	);
};

export const createQuestion = async (newQuestion: Question) => {
	const { askedUser, answers, userAnswered, createdAt } = newQuestion;
	try {
		await addDoc(collection(getFirestore(), "questions"), {
			askedUser,
			answers,
			userAnswered,
			createdAt: Timestamp.fromMillis(createdAt),
		});
		const userRef = doc(getFirestore(), `users/${newQuestion.askedUser.id}`);
		await setDoc(userRef, { asked: increment(1) }, { merge: true });
		return "success";
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const answerQuestion = async (user: User, question: Question) => {
	const db = getFirestore();
	const userRef = doc(db, `/users/${user.id}`);
	const qRef = doc(db, `/questions/${question.id}`);
	const { userAnswered } = question;

	try {
		await setDoc(qRef, { userAnswered }, { merge: true });
		await setDoc(userRef, { answered: increment(1) }, { merge: true });
		return "success";
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const questionsListener = () => {
	const q = query(
		collection(getFirestore(), `questions`),
		orderBy("createdAt", "desc")
	);
	const unSub = onSnapshot(q, (snapshot) => {
		const questions: Question[] = [];
		snapshot.forEach((doc) => {
			const id = doc.id;
			const { askedUser, answers, userAnswered, createdAt } = doc.data();
			const question: Question = {
				id,
				askedUser,
				answers,
				userAnswered,
				createdAt: createdAt.toMillis(),
			};
			questions.push(question);
		});
		store.dispatch(setQuestions(questions));
	});
};

export const usersListener = () => {
	const q = query(
		collection(getFirestore(), `users`)
	);
	const unSub = onSnapshot(q, (snapshot) => {
		const users: User[] = [];
		snapshot.forEach((doc) => {
			const id = doc.id;
			const { name, email, answered, asked, profilePic } = doc.data();
			const user: User = {
				id,
				name,
				email,
				answered,
				asked,
				profilePic
			};
			users.push(user);
		});
		store.dispatch(setUsers(users));
	});
};

export const GlobalListener = async () => {
	authUserListener();
	questionsListener();
	usersListener();
};
