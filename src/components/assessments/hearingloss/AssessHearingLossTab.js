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
import { silicaDustOptions } from "../../register/worker/Option";
import { MdNavigateNext } from "react-icons/md";

export default function AssessHearingLossTab({ submitForm }) {
  const { values, setFieldValue, errors, touched, handleBlur } =
    useFormikContext();

  useEffect(() => {
    const selectedPosition = silicaDustOptions.find(
      (option) => option.value === values.position
    );

    if (selectedPosition) {
      if (!values.noiseLevel || values.noiseLevel === null) {
        setFieldValue("noiseLevel", "เฉลี่ย");
      }

      if (values.noiseLevel === "ต่ำสุด") {
        setFieldValue("noise", selectedPosition.noiseMin || "");
      } else if (values.noiseLevel === "เฉลี่ย") {
        setFieldValue("noise", selectedPosition.noiseAvg || "");
      } else if (values.noiseLevel === "สูงสุด") {
        setFieldValue("noise", selectedPosition.noiseMax || "");
      }
    } else {
      setFieldValue("noise", "");
    }
  }, [values.position, values.noiseLevel, setFieldValue]);

  const isFormValid = () => {
    return (
      values.position &&
      values.noise &&
      values.workingHours &&
      values.bodyHeight &&
      values.earSymptoms
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

      <FormControl isInvalid={!!errors.noise && touched.noise}>
        <div className="flex flex-row items-center justify-between mb-1">
          <FormLabel>ระดับเสียง*</FormLabel>
          {values.position !== "อื่น ๆ" && (
            <div>
              <FormControl>
                <Field as={Select} name="noiseLevel">
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
            name="noise"
            placeholder="ใส่เฉพาะตัวเลข"
            min={0}
            step={0.01}
            validate={(value) => {
              let error;
              if (!value) {
                error = "กรุณาใส่ข้อมูลระดับความดันเสียง";
              } else if (value < 0) {
                error = "ข้อมูลระดับความดันเสียงต้องไม่ต่ำกว่า 0 db(A)";
              }
              return error;
            }}
          />
          <InputRightAddon>dB(A)</InputRightAddon>
        </InputGroup>
        <FormErrorMessage>{errors.noise}</FormErrorMessage>
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
        <FormLabel>อาการผิดปกติเกี่ยวกับหู*</FormLabel>
        <Field as={Select} name="earSymptoms">
          <option value="">เลือกอาการผิดปกติเกี่ยวกับหู</option>
          <option value="ไม่มีอาการ">ไม่มีอาการ</option>
          <option value="มีอาการ">มีอาการ</option>
        </Field>
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
