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
import { Field, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { nationOptions } from "./Option";
import { MdLocationOn, MdNavigateNext } from "react-icons/md";

export default function PersonalInfoTab({ nextTab }) {
  const { values, setFieldValue, errors, touched, handleBlur } =
    useFormikContext();
  const toast = useToast();

  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const today = new Date();
  today.setDate(today.getDate() - 1);
  const maxDate = today.toISOString().split("T")[0];

  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const gregorianYear = selectedYear - 543;
      const birthDate = new Date(gregorianYear, selectedMonth - 1, selectedDay);

      if (!isNaN(birthDate)) {
        const isoDate = birthDate.toISOString();
        setFieldValue("birth", isoDate);
      }
    }
  }, [selectedDay, selectedMonth, selectedYear, setFieldValue]);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const thisYear = today.getFullYear();
    const birthYear = birthDate.getFullYear();
    const age = thisYear - birthYear;

    const thisMonth = today.getMonth();
    const birthMonth = birthDate.getMonth();
    const thisDay = today.getDate();
    const birthDay = birthDate.getDate();

    if (
      thisMonth < birthMonth ||
      (thisMonth === birthMonth && thisDay < birthDay)
    ) {
      return age;
    }
    return age;
  };

  useEffect(() => {
    if (values.birth) {
      const birthDate = new Date(values.birth);
      if (!isNaN(birthDate)) {
        const age = calculateAge(birthDate);
        setFieldValue("age", age);
      }
    }
  }, [values.birth, setFieldValue]);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFieldValue("homeLatitude", position.coords.latitude);
        setFieldValue("homeLongitude", position.coords.longitude);
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

  const isFormValid = () => {
    return (
      values.gender &&
      values.firstName &&
      values.lastName &&
      values.phoneNumber &&
      values.age &&
      values.nation
    );
  };

  return (
    <Stack spacing={4}>
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

      <FormControl isInvalid={!!errors.gender && touched.gender} as="fieldset">
        <FormLabel as="legend">เพศ*</FormLabel>
        <RadioGroup name="gender" onBlur={handleBlur}>
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

      <FormControl isInvalid={!!errors.prefix && touched.prefix}>
        <FormLabel>คำนำหน้าชื่อ*</FormLabel>
        <Field
          as={Select}
          name="prefix"
          onBlur={handleBlur}
          validate={(value) => {
            let error;
            if (!value) {
              error = "กรุณาใส่ข้อมูลคำนำหน้าชื่อ";
            }
            return error;
          }}
        >
          <option value="">เลือกคำนำหน้าชื่อ</option>
          <option value="นาย">นาย</option>
          <option value="นาง">นาง</option>
          <option value="นางสาว">นางสาว</option>
        </Field>
        <FormErrorMessage>{errors.prefix}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.firstName && touched.firstName}>
        <FormLabel>ชื่อ*</FormLabel>
        <Field
          as={Input}
          name="firstName"
          placeholder="ใส่เฉพาะข้อความ"
          onBlur={handleBlur}
          validate={(value) => {
            let error;
            if (!value) {
              error = "กรุณาใส่ข้อมูลชื่อ";
            }
            return error;
          }}
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
          validate={(value) => {
            let error;
            if (!value) {
              error = "กรุณาใส่ข้อมูลนามสกุล";
            }
            return error;
          }}
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
          validate={(value) => {
            let error;
            if (!/^[0-9]{10}$/.test(value)) {
              error = "กรุณาใส่ข้อมูลหมายเลขโทรศัพท์ 10 หลัก";
            }
            return error;
          }}
        />
        <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.birth && touched.birth}>
        <FormLabel>วันเดือนปีเกิด (พ.ศ.)</FormLabel>
        <div className="flex gap-2">
          <Select
            placeholder="วัน"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            onBlur={handleBlur}
          >
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </Select>
          <Select
            placeholder="เดือน"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            onBlur={handleBlur}
          >
            {[
              "มกราคม",
              "กุมภาพันธ์",
              "มีนาคม",
              "เมษายน",
              "พฤษภาคม",
              "มิถุนายน",
              "กรกฎาคม",
              "สิงหาคม",
              "กันยายน",
              "ตุลาคม",
              "พฤศจิกายน",
              "ธันวาคม",
            ].map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </Select>
          <Select
            placeholder="ปี (พ.ศ.)"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            onBlur={handleBlur}
          >
            {Array.from({ length: 100 }, (_, i) => {
              const buddhistYear = today.getFullYear() + 543 - i;
              return (
                <option key={buddhistYear} value={buddhistYear}>
                  {buddhistYear}
                </option>
              );
            })}
          </Select>
        </div>
        <FormErrorMessage>{errors.birth}</FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={!!errors.birth && touched.birth}
        className="hidden"
      >
        <FormLabel>วันเดือนปีเกิด (ค.ศ.)</FormLabel>
        <Field
          as={Input}
          type="text"
          name="birth"
          placeholder="ใส่เฉพาะตัวเลข"
          max={maxDate}
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
            validate={(value) => {
              let error;
              if (value === 0) {
                error = "ข้อมูลอายุต้องไม่ต่ำกว่า 1 ปี";
              } else if (!value) {
                error = "กรุณาใส่ข้อมูลอายุ";
              } else if (value < 1) {
                error = "ข้อมูลอายุต้องไม่ต่ำกว่า 1 ปี";
              }
              return error;
            }}
          />
          <InputRightAddon>ปี</InputRightAddon>
        </InputGroup>
        <FormErrorMessage>{errors.age}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.nation && touched.nation}>
        <FormLabel>สัญชาติ*</FormLabel>
        <Field
          as={Select}
          name="nation"
          onBlur={handleBlur}
          validate={(value) => {
            let error;
            if (!value) {
              error = "กรุณาเลือกสัญชาติ";
            }
            return error;
          }}
        >
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

      <Button onClick={handleGeolocation} colorScheme="teal">
        <MdLocationOn />
        ปักหมุดที่พักอาศัย
      </Button>

      <FormControl isInvalid={!!errors.workingYears && touched.workingYears}>
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
            validate={(value) => {
              let error;
              if (value === 0) {
                error =
                  "ข้อมูลระยะเวลาที่อาศัยอยู่ในพื้นที่ต้องไม่ต่ำกว่า 1 ปี";
              } else if (!value) {
                error = "กรุณาใส่ข้อมูลระยะเวลาที่อาศัยอยู่ในพื้นที่";
              } else if (value < 1) {
                error =
                  "ข้อมูลระยะเวลาที่อาศัยอยู่ในพื้นที่ต้องไม่ต่ำกว่า 1 ปี";
              }
              return error;
            }}
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
        type="button"
        onClick={nextTab}
        colorScheme="green"
        className="w-full disabled:text-black"
        isDisabled={!isFormValid()}
      >
        <span>ถัดไป</span>
        <MdNavigateNext className="text-4xl text-neutral" />
      </Button>
    </Stack>
  );
}
