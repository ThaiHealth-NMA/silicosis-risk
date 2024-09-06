import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  InputGroup,
  InputRightAddon,
  CheckboxGroup,
  Checkbox,
  Textarea,
  Button,
  FormErrorMessage,
  useToast,
  InputLeftAddon,
} from "@chakra-ui/react";
import { Field, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { silicaDustOptions, workOptions } from "./Option";
import { MdNavigateBefore, MdNavigateNext, MdLocationOn } from "react-icons/md";

export default function WorkInfoTab({ nextTab, prevTab }) {
  const { values, setFieldValue, errors, touched, handleBlur } =
    useFormikContext();
  const [disableOtherPPE, setDisableOtherPPE] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const selectedSilicaDust = silicaDustOptions.find(
      (option) => option.value === values.position
    );

    if (selectedSilicaDust) {
      setFieldValue("silicaDust", selectedSilicaDust.silicaDustAvg || "");
    }
  }, [values.position, setFieldValue]);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFieldValue("workLatitude", position.coords.latitude);
        setFieldValue("workLongitude", position.coords.longitude);
      });
    } else {
      toast({
        title: "ไม่สามารถปักหมุดที่ทำงาน",
        description: "กรุณาลองใหม่อีกครั้ง",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePPEChange = (value) => {
    if (value.includes("ไม่ได้ใช้")) {
      setFieldValue("ppe", ["ไม่ได้ใช้"]);
      setDisableOtherPPE(true);
    } else {
      setFieldValue("ppe", value);
      setDisableOtherPPE(false);
    }
  };

  const isFormValid = () => {
    return (
      values.position &&
      values.silicaDust > 0 &&
      values.workingHours > 0 &&
      values.workingWeeks > 0 &&
      values.workingYears > 0 &&
      values.workSeparation &&
      values.ppe != ""
    );
  };

  return (
    <Stack spacing={4}>
      <FormControl isInvalid={!!errors.position && touched.position}>
        <FormLabel>ตำแหน่งงาน*</FormLabel>
        <Field
          as={Select}
          name="position"
          onBlur={handleBlur}
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
        <FormLabel>ความเข้มข้นฝุ่นซิลิกา*</FormLabel>
        <InputGroup>
          <Field
            as={Input}
            type="number"
            name="silicaDust"
            placeholder="ใส่เฉพาะตัวเลข"
            min={0}
            step={0.001}
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

      <FormControl isInvalid={!!errors.workingWeeks && touched.workingWeeks}>
        <FormLabel>วันทำงานต่อสัปดาห์*</FormLabel>
        <InputGroup>
          <Field
            as={Input}
            type="number"
            name="workingWeeks"
            placeholder="ใส่เฉพาะตัวเลข"
            min={1}
            max={7}
            step={1}
            validate={(value) => {
              let error;
              if (value === 0) {
                error = "ข้อมูลวันทำงานต่อสัปดาห์ต้องไม่ต่ำกว่า 1 วัน";
              } else if (!value) {
                error = "กรุณาใส่ข้อมูลวันทำงานต่อสัปดาห์";
              } else if (value < 1) {
                error = "ข้อมูลวันทำงานต่อสัปดาห์ต้องไม่ต่ำกว่า 1 วัน";
              } else if (value > 24) {
                error = "ข้อมูลวันทำงานต่อสัปดาห์ต้องไม่เกินกว่า 24 วัน";
              }
              return error;
            }}
          />
          <InputRightAddon>วัน</InputRightAddon>
        </InputGroup>
        <FormErrorMessage>{errors.workingWeeks}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.workingYears && touched.workingYears}>
        <FormLabel>ประสบการณ์ทำอาชีพแกะสลักหิน*</FormLabel>
        <InputGroup>
          <Field
            as={Input}
            type="number"
            name="workingYears"
            placeholder="ใส่เฉพาะตัวเลข (ถ้าไม่ถึงปีให้ใส่ 1 ปี)"
            min={1}
            step={1}
            validate={(value) => {
              let error;
              if (value === 0) {
                error = "ข้อมูลประสบการณ์ครกหินต้องไม่ต่ำกว่า 1 ปี";
              } else if (!value) {
                error = "กรุณาใส่ข้อมูลประสบการณ์ครกหิน";
              } else if (value < 1) {
                error = "ข้อมูลประสบการณ์ครกหินต้องไม่ต่ำกว่า 1 ปี";
              }
              return error;
            }}
          />
          <InputRightAddon>ปี</InputRightAddon>
        </InputGroup>
        <FormErrorMessage>{errors.workingYears}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>ที่อยู่หรือชื่อสถานที่ทำงาน*</FormLabel>
        <Field
          as={Textarea}
          name="workAddress"
          placeholder="ใส่ชื่อ บ้านเลขที่ หมู่ที่ ตำบล ของสถานที่ทำงาน"
        />
      </FormControl>

      <div className="flex gap-2">
        <FormControl>
          <FormLabel>Latitude</FormLabel>
          <Field
            as={Input}
            type="number"
            name="workLatitude"
            placeholder="Latitude"
            step="any"
            min="-90"
            max="90"
            readOnly
          />
        </FormControl>

        <FormControl>
          <FormLabel>Longitude</FormLabel>
          <Field
            as={Input}
            type="number"
            name="workLongitude"
            placeholder="Longitude"
            step="any"
            min="-180"
            max="180"
            readOnly
          />
        </FormControl>
      </div>

      <Button onClick={handleGeolocation} colorScheme="teal">
        <MdLocationOn />
        ปักหมุดที่ทำงาน
      </Button>

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

      <FormControl>
        <FormLabel>การใช้อุปกรณ์ป้องกันอันตรายส่วนบุคคล*</FormLabel>
        <Field name="ppe">
          {({ field }) => (
            <CheckboxGroup
              value={field.value}
              onChange={(value) => handlePPEChange(value)}
            >
              <Stack spacing={2} align="start">
                <Checkbox value="ไม่ได้ใช้">ไม่ได้ใช้</Checkbox>
                <Checkbox value="หมวกผ้าคลุมหน้า" isDisabled={disableOtherPPE}>
                  หมวกผ้าคลุมหน้า
                </Checkbox>
                <Checkbox
                  value="หน้ากากอนามัยแบบเยื่อกระดาษ 3 ชั้น"
                  isDisabled={disableOtherPPE}
                >
                  หน้ากากอนามัยแบบเยื่อกระดาษ 3 ชั้น
                </Checkbox>
                <Checkbox
                  value="หน้ากากอนามัยที่ผลิตจากผ้าฝ้าย"
                  isDisabled={disableOtherPPE}
                >
                  หน้ากากอนามัยที่ผลิตจากผ้าฝ้าย
                </Checkbox>
                <Checkbox value="หน้ากากชนิด N95" isDisabled={disableOtherPPE}>
                  หน้ากากชนิด N95
                </Checkbox>
                <Checkbox value="ที่อุดหู" isDisabled={disableOtherPPE}>
                  ที่อุดหู
                </Checkbox>
                <Checkbox value="ที่ครอบหู" isDisabled={disableOtherPPE}>
                  ที่ครอบหู
                </Checkbox>
                <Checkbox value="ถุงมือนิรภัย" isDisabled={disableOtherPPE}>
                  ถุงมือนิรภัย
                </Checkbox>
                <Checkbox value="รองเท้านิรภัย" isDisabled={disableOtherPPE}>
                  รองเท้านิรภัย
                </Checkbox>
              </Stack>
            </CheckboxGroup>
          )}
        </Field>
      </FormControl>

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
          type="button"
          onClick={nextTab}
          colorScheme="green"
          className="w-full disabled:text-black"
          isDisabled={!isFormValid()}
        >
          ถัดไป
          <MdNavigateNext className="text-4xl text-bases" />
        </Button>
      </div>
    </Stack>
  );
}
