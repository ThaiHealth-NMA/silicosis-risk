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
  InputLeftAddon,
  useToast,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import { useEffect, useState } from "react";
import {
  noiseOptions,
  vibrationOptions,
  workOptions,
} from "../register/worker/Option";
import { MdLocationOn } from "react-icons/md";
import axios from "axios";
import { useRouter } from "next/router";

export default function UpdateWorkTab() {
  const [disableOtherPPE, setDisableOtherPPE] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { personalId } = router.query;

  const [initialValues, setInitialValues] = useState({
    workStatus: "",
    position: "",
    noise: "",
    vibrateX: "",
    vibrateY: "",
    vibrateZ: "",
    vibrateAvg: "",
    vibrateTwa: "",
    workingHours: "",
    workingWeeks: "",
    workingYears: "",
    ppe: [],
    workAddress: "",
    workLatitude: "",
    workLongitude: "",
    workSeparation: "",
  });

  useEffect(() => {
    if (!personalId) return;

    const fetchWorkingData = async () => {
      try {
        const response = await axios.get(`/api/working/${personalId}`);
        const data = response.data || {};

        setInitialValues({
          workStatus: data.work_status || "",
          position: data.position || "",
          noise: data.noise || "",
          vibrateX: data.vibrate_x || "",
          vibrateY: data.vibrate_y || "",
          vibrateZ: data.vibrate_z || "",
          vibrateAvg: data.vibrate_avg || "",
          vibrateTwa: data.vibrate_twa || "",
          workingHours: data.working_hours || "",
          workingWeeks: data.working_weeks || "",
          workingYears: data.working_years || "",
          ppe: data.ppe || [],
          workAddress: data.work_address || "",
          workLatitude: data.work_latitude || "",
          workLongitude: data.work_longitude || "",
          workSeparation: data.work_separation || "",
        });
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Unable to load working data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchWorkingData();
  }, [personalId, toast]);

  const handleGeolocation = (setFieldValue) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFieldValue("workLatitude", position.coords.latitude);
          setFieldValue("workLongitude", position.coords.longitude);
          toast({
            title: "Location pinned successfully",
            description: "Your location has been updated.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        },
        () => {
          toast({
            title: "Unable to pin location",
            description: "Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Please update your browser.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePPEChange = (value, setFieldValue) => {
    if (value.includes("ไม่ได้ใช้")) {
      setFieldValue("ppe", ["ไม่ได้ใช้"]);
      setDisableOtherPPE(true);
    } else {
      setFieldValue("ppe", value);
      setDisableOtherPPE(false);
    }
  };

  const updateFormValues = (position, setFieldValue) => {
    const selectedNoisePosition = noiseOptions.find(
      (option) => option.value === position
    );
    const selectedVibrationPosition = vibrationOptions.find(
      (option) => option.value === position
    );

    if (selectedNoisePosition) {
      setFieldValue("noise", selectedNoisePosition.noiseAvg || "");
    }

    if (selectedVibrationPosition) {
      setFieldValue("vibrateX", selectedVibrationPosition.vibrateX || "");
      setFieldValue("vibrateY", selectedVibrationPosition.vibrateY || "");
      setFieldValue("vibrateZ", selectedVibrationPosition.vibrateZ || "");
      setFieldValue("vibrateAvg", selectedVibrationPosition.vibrateAvg || "");
      setFieldValue("vibrateTwa", selectedVibrationPosition.vibrateTwa || "");
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.put(`/api/working/${personalId}`, {
        workStatus: values.workStatus,
        position: values.position,
        noise: values.noise,
        vibrateX: values.vibrateX,
        vibrateY: values.vibrateY,
        vibrateZ: values.vibrateZ,
        vibrateAvg: values.vibrateAvg,
        vibrateTwa: values.vibrateTwa,
        workingHours: values.workingHours,
        workingWeeks: values.workingWeeks,
        workingYears: values.workingYears,
        ppe: values.ppe || [],
        workAddress: values.workAddress,
        workLatitude: values.workLatitude,
        workLongitude: values.workLongitude,
        workSeparation: values.workSeparation,
      });
      toast({
        title: "Update successful",
        description: "Working data has been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Unable to update working data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleSubmit,
        setFieldValue,
        isSubmitting,
      }) => {
        const handlePositionChange = (event) => {
          const newPosition = event.target.value;
          setFieldValue("position", newPosition);
          updateFormValues(newPosition, setFieldValue);
        };

        return (
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>สถานะการทำครกหิน*</FormLabel>
                <Field as={Select} name="workStatus" onBlur={handleBlur}>
                  <option value="">เลือกสถานะการทำครกหิน</option>
                  <option value="ไม่เคยทำครกหิน">ไม่เคยทำครกหิน</option>
                  <option value="เคยทำครกหิน">เคยทำครกหิน</option>
                  <option value="ทำครกหินอยู่">ทำครกหินอยู่</option>
                </Field>
              </FormControl>

              <FormControl isInvalid={!!errors.position && touched.position}>
                <FormLabel>ตำแหน่งงาน*</FormLabel>
                <Field
                  as={Select}
                  name="position"
                  onChange={handlePositionChange}
                  onBlur={handleBlur}
                >
                  {noiseOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                <FormErrorMessage>{errors.position}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.noise && touched.noise}>
                <FormLabel>ระดับเสียง*</FormLabel>
                <InputGroup>
                  <Field
                    as={Input}
                    type="number"
                    name="noise"
                    placeholder="ใส่เฉพาะตัวเลข"
                    min={0}
                    step={0.01}
                  />
                  <InputRightAddon>dB(A)</InputRightAddon>
                </InputGroup>
                <FormErrorMessage>{errors.noise}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>
                  ค่าการสั่นสะเทือน (m/s<sup>2</sup>)
                </FormLabel>
                <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
                  <InputGroup>
                    <InputLeftAddon>แกน X</InputLeftAddon>
                    <Field
                      as={Input}
                      type="number"
                      name="vibrateX"
                      placeholder="ใส่เฉพาะตัวเลข"
                      step={0.01}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon>แกน Y</InputLeftAddon>
                    <Field
                      as={Input}
                      type="number"
                      name="vibrateY"
                      placeholder="ใส่เฉพาะตัวเลข"
                      step={0.01}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon>แกน Z</InputLeftAddon>
                    <Field
                      as={Input}
                      type="number"
                      name="vibrateZ"
                      placeholder="ใส่เฉพาะตัวเลข"
                      step={0.01}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon>ค่าการสั่นสะเทือนเฉลี่ย</InputLeftAddon>
                    <Field
                      as={Input}
                      type="number"
                      name="vibrateAvg"
                      placeholder="ใส่เฉพาะตัวเลข"
                      step={0.01}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon>ค่าเฉลี่ยรับสัมผัสใน 1 วัน</InputLeftAddon>
                    <Field
                      as={Input}
                      type="number"
                      name="vibrateTwa"
                      placeholder="ใส่เฉพาะตัวเลข"
                      step={0.01}
                    />
                  </InputGroup>
                </div>
              </FormControl>

              <FormControl
                isInvalid={!!errors.workingHours && touched.workingHours}
              >
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
                  />
                  <InputRightAddon>ชั่วโมง</InputRightAddon>
                </InputGroup>
                <FormErrorMessage>{errors.workingHours}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!errors.workingWeeks && touched.workingWeeks}
              >
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
                  />
                  <InputRightAddon>วัน</InputRightAddon>
                </InputGroup>
                <FormErrorMessage>{errors.workingWeeks}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!errors.workingYears && touched.workingYears}
              >
                <FormLabel>ประสบการณ์ทำงาน*</FormLabel>
                <InputGroup>
                  <Field
                    as={Input}
                    type="number"
                    name="workingYears"
                    placeholder="ใส่เฉพาะตัวเลข (ถ้าไม่ถึงปีให้ใส่ 1 ปี)"
                    min={1}
                    step={1}
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
                  />
                </FormControl>
              </div>

              <Button
                onClick={() => handleGeolocation(setFieldValue)}
                colorScheme="teal"
              >
                <MdLocationOn />
                ปักหมุดที่ทำงาน
              </Button>

              <FormControl
                isInvalid={!!errors.workSeparation && touched.workSeparation}
              >
                <FormLabel>ลักษณะสถานที่ทำงาน*</FormLabel>
                <Field as={Select} name="workSeparation" onBlur={handleBlur}>
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
                      onChange={(value) =>
                        handlePPEChange(value, setFieldValue)
                      }
                    >
                      <Stack spacing={2} align="start">
                        <Checkbox value="ไม่ได้ใช้">ไม่ได้ใช้</Checkbox>
                        <Checkbox
                          value="หมวกผ้าคลุมหน้า"
                          isDisabled={disableOtherPPE}
                        >
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
                        <Checkbox
                          value="หน้ากากชนิด N95"
                          isDisabled={disableOtherPPE}
                        >
                          หน้ากากชนิด N95
                        </Checkbox>
                        <Checkbox value="ที่อุดหู" isDisabled={disableOtherPPE}>
                          ที่อุดหู
                        </Checkbox>
                        <Checkbox
                          value="ที่ครอบหู"
                          isDisabled={disableOtherPPE}
                        >
                          ที่ครอบหู
                        </Checkbox>
                        <Checkbox
                          value="ถุงมือนิรภัย"
                          isDisabled={disableOtherPPE}
                        >
                          ถุงมือนิรภัย
                        </Checkbox>
                        <Checkbox
                          value="รองเท้านิรภัย"
                          isDisabled={disableOtherPPE}
                        >
                          รองเท้านิรภัย
                        </Checkbox>
                      </Stack>
                    </CheckboxGroup>
                  )}
                </Field>
              </FormControl>

              <Button
                type="submit"
                colorScheme="green"
                isLoading={isSubmitting}
              >
                <span>บันทึกข้อมูล</span>
              </Button>
            </Stack>
          </form>
        );
      }}
    </Formik>
  );
}
