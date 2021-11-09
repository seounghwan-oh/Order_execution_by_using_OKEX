import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

class FireBase {
  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyDXZM73Ddu1UxBqa76y_G4p8ajFnmmoajQ",
      authDomain: "okex-2b721.firebaseapp.com",
      projectId: "okex-2b721",
      storageBucket: "okex-2b721.appspot.com",
      messagingSenderId: "418332901450",
      appId: "1:418332901450:web:a57d81bf4d5621b53026b3",
      measurementId: "G-D1XR556FYV"
    };
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    this.auth = auth;
  }

  async register(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return result.user.uid;
    } catch (error) {
      if (error.code === "auth/email-already-in-use")
        throw new Error("등록된 이메일입니다.");
      if (error.code === "auth/invalid-email")
        throw new Error("이메일 주소가 유효하지 않습니다.");
      console.log(error);
      throw new Error(error);
    }
  }

  async login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return result.user.uid;
    } catch (error) {
      if (error.code === "auth/invalid-email")
        throw new Error("이메일 주소가 유효하지 않습니다.");
      if (error.code === "auth/wrong-password")
        throw new Error("비밀번호가 틀렸습니다.");
      if (error.code === "auth/user-not-found")
        throw new Error("등록되지 않은 계정입니다.");
      console.log(error);
      throw error;
    }
  }
}

export const fireBase = new FireBase();
