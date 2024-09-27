import { db, doc, deleteDoc } from './firebase';

const deleteTeacher = async (id) => {
  try {
    await deleteDoc(doc(db, "teachers", id));
    console.log("Document successfully deleted!");
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

export { deleteTeacher };
