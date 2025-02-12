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
} from "@chakra-ui/react";
import { Field, useFormikContext } from "formik";
import { useEffect } from "react";
import {
  diseaseOptions,
  silicaDustOptions,
  workOptions,
} from "../../register/worker/Option";
import { MdNavigateNext } from "react-icons/md";

export default function AssessSilicosisTab({ submitForm }) {
  const { values, setFieldValue, errors, touched, handleBlur } =
    useFormikContext();

  useEffect(() => {
    const selectedPosition = silicaDustOptions.find(
      (option) => option.value === values.position
    );

    if (selectedPosition) {
      if (!values.silicaDustLevel || values.silicaDustLevel === null) {
        setFieldValue("silicaDustLevel", "เฉลี่ย");
      }

      if (values.silicaDustLevel === "ต่ำสุด") {
        setFieldValue("silicaDust", selectedPosition.silicaDustMin || "");
      } else if (values.silicaDustLevel === "เฉลี่ย") {
        setFieldValue("silicaDust", selectedPosition.silicaDustAvg || "");
      } else if (values.silicaDustLevel === "สูงสุด") {
        setFieldValue("silicaDust", selectedPosition.silicaDustMax || "");
      }
    } else {
      setFieldValue("silicaDust", "");
    }
  }, [values.position, values.silicaDustLevel, setFieldValue]);

  const isFormValid = () => {
    return (
      values.position &&
      values.silicaDust &&
      values.workingHours &&
      values.disease &&
      values.workSeparation
    );
  };

  return (
    <Stack spacing={4}>
      <FormControl isInvalid={!!errors.position && touched.position}>
        <FormLabel>ตำแหน่งงาน*</FormLabel>
        <Field
          as={Select}
          name="position"
          validate={(value) => {
            let error;
            if (!value) {
              error = "กรุณาเลือกตำแหน่งงาน";
            }
            return error;
          }}
        >
          {silicaDustOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
        <FormErrorMessage>{errors.position}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.silicaDust && touched.silicaDust}>
        <div className="flex flex-row items-center justify-between mb-1">
          <FormLabel>ความเข้มข้นฝุ่นซิลิกา*</FormLabel>
          {values.position !== "อื่น ๆ" && (
            <div>
              <FormControl>
                <Field as={Select} name="silicaDustLevel">
                  <option value="ต่ำสุด">ต่ำสุด</option>
                  <option value="เฉลี่ย">เฉลี่ย</option>
                  <option value="สูงสุด">สูงสุด</option>
                </Field>
              </FormControl>
            </div>
          )}
        </div>
        <InputGroup>
          <Field
            as={Input}
            type="number"
            name="silicaDust"
            placeholder="ใส่เฉพาะตัวเลข"
            min={0}
            step={0.01}
            validate={(value) => {
              let error;
              if (!value) {
                error = "กรุณาใส่ข้อมูลความเข้มข้นฝุ่นซิลิกา";
              } else if (value < 0) {
                error = "ข้อมูลความเข้มข้นฝุ่นซิลิกาต้องไม่ต่ำกว่า 0";
              }
              return error;
            }}
          />
          <InputRightAddon>
            mg/m<sup>3</sup>
          </InputRightAddon>
        </InputGroup>
        <FormErrorMessage>{errors.silicaDust}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.workingHours && touched.workingHours}>
        <FormLabel>ชั่วโมงการทำงานต่อวัน*</FormLabel>
        <InputGroup>
          <Field
            as={Input}
            type="number"
            name="workingHours"
            placeholder="ใส่เฉพาะตัวเลข"
            min={1}
            max={24}
            step={1}
            validate={(value) => {
              let error;
              if (value === 0) {
                error = "ข้อมูลชั่วโมงการทำงานต่อวันต้องไม่ต่ำกว่า 1 ชั่วโมง";
              } else if (!value) {
                error = "กรุณาใส่ข้อมูลชั่วโมงการทำงานต่อวัน";
              } else if (value < 1) {
                error = "ข้อมูลชั่วโมงการทำงานต่อวันต้องไม่ต่ำกว่า 1 ชั่วโมง";
              } else if (value > 24) {
                error = "ข้อมูลชั่วโมงการทำงานต่อวันต้องไม่เกินกว่า 24 ชั่วโมง";
              }
              return error;
            }}
          />
          <InputRightAddon>ชั่วโมง</InputRightAddon>
        </InputGroup>
        <FormErrorMessage>{errors.workingHours}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.disease && touched.disease}>
        <FormLabel>การมีโรคประจำตัว*</FormLabel>
        <Field as={Select} name="disease">
          {diseaseOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
        <FormErrorMessage>{errors.disease}</FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={!!errors.workSeparation && touched.workSeparation}
      >
        <FormLabel>ลักษณะสถานที่ทำงาน*</FormLabel>
        <Field
          as={Select}
          name="workSeparation"
          validate={(value) => {
            let error;
            if (!value) {
              error = "กรุณาเลือกลักษณะสถานที่ทำงาน";
            }
            return error;
          }}
        >
          {workOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
        <FormErrorMessage>{errors.workSeparation}</FormErrorMessage>
      </FormControl>

      <Button
        type="button"
        onClick={submitForm}
        colorScheme="green"
        className="w-full disabled:text-black"
        isDisabled={!isFormValid()}
      >
        ประเมินความเสี่ยง
        <MdNavigateNext className="text-4xl text-bases" />
      </Button>
    </Stack>
  );
}
