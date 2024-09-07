import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Input,
  Select,
} from "@chakra-ui/react";
import RiskBadge from "../badges/RiskBadge";
import { RiFileEditLine } from "react-icons/ri";
import { useRouter } from "next/router";
import XrayBadge from "../badges/XrayBadge";
import WorkStatusBadge from "../badges/WorkStatusBadge";

export default function WorkerList() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("");
  const [selectedXrayResult, setSelectedXrayResult] = useState("");
  const [selectedWorkStatus, setSelectedWorkStatus] = useState("");
  const router = useRouter();
  const workersPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRiskLevel, selectedXrayResult, selectedWorkStatus]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get("/api/personal/silicosis");
        const sortedWorkers = response.data.data.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setWorkers(sortedWorkers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching worker data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const getLastThreeSilicosis = (silicosis) => {
    if (!silicosis || silicosis.length === 0) return [];

    const sortedSilicosis = [...silicosis].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return sortedSilicosis.slice(0, 3);
  };

  const matchesRiskLevel = (riskLevel, selectedLevel) => {
    if (selectedLevel === "") return true;
    const ranges = {
      0: [0, 0],
      "0.01-1.99": [0.01, 1.99],
      "2.00-2.99": [2.0, 2.99],
      "3.00-3.99": [3.0, 3.99],
      ">4.00": [4.01, Infinity],
    };
    const [min, max] = ranges[selectedLevel];
    return riskLevel >= min && riskLevel <= max;
  };

  const matchesXrayResult = (xrayResult, selectedResult) => {
    if (selectedResult === "") return true;
    return xrayResult === selectedResult;
  };

  const matchesWorkStatus = (workStatus, selectedStatus) => {
    if (selectedStatus === "") return true;
    return workStatus === selectedStatus;
  };

  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;

  const filteredWorkers = workers.filter((worker) => {
    const fullName = `${worker.first_name} ${worker.last_name}`;
    const matchesSearch = fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const lastThreeSilicosis = getLastThreeSilicosis(worker.silicosis);
    const recentRiskLevel = worker.silicosis[0]?.risk_level;
    const recentXrayResult = worker.xray[0]?.xray_chest;
    const recentWorkStatus = worker.working[0]?.work_status;

    const matchesRisk =
      selectedRiskLevel === "" ||
      matchesRiskLevel(recentRiskLevel, selectedRiskLevel);

    const matchesXray =
      selectedXrayResult === "" ||
      matchesXrayResult(recentXrayResult, selectedXrayResult);

    const matchesStatus =
      selectedWorkStatus === "" ||
      matchesWorkStatus(recentWorkStatus, selectedWorkStatus);

    return matchesSearch && matchesRisk && matchesXray && matchesStatus;
  });

  const currentWorkers = filteredWorkers.slice(
    indexOfFirstWorker,
    indexOfLastWorker
  );
  const totalPages = Math.ceil(filteredWorkers.length / workersPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  return (
    <div className="w-full p-8">
      <div className="shadow-2xl rounded-3xl p-8">
        <div className="flex md:flex-row flex-col justify-between items-center">
          <div className="">
            <h1 className="text-xl font-semibold md:text-nowrap text-wrap">
              รายชื่อผู้ประกอบอาชีพแกะสลักหิน
            </h1>
            <span className="text-sm font-semibold text-neutral">
              จำนวน {filteredWorkers.length} ข้อมูล
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 m-2">
            <Input
              placeholder="ค้นหาชื่อหรือนามสกุล"
              className="text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
            />
            <Select
              placeholder="เลือกสถานะการทำอาชีพแกะสลักหิน"
              value={selectedWorkStatus}
              onChange={(e) => setSelectedWorkStatus(e.target.value)}
              size="sm"
            >
              <option value="ไม่เคยทำอาชีพแกะสลักหิน" className="text-sm">
                ไม่เคยทำอาชีพแกะสลักหิน
              </option>
              <option value="เคยทำอาชีพแกะสลักหิน" className="text-sm">
                เคยทำอาชีพแกะสลักหิน
              </option>
              <option value="ทำอาชีพแกะสลักหินอยู่" className="text-sm">
                ทำอาชีพแกะสลักหินอยู่
              </option>
            </Select>
            <Select
              placeholder="เลือกระดับความเสี่ยง"
              className="text-sm"
              value={selectedRiskLevel}
              onChange={(e) => setSelectedRiskLevel(e.target.value)}
              size="sm"
            >
              <option value="0" className="text-sm">
                ไม่มีนัยสำคัญ
              </option>
              <option value="0.01-1.99" className="text-sm">
                น้อย
              </option>
              <option value="2.00-2.99" className="text-sm">
                ปานกลาง
              </option>
              <option value="3.00-3.99" className="text-sm">
                สูง
              </option>
              <option value=">4.00" className="text-sm">
                สูงมาก
              </option>
            </Select>
            <Select
              placeholder="เลือกผลการตรวจ x-ray ปอด"
              value={selectedXrayResult}
              onChange={(e) => setSelectedXrayResult(e.target.value)}
              size="sm"
            >
              <option value="ปกติ" className="text-sm">
                ปกติ
              </option>
              <option value="ผิดปกติ" className="text-sm">
                ผิดปกติ
              </option>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size="xl" />
          </div>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        ) : (
          <>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th className="text-sm"></Th>
                    <Th className="text-sm">ลำดับ</Th>
                    <Th className="text-sm">สถานะการทำอาชีพแกะสลักหิน</Th>
                    <Th className="text-sm">ชื่อ นามสกุล</Th>
                    <Th className="text-sm">เพศ</Th>
                    <Th className="text-sm">อายุ</Th>
                    <Th className="text-sm">ระดับความเสี่ยง</Th>
                    <Th className="text-sm">ผลการตรวจ x-ray ปอด</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {currentWorkers.map((worker, index) => {
                    const lastThreeSilicosis = getLastThreeSilicosis(
                      worker.silicosis
                    );

                    return (
                      <Tr key={worker.id}>
                        <Td className="text-sm">
                          <button
                            className="text-primary hover:text-accent"
                            onClick={() =>
                              router.push(`/admin/worker-list/${worker.id}`)
                            }
                          >
                            <RiFileEditLine />
                          </button>
                        </Td>
                        <Td className="text-sm">
                          {indexOfFirstWorker + index + 1}
                        </Td>
                        <Td className="text-sm">
                          <WorkStatusBadge
                            key={index}
                            workStatus={worker.working[0]?.work_status}
                          />
                        </Td>
                        <Td className="text-sm flex gap-3">
                          <span className="text-sm">{worker.first_name}</span>
                          <span className="text-sm">{worker.last_name}</span>
                        </Td>
                        <Td className="text-sm">{worker.gender}</Td>
                        <Td className="text-sm">{worker.age}</Td>
                        <Td className="text-sm flex gap-1">
                          {worker.silicosis.length === 0 ? (
                            <RiskBadge riskLevel={null} />
                          ) : (
                            lastThreeSilicosis.map((record) => (
                              <RiskBadge
                                key={record.created_at}
                                riskLevel={record.risk_level}
                              />
                            ))
                          )}
                        </Td>
                        <Td className="text-sm">
                          <XrayBadge
                            key={index}
                            xray={worker.xray[0]?.xray_chest}
                          />
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                colorScheme="teal"
                variant="outline"
              >
                ก่อนหน้า
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                colorScheme="teal"
                variant="outline"
              >
                ถัดไป
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
