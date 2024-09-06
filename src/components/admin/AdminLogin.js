import React, { useState } from "react";
import { useRouter } from "next/router";
import { setToken } from "../../../lib/tokenManager";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { MdNavigateBefore } from "react-icons/md";

export default function AdminLogin() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      account,
      password,
    });

    setLoading(false);

    if (result.error) {
      alert(result.error);
    } else if (result.ok) {
      const fakeToken = "thai-health-token";
      setToken(fakeToken);
      router.push("/admin/dashboard");
    }
  };

  return (
    <Box
      className="bg-gray-50 min-h-screen flex items-center justify-center"
      px={4}
    >
      <Box
        maxW="md"
        w="full"
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="md"
        className="shadow-lg"
      >
        <h1 className="text-2xl text-center font-bold pb-4">
          เข้าสู่ระบบจัดการข้อมูล
          <br />
          ผู้ประกอบอาชีพทำครกหิน
          <br />
          อ.เมือง จ.ลำปาง
        </h1>
        <VStack spacing={4}>
          <FormControl id="account">
            <FormLabel>บัญชี</FormLabel>
            <Input
              type="text"
              placeholder="ใส่บัญชี"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>รหัสผ่าน</FormLabel>
            <Input
              type="password"
              placeholder="ใส่รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button
            colorScheme="green"
            width="full"
            onClick={handleLogin}
            isLoading={loading}
            className="mt-4"
          >
            เข้าสู่ระบบ
          </Button>
          <Button
            colorScheme="gray"
            width="full"
            onClick={() => router.push("/")}
            isLoading={loading}
            className=""
          >
            <MdNavigateBefore className="text-4xl text-black" />
            กลับสู่หน้าหลัก
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
