import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

class FireBase {
  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyCTv0MbZyH_hYOjRRcWxUG6YjEHEwvDL_o",
      authDomain: "assignment-511b2.firebaseapp.com",
      projectId: "assignment-511b2",
      storageBucket: "assignment-511b2.appspot.com",
      messagingSenderId: "622426989289",
      appId: "1:622426989289:web:40c51f3ccc466854370678",
      measurementId: "G-HMNJJ19VHX",
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
