import { db, doc, deleteDoc } from './firebase';

const deleteCourse = async (id) => {
  try {
    await deleteDoc(doc(db, "courses", id));
    console.log("Document successfully deleted!");
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

export { deleteCourse };
