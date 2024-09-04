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
  useToast,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { medicalOptions } from "../register/worker/Option";

export default function UpdateHealthTab() {
  const [disableOtherDiseases, setDisableOtherDiseases] = useState(false);
  const [earSymptoms, setEarSymptoms] = useState("");
  const toast = useToast();
  const router = useRouter();
  const { personalId } = router.query;

  const [initialValues, setInitialValues] = useState({
    bodyWeight: "",
    bodyHeight: "",
    bmi: "",
    medical: "",
    diseases: [],
    earSymptoms: "",
    earSymptomsDetails: "",
  });

  useEffect(() => {
    if (!personalId) return;

    const fetchHealthData = async () => {
      try {
        const response = await axios.get(`/api/health/${personalId}`);
        const data = response.data || {};

        setInitialValues({
          bodyWeight: data.body_weight || "",
          bodyHeight: data.body_height || "",
          bmi: data.bmi || "",
          medical: data.medical || "",
          diseases: data.diseases || [],
          earSymptoms: data.ear_symptoms || "",
          earSymptomsDetails: data.ear_symptoms_details || "",
        });
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Unable to load health data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchHealthData();
  }, [personalId, toast]);

  const calculateBmi = (weight, height) => {
    if (height > 0) {
      return (weight / (height / 100) ** 2).toFixed(1);
    }
    return "";
  };

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

  const handleDiseasesChange = (value, setFieldValue) => {
    if (value.includes("ไม่มี")) {
      setFieldValue("diseases", ["ไม่มี"]);
      setDisableOtherDiseases(true);
    } else {
      setFieldValue("diseases", value);
      setDisableOtherDiseases(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await axios.put(`/api/health/${personalId}`, {
        bodyWeight: values.bodyWeight,
        bodyHeight: values.bodyHeight,
        bmi: values.bmi,
        medical: values.medical,
        diseases: values.diseases,
        earSymptoms: values.earSymptoms,
        earSymptomsDetails: values.earSymptomsDetails,
      });
      toast({
        title: "Update successful",
        description: "Health data has been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Unable to update health data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => (
        <Stack spacing={4} as="form" onSubmit={handleSubmit}>
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
                  if (!value || value < 1) {
                    error = "ข้อมูลน้ำหนักร่างกายต้องไม่ต่ำกว่า 1 กิโลกรัม";
                  }
                  return error;
                }}
                onChange={(e) => {
                  const weight = e.target.value;
                  setFieldValue("bodyWeight", weight);
                  setFieldValue("bmi", calculateBmi(weight, values.bodyHeight));
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
                  if (!value || value < 1) {
                    error = "ข้อมูลส่วนสูงร่างกายต้องไม่ต่ำกว่า 1 เซนติเมตร";
                  }
                  return error;
                }}
                onChange={(e) => {
                  const height = e.target.value;
                  setFieldValue("bodyHeight", height);
                  setFieldValue("bmi", calculateBmi(values.bodyWeight, height));
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
                bg={getBmiCategory(values.bmi).color}
                className="text-black"
              >
                {getBmiCategory(values.bmi).label}
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
                  onChange={(value) =>
                    handleDiseasesChange(value, setFieldValue)
                  }
                >
                  <Stack spacing={2} align="start">
                    <Checkbox value="ไม่มี">ไม่มี</Checkbox>
                    <Checkbox
                      value="โรคปอดฝุ่นหิน"
                      isDisabled={disableOtherDiseases}
                    >
                      โรคปอดฝุ่นหิน (ซิลิโคสิส)
                    </Checkbox>
                    <Checkbox
                      value="โรคประสาทหูเสื่อม/สูญเสียการได้ยิน"
                      isDisabled={disableOtherDiseases}
                    >
                      โรคประสาทหูเสื่อม/สูญเสียการได้ยิน
                    </Checkbox>
                    <Checkbox
                      value="โรคเบาหวาน"
                      isDisabled={disableOtherDiseases}
                    >
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
                    <Checkbox
                      value="โรคมะเร็ง"
                      isDisabled={disableOtherDiseases}
                    >
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
                const value = e.target.value;
                setEarSymptoms(value);
                setFieldValue("earSymptoms", value);
                if (value !== "มีอาการ") {
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
            <FormControl
              isInvalid={
                !!errors.earSymptomsDetails && touched.earSymptomsDetails
              }
            >
              <FormLabel>ระบุอาการผิดปกติเกี่ยวกับหู*</FormLabel>
              <Field
                as={Input}
                type="text"
                name="earSymptomsDetails"
                placeholder="ระบุอาการผิดปกติเกี่ยวกับหู"
              />
              <FormErrorMessage>{errors.earSymptomsDetails}</FormErrorMessage>
            </FormControl>
          )}

          <Button type="submit" colorScheme="green">
            <span>บันทึกข้อมูล</span>
          </Button>
        </Stack>
      )}
    </Formik>
  );
}
