export const medicalOptions = [
  { value: "", label: "เลือกสิทธิการรักษาพยาบาล" },
  { value: "ไม่มีสิทธิการรักษาพยาบาล", label: "ไม่มีสิทธิการรักษาพยาบาล" },
  { value: "สิทธิข้าราชการ", label: "สิทธิข้าราชการ" },
  { value: "สิทธิประกันสังคม", label: "สิทธิประกันสังคม" },
  { value: "สิทธิบัตรทอง 30 บาท", label: "สิทธิบัตรทอง 30 บาท" },
  {
    value: "สิทธิบัตรประกันสุขภาพต่างด้าว",
    label: "สิทธิบัตรประกันสุขภาพต่างด้าว",
  },
  { value: "สิทธิ อ.ส.ม.", label: "สิทธิ อ.ส.ม." },
  { value: "อื่น ๆ", label: "อื่น ๆ" },
];

export const diseaseOptions = [
  { value: "", label: "เลือกการมีโรคประจำตัว" },
  { value: "ไม่มีโรคประจำตัว", label: "ไม่มีโรคประจำตัว" },
  { value: "มีโรคประจำตัว", label: "มีโรคประจำตัว" },
];

export const workOptions = [
  { value: "", label: "เลือกลักษณะสถานที่ทำงาน" },
  { value: "แยกจากที่พักอาศัย", label: "แยกจากที่พักอาศัย" },
  { value: "อยู่บริเวณที่พักอาศัย", label: "อยู่บริเวณที่พักอาศัย" },
];

export const silicaDustOptions = [
  { value: "", label: "เลือกตำแหน่งงาน", silicaDust: "" },
  {
    value: "ขุดหิน (ลงบ่อหิน)",
    label: "ขุดหิน (ลงบ่อหิน)",
    silicaDustAvg: 0.005,
    silicaDustMin: null,
    silicaDustMax: 0.012,
  },
  {
    value: "ตัดหิน",
    label: "ตัดหิน",
    silicaDustAvg: 0.035,
    silicaDustMin: 0.017,
    silicaDustMax: 0.044,
  },
  {
    value: "ต๊อกหิน",
    label: "ต๊อกหิน",
    silicaDustAvg: 0.022,
    silicaDustMin: 0.005,
    silicaDustMax: 0.036,
  },
  {
    value: "แกะสลักหิน",
    label: "แกะสลักหิน",
    silicaDustAvg: 0.039,
    silicaDustMin: 0.028,
    silicaDustMax: 0.051,
  },
  {
    value: "อื่น ๆ",
    label: "อื่น ๆ",
    silicaDustAvg: "",
    silicaDustMin: "",
    silicaDustMax: "",
  },
];

export const nationOptions = [
  { value: "", label: "เลือกสัญชาติ" },
  { value: "ไทย", label: "ไทย" },
  { value: "ลาว", label: "ลาว" },
  { value: "เมียนมาร์", label: "เมียนมาร์" },
  { value: "กัมพูชา", label: "กัมพูชา" },
  { value: "อื่น ๆ", label: "อื่น ๆ" },
];
