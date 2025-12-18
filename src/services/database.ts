// Service dedicated to fetching game data from Firestore.
import { db } from "./firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export class DatabaseService {
    //Fetches a specific document by ID from a collection.
    async getGameData(col: string, id: string) {
        const docRef = doc(db, col, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }
        throw new Error(`Documento ${id} não encontrado na coleção ${col}`);
    }
}