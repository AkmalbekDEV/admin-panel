import { db, collection, getDocs } from './firebase';

const fetchCourses = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const courses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return courses;
  } catch (e) {
    console.error("Error fetching courses: ", e);
    return [];
  }
};

const fetchTeachers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "teachers"));
    const teachers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return teachers;
  } catch (e) {
    console.error("Error fetching teachers: ", e);
    return [];
  }
};

export { fetchCourses, fetchTeachers };