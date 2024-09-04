import React, { useState } from "react";
import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdNavigateBefore } from "react-icons/md";
import UpdatePersonalTab from "./UpdatePersonalTab";
import UpdateHealthTab from "./UpdateHealthTab";
import UpdateWorkTab from "./UpdateWorkTab";

export default function UpdateWorkerForm() {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const nextTab = () => {
    setTabIndex((prevIndex) => prevIndex + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevTab = () => {
    setTabIndex((prevIndex) => prevIndex - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetTab = () => {
    setTabIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full p-8">
      <div className="shadow-2xl rounded-3xl p-8">
        <div className="flex flex-row justify-between items-center">
          <Button
            colorScheme="gray"
            width="fit"
            onClick={() => router.push("/admin/worker-list")}
            className=""
          >
            <MdNavigateBefore className="text-4xl text-black" />
            ย้อนกลับ
          </Button>
        </div>
        <div className="mt-4">
          <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
            <TabList>
              <Tab>ข้อมูลส่วนบุคคล</Tab>
              <Tab>ข้อมูลการทำงาน</Tab>
              <Tab>ข้อมูลสุขภาพ</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <UpdatePersonalTab />
              </TabPanel>

              <TabPanel>
                <UpdateWorkTab />
              </TabPanel>

              <TabPanel>
                <UpdateHealthTab />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
