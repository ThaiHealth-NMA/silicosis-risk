import React, { useState, useEffect } from "react";
import {
  Button,
  TabPanel,
  TabPanels,
  Tabs,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
  FormControl,
  FormLabel,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import AssessSilicosisTab from "./AssessSilicosisTab";
import RiskGauge from "@/components/gauge/RiskGauge";
import AssessSilicosisResult from "./AssessSilicosisResult";
import { MdLocationOn, MdNavigateBefore } from "react-icons/md";
import Link from "next/link";
import axios from "axios";
import { useSilicosisRisk } from "@/context/SilicosisRiskContext";

export default function AssessSilicosisForm() {
  const [tabIndex, setTabIndex] = useState(0);
  const [nameNotFound, setNameNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const {
    silicosisRiskScore,
    silicosisRiskLevel,
    calculateSilicosisRisk,
    resetSilicosisRisk,
  } = useSilicosisRisk();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    resetSilicosisRisk();
    setLoading(false);
  }, []);

  const handleCalculateRisk = (values) => {
    try {
      calculateSilicosisRisk(values);
      setTabIndex(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast({
        title: "พบปัญหาการเชื่อมต่อ",
        description: "ระบบขัดข้องกรุณาติดต่อเจ้าหน้าที่",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSaveData = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/silicosis", {
        position: values.position,
        silicaDust: values.silicaDust,
        silicaDustLevel: values.silicaDustLevel,
        workingHours: values.workingHours,
        diseases: values.diseases,
        workSeparation: values.workSeparation,
        firstName: values.firstName,
        lastName: values.lastName,
        riskScore: silicosisRiskScore,
        riskLevel: silicosisRiskLevel,
        riskLatitude: values.riskLatitude,
        riskLongitude: values.riskLongitude,
      });

      if (response.status === 404 || response.data.error) {
        setNameNotFound(true);
        setLoading(false);
        return;
      }

      toast({
        title: "บันทึกข้อมูลสำเร็จ",
        description: "ระบบได้รับข้อมูลของท่านเรียบร้อย",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      resetForm();
      onClose();
      setNameNotFound(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setNameNotFound(true);
      } else {
        toast({
          title: "พบปัญหาการเชื่อมต่อ",
          description: "ระบบขัดข้องกรุณาติดต่อเจ้าหน้าที่",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setNameNotFound(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetTab = () => setTabIndex(0);

  return (
    <Formik
      initialValues={{
        position: "",
        silicaDust: "",
        silicaDustLevel: "",
        workingHours: "",
        diseases: "",
        workSeparation: "",
        firstName: "",
        lastName: "",
        riskLatitude: "",
        riskLongitude: "",
      }}
      onSubmit={handleCalculateRisk}
    >
      {({ resetForm, submitForm, values, setFieldValue }) => {
        const handleGeolocation = () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              setFieldValue("riskLatitude", position.coords.latitude);
              setFieldValue("riskLongitude", position.coords.longitude);
            });
          } else {
            toast({
              title: "ไม่สามารถปักหมุดได้",
              description: "กรุณาลองใหม่อีกครั้ง",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        };

        return (
          <Form>
            <RiskGauge riskLevel={silicosisRiskLevel} />
            <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
              <TabPanels>
                <TabPanel>
                  <AssessSilicosisTab submitForm={submitForm} />
                  <Button
                    type="button"
                    onClick={() => {
                      resetForm();
                      resetTab();
                      resetSilicosisRisk();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="w-full mt-4"
                  >
                    ล้างข้อมูล
                  </Button>
                </TabPanel>

                <TabPanel>
                  <AssessSilicosisResult riskLevel={silicosisRiskLevel} />
                  <div className="flex gap-4 items-center mt-5">
                    <Button
                      type="button"
                      onClick={() => {
                        resetForm();
                        resetTab();
                        resetSilicosisRisk();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="w-full"
                    >
                      <MdNavigateBefore className="text-4xl text-back" />
                      ประเมินอีกครั้ง
                    </Button>
                    <Button
                      type="button"
                      colorScheme="orange"
                      className="w-full"
                      onClick={onOpen}
                    >
                      บันทึกข้อมูล
                    </Button>
                  </div>
                  <Link href="/">
                    <Button
                      type="button"
                      colorScheme="green"
                      className="w-full mt-4"
                      onClick={() => {
                        resetForm();
                        resetTab();
                        resetSilicosisRisk();
                      }}
                    >
                      กลับสู่หน้าหลัก
                    </Button>
                  </Link>
                </TabPanel>
              </TabPanels>
            </Tabs>

            {/* Modal */}
            <Modal
              isOpen={isOpen}
              onClose={() => {
                setFieldValue("firstName", "");
                setFieldValue("lastName", "");
                setNameNotFound(false);
                onClose();
              }}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>ข้อมูลผู้ได้รับการประเมิน</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Stack spacing={4}>
                    <FormControl>
                      <FormLabel>ชื่อ*</FormLabel>
                      <Field
                        as={Input}
                        type="text"
                        name="firstName"
                        placeholder="ชื่อ"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>นามสกุล*</FormLabel>
                      <Field
                        as={Input}
                        type="text"
                        name="lastName"
                        placeholder="นามสกุล"
                      />
                    </FormControl>
                    <div className="flex gap-2">
                      <FormControl>
                        <FormLabel>Latitude</FormLabel>
                        <Field
                          as={Input}
                          type="number"
                          name="riskLatitude"
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
                          name="riskLongitude"
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
                      ปักหมุดสถานที่ประเมิน
                    </Button>
                    {nameNotFound && (
                      <p style={{ color: "red" }}>
                        ไม่พบชื่อนามสกุลในระบบ
                        <br />
                        กรุณาตรวจสอบชื่อนามสกุลอีกครั้ง
                        <br />
                        หรือกดลงทะเบียนผู้ประกอบอาชีพทำครกหิน
                      </p>
                    )}
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  {nameNotFound && (
                    <Link href="/register/worker">
                      <Button colorScheme="blue" mr={3} isLoading={loading}>
                        ลงทะเบียน
                      </Button>
                    </Link>
                  )}

                  <Button
                    colorScheme="green"
                    mr={3}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSaveData(values, { resetForm });
                    }}
                    isLoading={loading}
                  >
                    บันทึกข้อมูล
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setFieldValue("firstName", "");
                      setFieldValue("lastName", "");
                      setNameNotFound(false);
                      onClose();
                    }}
                  >
                    ยกเลิก
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Form>
        );
      }}
    </Formik>
  );
}
