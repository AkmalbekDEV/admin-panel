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
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';  // Import Framer Motion for animations
import {
  addCourse,
  uploadImage,
  addTeacher,
  uploadTeacherImage,
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

  // For Teachers
  const [teachers, setTeachers] = useState([]);
  const [teacherName, setTeacherName] = useState('');
  const [teacherJob, setTeacherJob] = useState('');
  const [teacherDesc, setTeacherDesc] = useState('');
  const [teacherImage, setTeacherImage] = useState(null);

  // For other settings
  const toast = useToast();
  const fileInputCourseRef = useRef(null);
  const fileInputTeacherRef = useRef(null);

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
        position: 'top'
      })
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
        await addCourse(newCourse);
      }
    } else {
      newCourse = {
        name: courseName,
        brief: briefDescription,
        detailed: detailedDescription,
        price: price,
        imageURL: '',
      };
      await addCourse(newCourse);
    }

    if (newCourse) {
      setCourses((prevCourses) => [...prevCourses, newCourse]);
    }

    toast({
      title: 'Kurs kiritildi!',
      description: "Siz kurs qo'shishni muvaffaqiyatli tarzda amalga oshirdingiz!",
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

    if (!teachers || !teacherName || !teacherJob || !teacherDesc || !teacherImage) {
      toast({
        duration: 5000,
        isClosable: true,
        status: 'error',
        title: "Barcha ma'lumotlarni kiriting!",
        position: 'top'
      })
      return;
    }

    if (teacherImage) {
      const imageURL = await uploadTeacherImage(teacherImage);
      if (imageURL) {
        newTeacher = {
          name: teacherName,
          job: teacherJob,
          desc: teacherDesc,
          imageURL: imageURL,
        };
        await addTeacher(newTeacher);
      }
    } else {
      newTeacher = {
        name: teacherName,
        job: teacherJob,
        desc: teacherDesc,
        imageURL: '',
      };
      await addTeacher(newTeacher);
    }

    if (newTeacher) {
      setTeachers((prevTeacher) => [...prevTeacher, newTeacher]);
    }

    toast({
      title: 'Ustoz kiritildi!',
      description: "Siz ustoz qo'shishni muvaffaqiyatli tarzda amalga oshirdingiz!",
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

  return (
    <Box
      p={5}
      bg="gray.800" // Background color
      minH="100vh"
      color="white"
      className='flex justify-center'
    >
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
          <TabPanel>
            <Stack spacing={6} align='center'>
              <FormControl
                as={MotionBox}
                w={{ base: '100%', md: '40%' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                bg='gray.700'
                p={7}
                borderRadius='md'
                shadow='lg'
              >
                <Text fontSize={{ base: '20px', md: '24px' }} fontWeight='bold'>
                  Ustoz haqida
                </Text>
                <FormLabel mt={4} fontSize={{ base: '14px', md: '16px' }}>
                  Ustozning to'liq ismi
                </FormLabel>
                <Input
                  type='text'
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder='Ustozning ismi...'
                  variant='outline'
                  borderColor='gray.500'
                  focusBorderColor='purple.500'
                  transition='all 0.3s'
                  _hover={{ borderColor: 'gray.400' }}
                />
                <FormLabel mt={2} fontSize={{ base: '14px', md: '16px' }}>
                  Ustozning ishi
                </FormLabel>
                <Input
                  type='text'
                  value={teacherJob}
                  onChange={(e) => setTeacherJob(e.target.value)}
                  placeholder='Ustozning ishi...'
                  variant='outline'
                  borderColor='gray.500'
                  focusBorderColor='purple.500'
                  transition='all 0.3s'
                  _hover={{ borderColor: 'gray.400' }}
                />
                <FormLabel mt={2} fontSize={{ base: '14px', md: '16px' }}>
                  To'liq ma'lumot
                </FormLabel>
                <Textarea
                  resize='none'
                  value={teacherDesc}
                  onChange={(e) => setTeacherDesc(e.target.value)}
                  placeholder="Ustoz haqida ma'lumot..."
                  h={24}
                  variant='outline'
                  borderColor='gray.500'
                  focusBorderColor='purple.500'
                  transition='all 0.3s'
                  _hover={{ borderColor: 'gray.400' }}
                />
                <FormLabel mt={2} fontSize={{ base: '14px', md: '16px' }}>
                  Ustozning rasmi (512x512)
                </FormLabel>
                <Input
                  type='file'
                  ref={fileInputTeacherRef}
                  onChange={handleTeacherImage}
                  py={1}
                  accept='.webp, .jpg, .jpeg, .png, .svg'
                  borderColor='gray.500'
                  transition='all 0.3s'
                  _hover={{ borderColor: 'gray.400' }}
                />
                <Button
                  onClick={handleTeacherSubmit}
                  colorScheme='purple'
                  w='full'
                  mt={4}
                  size='lg'
                  _hover={{ bg: 'purple.600' }}
                >
                  Qo'shish
                </Button>
              </FormControl>

              <Box>
                <Text textAlign={'center'} fontSize={{ base: '20px', md: '24px' }} fontWeight='bold' mb={4}>
                  Barcha ustozlar
                </Text>
                <Box display={'flex'} justifyContent={'space-between'} flexWrap={'wrap'} rowGap={8}>
                  {teachers.map((teacher) => (
                    <MotionBox
                      key={teacher.id}
                      borderWidth='1px'
                      w={'300px'}
                      rounded='md'
                      p={4}
                      bg='gray.700'
                      shadow='md'
                      display={'grid'}
                      alignContent={'space-between'}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {teacher.imageURL && (
                        <Image
                          src={teacher.imageURL}
                          alt={teacher.name}
                          w={'full'}
                          objectFit='cover'
                          borderRadius='md'
                        />
                      )}
                      <Text fontSize='lg' fontWeight='bold'>
                        {teacher.name}
                      </Text>
                      <Text>{teacher.job}</Text>
                      <Button
                        colorScheme='red'
                        w='full'
                        mt={4}
                        onClick={() => handleTeacherDelete(teacher.id)}
                        _hover={{ bg: 'red.600' }}
                      >
                        O'chirish
                      </Button>
                    </MotionBox>
                  ))}
                </Box>
              </Box>
            </Stack>
          </TabPanel>

          <TabPanel>
            <Stack spacing={6} align='center'>
              <FormControl
                as={MotionBox}
                w={{ base: '100%', md: '40%' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                bg='gray.700'
                p={7}
                borderRadius='md'
                shadow='lg'
              >
                <Text fontSize={{ base: '20px', md: '24px' }} fontWeight='bold'>
                  Kurs haqida
                </Text>
                <FormLabel mt={4} fontSize={{ base: '14px', md: '16px' }}>
                  Kurs nomi
                </FormLabel>
                <Input
                  type='text'
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder='Kurs nomi...'
                  variant='outline'
                  borderColor='gray.500'
                  focusBorderColor='purple.500'
                  transition='all 0.3s'
                  _hover={{ borderColor: 'gray.400' }}
                />
                <FormLabel mt={2} fontSize={{ base: '14px', md: '16px' }}>
                  Qisqacha ma'lumot
                </FormLabel>
                <Input
                  type='text'
                  value={briefDescription}
                  onChange={(e) => setBriefDescription(e.target.value)}
                  placeholder='Kurs haqida qisqacha...'
                  variant='outline'
                  borderColor='gray.500'
                  focusBorderColor='purple.500'
                  transition='all 0.3s'
                  _hover={{ borderColor: 'gray.400' }}
                />
                <FormLabel mt={2} fontSize={{ base: '14px', md: '16px' }}>
                  Batafsil ma'lumot
                </FormLabel>
                <Textarea
                  resize='none'
                  value={detailedDescription}
                  onChange={(e) => setDetailedDescription(e.target.value)}
                  placeholder="Kurs haqida batafsil ma'lumot..."
                  h={24}
                  variant='outline'
                  borderColor='gray.500'
                  focusBorderColor='purple.500'
                  transition='all 0.3s'
                  _hover={{ borderColor: 'gray.400' }}
                />
                <FormLabel mt={2} fontSize={{ base: '14px', md: '16px' }}>
                  Kurs rasmi
                </FormLabel>
                <Input
                  type='file'
                  ref={fileInputCourseRef}
                  onChange={handleImageChange}
                  py={1}
                  accept='.webp, .jpg, .jpeg, .png, .svg'
                  borderColor='gray.500'
                  transition='all 0.3s'
                  _hover={{ borderColor: 'gray.400' }}
                />
                <Button
                  onClick={handleSubmit}
                  colorScheme='purple'
                  w='full'
                  mt={4}
                  size='lg'
                  _hover={{ bg: 'purple.600' }}
                >
                  Qo'shish
                </Button>
              </FormControl>

              <Box>
                <Text textAlign={'center'} fontSize={{ base: '20px', md: '24px' }} fontWeight='bold' mb={4}>
                  Barcha kurslar
                </Text>
                <Box display={'flex'} gap={8} justifyContent={'space-between'} flexWrap={'wrap'}>
                  {courses.map((course) => (
                    <MotionBox
                      key={course.id}
                      borderWidth='1px'
                      rounded='md'
                      p={4}
                      bg='gray.700'
                      shadow='md'
                      display={'grid'}
                      alignContent={'space-between'}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      maxW={'380px'}
                    >
                      {course.imageURL && (
                        <Image
                          src={course.imageURL}
                          alt={course.name}
                          w={'full'}
                          objectFit='cover'
                          borderRadius='md'
                        />
                      )}
                      <Text fontSize='lg' fontWeight='bold'>
                        {course.name}
                      </Text>
                      <Text>{course.brief}</Text>
                      <Button
                        colorScheme='red'
                        w='full'
                        mt={4}
                        onClick={() => handleDelete(course.id)}
                        _hover={{ bg: 'red.600' }}
                      >
                        O'chirish
                      </Button>
                    </MotionBox>
                  ))}
                </Box>
              </Box>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default App;