import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  InputGroup,
  InputRightAddon,
  Button,
  FormErrorMessage,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import { Field, useFormikContext } from "formik";
import { medicalOptions } from "./Option";
import { useEffect, useState } from "react";
import { MdNavigateBefore } from "react-icons/md";

export default function HealthInfoTab({ prevTab, isLoading }) {
  const { values, setFieldValue, errors, touched, handleBlur } =
    useFormikContext();
  const { bodyWeight, bodyHeight, bmi } = values;
  const [disableOtherDiseases, setDisableOtherDiseases] = useState(false);
  const [earSymptoms, setEarSymptoms] = useState("");

  useEffect(() => {
    if (bodyWeight && bodyHeight) {
      const weight = parseFloat(bodyWeight);
      const height = parseFloat(bodyHeight) / 100;
      if (height > 0) {
        const calculatedBmi = (weight / (height * height)).toFixed(0);
        setFieldValue("bmi", calculatedBmi);
      }
    } else {
      setFieldValue("bmi", "");
    }
  }, [bodyWeight, bodyHeight, setFieldValue]);

  const getBmiCategory = (bmi) => {
    if (!bmi) return { color: "gray", label: "ไม่พบข้อมูล" };
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5)
      return { color: "blue.300", label: "น้ำหนักต่ำกว่าเกณฑ์" };
    if (bmiValue < 23) return { color: "green.300", label: "สมส่วน" };
    if (bmiValue < 25) return { color: "yellow.300", label: "น้ำหนักเกิน" };
    if (bmiValue < 30) return { color: "orange.300", label: "ภาวะอ้วน" };
    return { color: "red.300", label: "ภาวะอ้วนอันตราย" };
  };

  const handleDiseasesChange = (value) => {
    if (value.includes("ไม่มี")) {
      setFieldValue("diseases", ["ไม่มี"]);
      setDisableOtherDiseases(true);
    } else {
      setFieldValue("diseases", value);
      setDisableOtherDiseases(false);
    }
  };

  const isFormValid = () => {
    return values.medical && values.diseases && values.earSymptoms;
  };

  return (
    <Stack spacing={4}>
      <FormControl isInvalid={!!errors.bodyWeight && touched.bodyWeight}>
        <FormLabel>น้ำหนักร่างกาย*</FormLabel>
        <InputGroup>
          <Field
            as={Input}
            type="number"
            name="bodyWeight"
            placeholder="ใส่เฉพาะตัวเลข"
            min={10}
            step={1}
            validate={(value) => {
              let error;
              if (value === 0) {
                error = "ข้อมูลน้ำหนักร่างกายต้องไม่ต่ำกว่า 1 กิโลกรัม";
              } else if (!value) {
                error = "กรุณาใส่ข้อมูลน้ำหนักร่างกาย";
              } else if (value < 1) {
                error = "ข้อมูลน้ำหนักร่างกายต้องไม่ต่ำกว่า 1 กิโลกรัม";
              }
              return error;
            }}
          />
          <InputRightAddon>กิโลกรัม</InputRightAddon>
        </InputGroup>
        <FormErrorMessage>{errors.bodyWeight}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.bodyHeight && touched.bodyHeight}>
        <FormLabel>ส่วนสูงร่างกาย*</FormLabel>
        <InputGroup>
          <Field
            as={Input}
            type="number"
            name="bodyHeight"
            placeholder="ใส่เฉพาะตัวเลข"
            min={50}
            step={1}
            validate={(value) => {
              let error;
              if (value === 0) {
                error = "ข้อมูลส่วนสูงร่างกายต้องไม่ต่ำกว่า 1 เซนติเมตร";
              } else if (!value) {
                error = "กรุณาใส่ข้อมูลส่วนสูงร่างกาย";
              } else if (value < 1) {
                error = "ข้อมูลส่วนสูงร่างกายต้องไม่ต่ำกว่า 1 เซนติเมตร";
              }
              return error;
            }}
          />
          <InputRightAddon>เซนติเมตร</InputRightAddon>
        </InputGroup>
        <FormErrorMessage>{errors.bodyHeight}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>BMI</FormLabel>
        <InputGroup>
          <Field as={Input} name="bmi" readOnly placeholder="BMI" />
          <InputRightAddon
            bg={getBmiCategory(bmi).color}
            className="text-black"
          >
            {getBmiCategory(bmi).label}
          </InputRightAddon>
        </InputGroup>
      </FormControl>

      <FormControl isInvalid={!!errors.medical && touched.medical}>
        <FormLabel>สิทธิการรักษาพยาบาล*</FormLabel>
        <Field
          as={Select}
          name="medical"
          validate={(value) => {
            let error;
            if (!value) {
              error = "กรุณาเลือกสิทธิการรักษาพยาบาล";
            }
            return error;
          }}
        >
          {medicalOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
        <FormErrorMessage>{errors.medical}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>โรคประจำตัว*</FormLabel>
        <Field name="diseases">
          {({ field }) => (
            <CheckboxGroup
              value={field.value}
              onChange={(value) => handleDiseasesChange(value)}
            >
              <Stack spacing={2} align="start">
                <Checkbox value="ไม่มี">ไม่มี</Checkbox>
                <Checkbox
                  value="โรคปอดฝุ่นหิน"
                  isDisabled={disableOtherDiseases}
                >
                  โรคประสาทหูเสื่อม/สูญเสียการได้ยิน
                </Checkbox>
                <Checkbox
                  value="โรคประสาทหูเสื่อม"
                  isDisabled={disableOtherDiseases}
                >
                  โรคปอดฝุ่นหิน (ซิลิโคสิส)
                </Checkbox>
                <Checkbox value="โรคเบาหวาน" isDisabled={disableOtherDiseases}>
                  โรคเบาหวาน
                </Checkbox>
                <Checkbox
                  value="โรคหลอดเลือดสมองและหัวใจ"
                  isDisabled={disableOtherDiseases}
                >
                  โรคหลอดเลือดสมองและหัวใจ
                </Checkbox>
                <Checkbox
                  value="โรคถุงลมโป่งพอง"
                  isDisabled={disableOtherDiseases}
                >
                  โรคถุงลมโป่งพอง
                </Checkbox>
                <Checkbox value="โรคมะเร็ง" isDisabled={disableOtherDiseases}>
                  โรคมะเร็ง
                </Checkbox>
                <Checkbox
                  value="โรคความดันโลหิตสูง"
                  isDisabled={disableOtherDiseases}
                >
                  โรคความดันโลหิตสูง
                </Checkbox>
                <Checkbox
                  value="โรคไขมันในเลือดสูง"
                  isDisabled={disableOtherDiseases}
                >
                  โรคไขมันในเลือดสูง
                </Checkbox>
                <Checkbox value="อื่น ๆ" isDisabled={disableOtherDiseases}>
                  อื่น ๆ
                </Checkbox>
              </Stack>
            </CheckboxGroup>
          )}
        </Field>
      </FormControl>

      <FormControl>
        <FormLabel>อาการผิดปกติเกี่ยวกับหู*</FormLabel>
        <Field
          as={Select}
          name="earSymptoms"
          onChange={(e) => {
            setEarSymptoms(e.target.value);
            setFieldValue("earSymptoms", e.target.value);
            if (e.target.value !== "มีอาการ") {
              setFieldValue("earSymptomsDetails", "");
            }
          }}
        >
          <option value="">เลือกอาการผิดปกติเกี่ยวกับหู</option>
          <option value="ไม่มีอาการ">ไม่มีอาการ</option>
          <option value="มีอาการ">มีอาการ</option>
        </Field>
      </FormControl>

      {earSymptoms === "มีอาการ" && (
        <FormControl>
          <FormLabel>ระบุอาการผิดปกติเกี่ยวกับหู*</FormLabel>
          <Field
            as={Input}
            type="text"
            name="earSymptomsDetails"
            placeholder="ระบุอาการผิดปกติเกี่ยวกับหู"
          />
        </FormControl>
      )}

      <div className="flex justify-between gap-10">
        <Button
          type="button"
          onClick={prevTab}
          colorScheme="orange"
          className="w-full"
        >
          <MdNavigateBefore className="text-4xl text-bases" />
          ย้อนกลับ
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          colorScheme="green"
          className="w-full disabled:text-black"
          isDisabled={!isFormValid()}
        >
          บันทึกข้อมูล
        </Button>
      </div>
    </Stack>
  );
}
