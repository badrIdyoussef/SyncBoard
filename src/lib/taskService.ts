import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError } from './firebase';

export interface Task {
  id?: string;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  userId: string;
  createdAt: any;
  updatedAt: any;
}

const TASKS_COLLECTION = 'tasks';

export function subscribeToTasks(userId: string, callback: (tasks: Task[]) => void) {
  const q = query(
    collection(db, TASKS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
    callback(tasks);
  }, (error) => {
    console.error("Task subscription error:", error);
  });
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    await addDoc(collection(db, TASKS_COLLECTION), {
      ...task,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, 'create', TASKS_COLLECTION);
  }
}

export async function updateTask(id: string, updates: Partial<Task>) {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, id);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, 'update', `${TASKS_COLLECTION}/${id}`);
  }
}

export async function deleteTask(id: string) {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, id);
    await deleteDoc(taskRef);
  } catch (error) {
    handleFirestoreError(error, 'delete', `${TASKS_COLLECTION}/${id}`);
  }
}
