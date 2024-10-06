import React, { useEffect, useRef, useState } from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Text,
  useToast,
  Box,
  Image,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';  // Import Framer Motion for animations
import {
  addCourse,
  uploadImage,
  addTeacher,
  uploadTeacherImage,
  updateCourse,
  updateTeacher,
} from './uploadData';
import { fetchCourses, fetchTeachers } from './fetchData';
import { deleteCourse } from './DeleteCourse';
import { deleteTeacher } from './DeleteTeacher';

const MotionBox = motion(Box); // Motion wrapper for animated Box

const App = () => {
  // For Courses
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [briefDescription, setBriefDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [editCourseId, setEditCourseId] = useState(null); // For editing

  // For Teachers
  const [teachers, setTeachers] = useState([]);
  const [teacherName, setTeacherName] = useState('');
  const [teacherJob, setTeacherJob] = useState('');
  const [teacherDesc, setTeacherDesc] = useState('');
  const [teacherImage, setTeacherImage] = useState(null);
  const [editTeacherId, setEditTeacherId] = useState(null); // For editing

  // For other settings
  const toast = useToast();
  const fileInputCourseRef = useRef(null);
  const fileInputTeacherRef = useRef(null);

  // Modal controls for courses and teachers
  const { isOpen: isCourseModalOpen, onOpen: onOpenCourseModal, onClose: onCloseCourseModal } = useDisclosure();
  const { isOpen: isTeacherModalOpen, onOpen: onOpenTeacherModal, onClose: onCloseTeacherModal } = useDisclosure();

  // For Courses
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newCourse = null;

    if (!courseName || !briefDescription || !detailedDescription || !image) {
      toast({
        duration: 5000,
        isClosable: true,
        status: 'error',
        title: "Barcha ma'lumotlarni kiriting!",
        position: 'top',
      });
      return;
    }

    if (image) {
      const imageURL = await uploadImage(image);
      if (imageURL) {
        newCourse = {
          name: courseName,
          brief: briefDescription,
          detailed: detailedDescription,
          price: price,
          imageURL: imageURL,
        };
        if (editCourseId) {
          // Update the course if editCourseId is set
          await updateCourse(editCourseId, newCourse);
          setCourses((prevCourses) =>
            prevCourses.map((course) =>
              course.id === editCourseId ? { ...course, ...newCourse } : course
            )
          );
          setEditCourseId(null);
        } else {
          // Add new course if editCourseId is not set
          await addCourse(newCourse);
          setCourses((prevCourses) => [...prevCourses, newCourse]);
        }
      }
    }

    toast({
      title: editCourseId ? 'Kurs yangilandi!' : 'Kurs kiritildi!',
      description: `Siz kurs ${editCourseId ? 'yangilashni' : "qo'shishni"} muvaffaqiyatli tarzda amalga oshirdingiz!`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    setCourseName('');
    setBriefDescription('');
    setDetailedDescription('');
    setPrice('');
    setImage(null);
    if (fileInputCourseRef.current) {
      fileInputCourseRef.current.value = '';
    }
    onCloseCourseModal(); // Close modal
  };

  useEffect(() => {
    const getCourses = async () => {
      const data = await fetchCourses();
      setCourses(data);
    };
    getCourses();
  }, []);

  const handleDelete = async (id) => {
    await deleteCourse(id);
    setCourses(courses.filter((course) => course.id !== id));
  };

  // For Teachers
  const handleTeacherImage = (e) => {
    setTeacherImage(e.target.files[0]);
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    let newTeacher = null;

    if (!teacherName || !teacherJob || !teacherDesc || !teacherImage) {
      toast({
        duration: 5000,
        isClosable: true,
        status: 'error',
        title: "Barcha ma'lumotlarni kiriting!",
        position: 'top',
      });
      return;
    }

    const imageURL = await uploadTeacherImage(teacherImage);
    newTeacher = {
      name: teacherName,
      job: teacherJob,
      desc: teacherDesc,
      imageURL: imageURL || '',
    };

    if (editTeacherId) {
      // Update the teacher if editTeacherId is set
      await updateTeacher(editTeacherId, newTeacher);
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.id === editTeacherId ? { ...teacher, ...newTeacher } : teacher
        )
      );
      setEditTeacherId(null);
    } else {
      // Add new teacher if editTeacherId is not set
      await addTeacher(newTeacher);
      setTeachers((prevTeachers) => [...prevTeachers, newTeacher]);
    }

    toast({
      title: editTeacherId ? 'Ustoz yangilandi!' : 'Ustoz kiritildi!',
      description: `Siz ustoz ${editTeacherId ? 'yangilashni' : "qo'shishni"} muvaffaqiyatli tarzda amalga oshirdingiz!`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    setTeacherName('');
    setTeacherJob('');
    setTeacherDesc('');
    setTeacherImage(null);
    if (fileInputTeacherRef.current) {
      fileInputTeacherRef.current.value = '';
    }
    onCloseTeacherModal(); // Close modal
  };

  useEffect(() => {
    const getTeachers = async () => {
      const data = await fetchTeachers();
      setTeachers(data);
    };
    getTeachers();
  }, []);

  const handleTeacherDelete = async (id) => {
    await deleteTeacher(id);
    setTeachers(teachers.filter((teacher) => teacher.id !== id));
  };

  const openCourseModalForEdit = (course) => {
    setEditCourseId(course.id);
    setCourseName(course.name);
    setBriefDescription(course.brief);
    setDetailedDescription(course.detailed);
    setPrice(course.price);
    onOpenCourseModal(); // Open modal
  };

  const openTeacherModalForEdit = (teacher) => {
    setEditTeacherId(teacher.id);
    setTeacherName(teacher.name);
    setTeacherJob(teacher.job);
    setTeacherDesc(teacher.desc);
    onOpenTeacherModal(); // Open modal
  };

  return (
    <Box p={5} bg="gray.800" minH="100vh" color="white" className='flex justify-center'>
      <Tabs variant='soft-rounded' colorScheme='purple' mt={5} w='100%'>
        <TabList display={'flex'} justifyContent={'center'} mb={3}>
          <Tab fontSize={{ base: '20px', md: '24px' }} _selected={{ color: 'white', bg: 'gray.600' }}>
            Ustozlar
          </Tab>
          <Tab fontSize={{ base: '20px', md: '24px' }} _selected={{ color: 'white', bg: 'gray.600' }}>
            Kurslar
          </Tab>
        </TabList>
        <TabPanels>
          {/* Teachers Tab */}
          <TabPanel>
            <Stack spacing={6} align='center'>
              <Button onClick={onOpenTeacherModal} colorScheme="purple" w="full" maxW="400px">
                Ustoz qo'shish
              </Button>

              <Box display={'flex'} flexWrap={'wrap'} gap={4} w="full">
                {teachers.map((teacher) => (
                  <Box key={teacher.id} borderWidth='1px' borderRadius='lg' w={'330px'} h={'550px'} display={'grid'} alignContent={'space-between'} overflow='hidden' p={5} bg='gray.700'>
                    <Image src={teacher.imageURL} alt={teacher.name} borderRadius="md" w="full" objectFit="cover" mb={4} />
                    <Text fontSize="xl" fontWeight="bold" mb={2}>{teacher.name}</Text>
                    <Text fontSize="md" color="gray.300" mb={4}>{teacher.job}</Text>
                    <Button w={'full'} colorScheme="blue" onClick={() => openTeacherModalForEdit(teacher)}>Tahrirlash</Button>
                    <Button w={'full'} colorScheme="red" onClick={() => handleTeacherDelete(teacher.id)}>O'chirish</Button>
                  </Box>
                ))}
              </Box>
            </Stack>
          </TabPanel>

          {/* Courses Tab */}
          <TabPanel>
            <Stack spacing={6} align='center'>
              <Button onClick={onOpenCourseModal} colorScheme="purple" w="full" maxW="400px">
                Kurs qo'shish
              </Button>

              <Box display="flex" flexWrap={'wrap'} gap={5} w="full">
                {courses.map((course) => (
                  <Box key={course.id} display={'grid'} alignContent={'space-between'} borderWidth='1px' borderRadius='lg' w={'325px'} h={'390px'} overflow='hidden' p={5} bg='gray.700'>
                    <Image src={course.imageURL} alt={course.name} borderRadius="md" w="full" objectFit="cover" mb={4} />
                    <Text fontSize="xl" fontWeight="bold" mb={2}>{course.name}</Text>
                    <Text fontSize="md" color="gray.300" mb={4}>{course.brief}</Text>
                    <Box display={'flex'} justifyContent={'space-between'} gap={3}>
                      <Button w={'full'} colorScheme="blue" onClick={() => openCourseModalForEdit(course)}>Tahrirlash</Button>
                      <Button w={'full'} colorScheme="red" onClick={() => handleDelete(course.id)}>O'chirish</Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Course Modal */}
      <Modal isOpen={isCourseModalOpen} onClose={onCloseCourseModal}>
        <ModalOverlay />
        <ModalContent bgColor={'gray.700'} textColor={'white'}>
          <ModalHeader>Kursni {editCourseId ? 'Tahrirlash' : "Qo'shish"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl id="course-name" isRequired mb={4}>
                <FormLabel>Kurs nomi</FormLabel>
                <Input
                  placeholder="Kurs nomi"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  borderColor={'gray.600'}
                />
              </FormControl>

              <FormControl id="brief-description" isRequired mb={4}>
                <FormLabel>Ruscha nomi</FormLabel>
                <Textarea
                  placeholder="Ruscha nom"
                  value={briefDescription}
                  onChange={(e) => setBriefDescription(e.target.value)}
                  borderColor={'gray.600'}
                />
              </FormControl>

              <FormControl id="detailed-description" isRequired mb={4}>
                <FormLabel>Batafsil tavsif</FormLabel>
                <Textarea
                  placeholder="Batafsil tavsif"
                  value={detailedDescription}
                  onChange={(e) => setDetailedDescription(e.target.value)}
                  borderColor={'gray.600'}
                />
              </FormControl>

              <FormControl id="image" isRequired mb={4}>
                <FormLabel>Rasm yuklash</FormLabel>
                <Input type="file" ref={fileInputCourseRef} onChange={handleImageChange} borderColor={'gray.600'} />
              </FormControl>

              <Button colorScheme="purple" type="submit" w="full">
                {editCourseId ? 'Yangilash' : "Qo'shish"}
              </Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseCourseModal}>Bekor qilish</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Teacher Modal */}
      <Modal isOpen={isTeacherModalOpen} onClose={onCloseTeacherModal}>
        <ModalOverlay />
        <ModalContent bgColor={'gray.700'} textColor={'white'}>
          <ModalHeader>Ustozni {editTeacherId ? 'Tahrirlash' : "Qo'shish"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleTeacherSubmit}>
              <FormControl id="teacher-name" isRequired mb={4}>
                <FormLabel>Ustoz ismi</FormLabel>
                <Input
                  placeholder="Ustoz ismi"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  borderColor={'gray.600'}
                />
              </FormControl>

              <FormControl id="teacher-job" isRequired mb={4}>
                <FormLabel>Ismi (Rus harflarda)</FormLabel>
                <Input
                  placeholder="Ustoz ismi"
                  value={teacherJob}
                  onChange={(e) => setTeacherJob(e.target.value)}
                  borderColor={'gray.600'}
                />
              </FormControl>

              <FormControl id="teacher-description" isRequired mb={4}>
                <FormLabel>Tavsif</FormLabel>
                <Textarea
                  placeholder="Tavsif"
                  value={teacherDesc}
                  onChange={(e) => setTeacherDesc(e.target.value)}
                  borderColor={'gray.600'}
                />
              </FormControl>

              <FormControl id="teacher-image" isRequired mb={4}>
                <FormLabel>Rasm yuklash</FormLabel>
                <Input type="file" ref={fileInputTeacherRef} onChange={handleTeacherImage} borderColor={'gray.600'} />
              </FormControl>

              <Button colorScheme="purple" type="submit" w="full">
                {editTeacherId ? 'Yangilash' : "Qo'shish"}
              </Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseTeacherModal}>Bekor qilish</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default App;