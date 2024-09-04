import React from "react";
import { Box } from "@chakra-ui/react";

export default function WorkLocation() {
  return (
    <Box className="w-full h-[450px] rounded-3xl shadow-xl">
      <iframe
        src="https://www.google.com/maps/d/embed?mid=17wFROfZgabiKiUc2ONZH9mtNQwnY7_0&ehbc=2E312F"
        width="100%"
        height="100%"
        allowFullScreen=""
        loading="lazy"
        className="rounded-3xl"
        title="สถานที่ประกอบอาชีพแกะสลักหิน"
      ></iframe>
    </Box>
  );
}
