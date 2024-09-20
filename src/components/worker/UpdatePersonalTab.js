import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Radio,
  RadioGroup,
  Stack,
  Select,
  Textarea,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";
import { nationOptions } from "../register/worker/Option";
import { MdLocationOn } from "react-icons/md";
import { useRouter } from "next/router";

export default function UpdatePersonalTab() {
  const toast = useToast();
  const router = useRouter();
  const { personalId } = router.query;

  const [initialValues, setInitialValues] = useState({
    idNumber: "",
    gender: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    birth: "",
    age: "",
    nation: "",
    homeAddress: "",
    homeLatitude: "",
    homeLongitude: "",
    stayYears: "",
    bornAddress: "",
  });

  const today = new Date();
  today.setDate(today.getDate() - 1);
  const maxDate = today.toISOString().split("T")[0];

  useEffect(() => {
    if (!personalId) return;

    const fetchPersonalData = async () => {
      try {
        const response = await axios.get(`/api/personal/${personalId}`);
        const data = response.data || {};

        const updatedValues = {
          idNumber: data.id_number || "",
          gender: data.gender || "",
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          phoneNumber: data.phone_number || "",
          birth: data.birth || null,
          age: data.age || "",
          nation: data.nation || "",
          homeAddress: data.home_address || "",
          homeLatitude: data.home_latitude || "",
          homeLongitude: data.home_longitude || "",
          stayYears: data.stay_years || "",
          bornAddress: data.born_address || "",
        };

        setInitialValues(updatedValues);
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Unable to load personal data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchPersonalData();
  }, [personalId, toast]);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return age - 1;
    }
    return age;
  };

  const handleBirthChange = (event, setFieldValue) => {
    const birthDate = new Date(event.target.value);
    const age = calculateAge(birthDate);
    setFieldValue("birth", event.target.value);
    setFieldValue("age", age);
  };

  const handleUpdate = async (values) => {
    try {
      await axios.put(`/api/personal/${personalId}`, {
        idNumber: values.idNumber,
        gender: values.gender,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        birth: values.birth,
        age: values.age,
        nation: values.nation,
        homeAddress: values.homeAddress || "",
        homeLatitude: values.homeLatitude || "",
        homeLongitude: values.homeLongitude || "",
        stayYears: values.stayYears || "",
        bornAddress: values.bornAddress || "",
      });
      toast({
        title: "Update successful",
        description: "Personal data has been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Unable to update personal data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleGeolocation = (setFieldValue) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFieldValue("homeLatitude", position.coords.latitude);
        setFieldValue("homeLongitude", position.coords.longitude);

        toast({
          title: "ปักหมุดที่พักอาศัยสำเร็จ",
          description: "ระบบได้รับข้อมูลของท่านเรียบร้อย",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      });
    } else {
      toast({
        title: "ไม่สามารถปักหมุดที่พักอาศัย",
        description: "กรุณาลองใหม่อีกครั้ง",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const validateForm = (values) => {
    const errors = {};

    if (!values.gender) errors.gender = "กรุณาเลือกเพศ";
    if (!values.firstName) errors.firstName = "กรุณาใส่ข้อมูลชื่อ";
    if (!values.lastName) errors.lastName = "กรุณาใส่ข้อมูลนามสกุล";
    if (!values.phoneNumber) errors.phoneNumber = "กรุณาใส่หมายเลขโทรศัพท์";
    else if (!/^[0-9]{10}$/.test(values.phoneNumber))
      errors.phoneNumber = "กรุณาใส่ข้อมูลหมายเลขโทรศัพท์ 10 หลัก";
    if (!values.age) errors.age = "กรุณาใส่ข้อมูลอายุ";
    else if (values.age < 1) errors.age = "ข้อมูลอายุต้องไม่ต่ำกว่า 1 ปี";
    if (!values.nation) errors.nation = "กรุณาเลือกสัญชาติ";
    if (!values.stayYears)
      errors.stayYears = "กรุณาใส่ระยะเวลาที่อาศัยอยู่ในพื้นที่";
    else if (values.stayYears < 1)
      errors.stayYears =
        "ข้อมูลระยะเวลาที่อาศัยอยู่ในพื้นที่ต้องไม่ต่ำกว่า 1 ปี";

    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validate={validateForm}
      onSubmit={handleUpdate}
    >
      {({
        values,
        setFieldValue,
        errors,
        touched,
        handleBlur,
        handleSubmit,
      }) => (
        <Stack spacing={4} as="form" onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>เลขประจำตัวประชาชนหรือ Passport</FormLabel>
            <Field
              as={Input}
              name="idNumber"
              placeholder="เลขประจำตัวประชาชนหรือเลข Passport"
              onBlur={handleBlur}
            />
            <FormErrorMessage>{errors.idNumber}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!errors.gender && touched.gender}
            as="fieldset"
          >
            <FormLabel as="legend">เพศ*</FormLabel>
            <RadioGroup name="gender" onBlur={handleBlur} value={values.gender}>
              <Stack direction="row" spacing={4}>
                <Field as={Radio} name="gender" value="ชาย">
                  ชาย
                </Field>
                <Field as={Radio} name="gender" value="หญิง">
                  หญิง
                </Field>
              </Stack>
            </RadioGroup>
            <FormErrorMessage>{errors.gender}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.firstName && touched.firstName}>
            <FormLabel>ชื่อ*</FormLabel>
            <Field
              as={Input}
              name="firstName"
              placeholder="ใส่เฉพาะข้อความ"
              onBlur={handleBlur}
            />
            <FormErrorMessage>{errors.firstName}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.lastName && touched.lastName}>
            <FormLabel>นามสกุล*</FormLabel>
            <Field
              as={Input}
              name="lastName"
              placeholder="ใส่เฉพาะข้อความ"
              onBlur={handleBlur}
            />
            <FormErrorMessage>{errors.lastName}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.phoneNumber && touched.phoneNumber}>
            <FormLabel>หมายเลขโทรศัพท์*</FormLabel>
            <Field
              as={Input}
              type="tel"
              name="phoneNumber"
              placeholder="ใส่เฉพาะตัวเลข เช่น 0801234567"
              pattern="[0-9]{10}"
              onBlur={handleBlur}
            />
            <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.birth && touched.birth}>
            <FormLabel>วันเดือนปีเกิด (ค.ศ.)</FormLabel>
            <Field
              as={Input}
              type="date"
              name="birth"
              placeholder="ใส่เฉพาะตัวเลข"
              max={maxDate}
              onChange={(e) => handleBirthChange(e, setFieldValue)}
              onBlur={handleBlur}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.age && touched.age}>
            <FormLabel>อายุ*</FormLabel>
            <InputGroup>
              <Field
                as={Input}
                type="number"
                name="age"
                placeholder="ใส่เฉพาะตัวเลข"
                min={1}
                step={1}
                onBlur={handleBlur}
              />
              <InputRightAddon>ปี</InputRightAddon>
            </InputGroup>
            <FormErrorMessage>{errors.age}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.nation && touched.nation}>
            <FormLabel>สัญชาติ*</FormLabel>
            <Field as={Select} name="nation" onBlur={handleBlur}>
              {nationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <FormErrorMessage>{errors.nation}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>ที่อยู่ที่พักอาศัย</FormLabel>
            <Field
              as={Textarea}
              name="homeAddress"
              placeholder="ใส่บ้านเลขที่ หมู่ที่ ตำบล ของที่พักอาศัย"
              onBlur={handleBlur}
            />
          </FormControl>

          <div className="flex gap-2">
            <FormControl>
              <FormLabel>Latitude</FormLabel>
              <Field
                as={Input}
                type="number"
                name="homeLatitude"
                placeholder="Latitude"
                step="any"
                min="-90"
                max="90"
                onBlur={handleBlur}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Longitude</FormLabel>
              <Field
                as={Input}
                type="number"
                name="homeLongitude"
                placeholder="Longitude"
                step="any"
                min="-180"
                max="180"
                onBlur={handleBlur}
              />
            </FormControl>
          </div>

          <Button
            onClick={() => handleGeolocation(setFieldValue)}
            colorScheme="teal"
          >
            <MdLocationOn />
            ปักหมุดที่พักอาศัย
          </Button>

          <FormControl isInvalid={!!errors.stayYears && touched.stayYears}>
            <FormLabel>ระยะเวลาที่อาศัยอยู่ในพื้นที่*</FormLabel>
            <InputGroup>
              <Field
                as={Input}
                type="number"
                name="stayYears"
                placeholder="ใส่เฉพาะตัวเลข"
                min={1}
                step={1}
                onBlur={handleBlur}
              />
              <InputRightAddon>ปี</InputRightAddon>
            </InputGroup>
            <FormErrorMessage>{errors.stayYears}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.bornAddress && touched.bornAddress}>
            <FormLabel>ที่อยู่ภูมิลำเนาเดิม (กรณีมีการย้ายถิ่นฐาน)</FormLabel>
            <Field
              as={Textarea}
              name="bornAddress"
              placeholder="ใส่ที่อยู่หรือจังหวัดภูมิลำเนาเดิม"
              onBlur={handleBlur}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="green"
            isDisabled={Object.keys(validateForm(values)).length > 0}
          >
            <span>บันทึกข้อมูล</span>
          </Button>
        </Stack>
      )}
    </Formik>
  );
}
