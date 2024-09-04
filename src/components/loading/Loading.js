import React from "react";
import { Center, Spinner, Text } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Center minHeight="100vh" flexDirection="column">
      <Spinner size="lg" color="teal.500" />
      <Text mt={4} fontSize="lg" color="teal.600">
        กำลังโหลดข้อมูล...
      </Text>
    </Center>
  );
};

export default Loading;
