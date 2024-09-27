import { db, storage, collection, addDoc, ref, uploadBytes, getDownloadURL } from './firebase';

const uploadImage = async (file) => {
  if (!file) return null;

  const fileName = encodeURIComponent(file.name); // Fayl nomini kodlash
  const storageRef = ref(storage, `images/${fileName}`);

  try {
    const uploadResult = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log('File uploaded successfully! Download URL:', downloadURL);
    return downloadURL;
  } catch (e) {
    console.error('Error uploading file: ', e);
    return null;
  }
};

const addCourse = async (courseData) => {
  try {
    const docRef = await addDoc(collection(db, "courses"), courseData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const addTeacher = async (teacherData) => {
  try {
    await addDoc(collection(db, 'teachers'), teacherData);
  } catch (error) {
    console.error('Error adding teacher:', error);
  }
};

// Rasmlarni yuklash
const uploadTeacherImage = async (file) => {
  const storageRef = ref(storage, `teachers/${file.name}`);
  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export { addCourse, uploadImage, addTeacher, uploadTeacherImage };
